import { z } from 'zod';

export const currentWeatherSchema = z.object({
  time: z.date(),
  weatherCode: z.number(),
  temperature: z.number(),
  feelsLike: z.number(),
  humidity: z.number(),
  windSpeed: z.number(),
  windGust: z.number(),
  conditions: z.string(),
});

export const dailyWeatherSchema = z.object({
  timeValues: z.array(z.date()),
  weatherCodeValues: z.array(z.number()),
  temperatureMaxValues: z.array(z.number()),
  temperatureMinValues: z.array(z.number()),
  conditionValues: z.array(z.string()),
});

export const weatherSchema = z.object({
  current: currentWeatherSchema,
  daily: dailyWeatherSchema,
  location: z.string(),
});

export const locationSchema = z.object({
  location: z.string().describe('City name'),
});

export const coordinatesSchema = z.object({
  coordinates: z
    .object({
      latitude: z.number().describe('Location latitude coordinate'),
      longitude: z.number().describe('location longitude coordinate'),
    })
    .optional(),
});
