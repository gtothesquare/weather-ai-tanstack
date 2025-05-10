import { z } from 'zod';

export const weatherSchema = z.object({
  weatherCode: z.number(),
  temperature: z.number(),
  feelsLike: z.number(),
  humidity: z.number(),
  windSpeed: z.number(),
  windGust: z.number(),
  conditions: z.string(),
  location: z.string(),
});

export const outputSchema = z.object({
  success: z.boolean(),
  data: weatherSchema.optional(),
  error: z.string().optional(),
});
