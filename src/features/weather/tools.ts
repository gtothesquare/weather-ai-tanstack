import { toolDefinition } from '@tanstack/ai';
import { z } from 'zod';
import { fetchWeather, WeatherProviderError } from './api/fetchWeather';
import { fetchMusicSuggestion } from './api/fetchMusicSuggestion';
import { weatherWidgetPayloadSchema } from './widgetSchema';
import type { WeatherData } from './types';

const locationSchema = z.object({
  location: z.string().describe('City name'),
});

const coordinatesSchema = z.object({
  coordinates: z.object({
    latitude: z.number().describe('Location latitude coordinate'),
    longitude: z.number().describe('Location longitude coordinate'),
  }),
});

const userLocationOutputSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

const weatherToolOutputSchema = z.object({
  location: z.string(),
  summary: z.string(),
  widget: weatherWidgetPayloadSchema,
});

function toWeatherToolErrorMessage(
  error: unknown,
  input:
    | { kind: 'city'; location: string }
    | { kind: 'coordinates'; latitude: number; longitude: number }
) {
  const locationFallback =
    input.kind === 'coordinates'
      ? 'I could not retrieve the weather for your current location. Please try a nearby city name instead.'
      : `I could not retrieve the weather for ${input.location}. Please try a nearby city or a more specific place name.`;

  if (error instanceof WeatherProviderError) {
    if (error.code === 'provider-rate-limit') {
      return 'The weather provider is rate limiting requests right now. Please try again in a moment.';
    }

    if (error.code === 'location-not-found') {
      return locationFallback;
    }

    return 'The weather provider is temporarily unavailable. Please try again in a moment.';
  }

  if (!(error instanceof Error) || !error.message) {
    return locationFallback;
  }

  if (
    error.message.includes('incomplete forecast') ||
    error.message.includes('no forecast data') ||
    error.message.includes('valid forecast location')
  ) {
    return locationFallback;
  }

  return error.message;
}

function logWeatherToolError(
  toolName: string,
  input:
    | { kind: 'city'; location: string }
    | { kind: 'coordinates'; latitude: number; longitude: number },
  error: unknown,
  userMessage: string
) {
  console.error(`[${toolName}] failed`, {
    input,
    userMessage,
    errorMessage: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
  });
}

function serializeWeatherData(data: WeatherData) {
  return {
    ...data,
    current: {
      ...data.current,
      time: data.current.time.toISOString(),
    },
  };
}

const buildSummary = async (
  input:
    | { kind: 'city'; location: string }
    | { kind: 'coordinates'; latitude: number; longitude: number }
) => {
  const data =
    input.kind === 'city'
      ? await fetchWeather({ location: input.location })
      : await fetchWeather({
          coordinates: {
            latitude: input.latitude,
            longitude: input.longitude,
          },
        });
  const musicSuggestion = await fetchMusicSuggestion(data).catch(
    () => undefined
  );
  const musicSummary = musicSuggestion
    ? ` Music suggestion: "${musicSuggestion.title}" by ${musicSuggestion.artists.join(', ')}.`
    : '';

  return weatherToolOutputSchema.parse({
    location: data.location,
    summary: `Current weather in ${data.location}: ${data.current.temperature}°, ${data.current.conditions}.${musicSummary}`,
    widget: {
      type: 'weather-forecast',
      query:
        input.kind === 'city'
          ? { kind: 'city', location: input.location }
          : {
              kind: 'coordinates',
              latitude: input.latitude,
              longitude: input.longitude,
            },
      showMap: input.kind === 'coordinates',
      forecast: serializeWeatherData(data),
      musicSuggestion,
    },
  });
};

export const userLocationTool = toolDefinition({
  name: 'userLocation',
  description: 'Get the user coordinates from the browser.',
  outputSchema: userLocationOutputSchema,
});

export const weatherInfoWithCityTool = toolDefinition({
  name: 'weatherInfoWithCity',
  description: 'Provide the weather forecast for a location.',
  inputSchema: locationSchema,
  outputSchema: weatherToolOutputSchema,
});

export const weatherInfoWithCoordinatesTool = toolDefinition({
  name: 'weatherInfoWithCoordinates',
  description: 'Provide the weather forecast for the user coordinates.',
  inputSchema: coordinatesSchema,
  outputSchema: weatherToolOutputSchema,
});

export const weatherInfoWithCityServerTool = weatherInfoWithCityTool.server(
  async (args) => {
    const { location } = locationSchema.parse(args);
    try {
      return await buildSummary({ kind: 'city', location });
    } catch (error) {
      const input = { kind: 'city' as const, location };
      const userMessage = toWeatherToolErrorMessage(error, input);
      logWeatherToolError('weatherInfoWithCity', input, error, userMessage);
      throw new Error(userMessage);
    }
  }
);

export const weatherInfoWithCoordinatesServerTool =
  weatherInfoWithCoordinatesTool.server(async (args) => {
    const { coordinates } = coordinatesSchema.parse(args);
    const input = {
      kind: 'coordinates' as const,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    };

    try {
      return await buildSummary(input);
    } catch (error) {
      const userMessage = toWeatherToolErrorMessage(error, input);
      logWeatherToolError(
        'weatherInfoWithCoordinates',
        input,
        error,
        userMessage
      );
      throw new Error(userMessage);
    }
  });
