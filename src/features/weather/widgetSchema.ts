import { z } from 'zod';
import { weatherSchema } from './schemas';

export const serializedCurrentWeatherSchema =
  weatherSchema.shape.current.extend({
    time: z.string(),
  });

export const serializedWeatherSchema = weatherSchema.extend({
  current: serializedCurrentWeatherSchema,
});

export const musicSuggestionSchema = z.object({
  source: z.literal('spotify'),
  title: z.string(),
  artists: z.array(z.string()).min(1),
  artworkUrl: z.url().optional(),
  spotifyUrl: z.url(),
  query: z.string(),
  reason: z.string(),
});

export const weatherWidgetPayloadSchema = z.object({
  type: z.literal('weather-forecast'),
  query: z.discriminatedUnion('kind', [
    z.object({
      kind: z.literal('city'),
      location: z.string(),
    }),
    z.object({
      kind: z.literal('coordinates'),
      latitude: z.number(),
      longitude: z.number(),
    }),
  ]),
  showMap: z.boolean().default(false),
  forecast: serializedWeatherSchema.optional(),
  musicSuggestion: musicSuggestionSchema.optional(),
});

export type WeatherWidgetPayload = z.infer<typeof weatherWidgetPayloadSchema>;
export type MusicSuggestion = z.infer<typeof musicSuggestionSchema>;
export type SerializedWeatherData = z.infer<typeof serializedWeatherSchema>;
