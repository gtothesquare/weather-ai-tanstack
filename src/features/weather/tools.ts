import { toolDefinition } from '@tanstack/ai';
import { z } from 'zod';
import { weatherWidgetPayloadSchema } from './widgetSchema';

export const locationSchema = z.object({
  location: z.string().describe('City name'),
});

export const coordinatesSchema = z.object({
  coordinates: z.object({
    latitude: z.number().describe('Location latitude coordinate'),
    longitude: z.number().describe('Location longitude coordinate'),
  }),
});

const userLocationOutputSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

export const weatherToolOutputSchema = z.object({
  location: z.string(),
  summary: z.string(),
  widget: weatherWidgetPayloadSchema,
});

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
