import { toolDefinition } from '@tanstack/ai';
import { z } from 'zod';
import { fetchWeather } from './api/fetchWeather';
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

  return weatherToolOutputSchema.parse({
    location: data.location,
    summary: `Current weather in ${data.location}: ${data.current.temperature}°, ${data.current.conditions}.`,
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
    return buildSummary({ kind: 'city', location });
  }
);

export const weatherInfoWithCoordinatesServerTool =
  weatherInfoWithCoordinatesTool.server(async (args) => {
    const { coordinates } = coordinatesSchema.parse(args);

    return buildSummary({
      kind: 'coordinates',
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    });
  });
