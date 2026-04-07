import { toolDefinition } from '@tanstack/ai';
import { z } from 'zod';
import { fetchWeather } from './api/fetchWeather';
import { fetchMusicSuggestion } from './api/fetchMusicSuggestion';
import { weatherWidgetPayloadSchema } from './widgetSchema';

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
  const fallback =
    input.kind === 'coordinates'
      ? 'I could not retrieve the weather for your current location. Please try a nearby city name instead.'
      : `I could not retrieve the weather for ${input.location}. Please try a nearby city or a more specific place name.`;

  if (!(error instanceof Error) || !error.message) {
    return fallback;
  }

  if (
    error.message.includes('incomplete forecast') ||
    error.message.includes('no forecast data') ||
    error.message.includes('valid forecast location')
  ) {
    return fallback;
  }

  return error.message;
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
      throw new Error(
        toWeatherToolErrorMessage(error, { kind: 'city', location })
      );
    }
  }
);

export const weatherInfoWithCoordinatesServerTool =
  weatherInfoWithCoordinatesTool.server(async (args) => {
    const { coordinates } = coordinatesSchema.parse(args);

    try {
      return await buildSummary({
        kind: 'coordinates',
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      });
    } catch (error) {
      throw new Error(
        toWeatherToolErrorMessage(error, {
          kind: 'coordinates',
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        })
      );
    }
  });
