import { z } from 'zod';

export const musicSuggestionSchema = z.object({
  source: z.literal('spotify'),
  title: z.string(),
  artists: z.array(z.string()).min(1),
  artworkUrl: z.string().url().optional(),
  spotifyUrl: z.string().url(),
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
  musicSuggestion: musicSuggestionSchema.optional(),
});

export type WeatherWidgetPayload = z.infer<typeof weatherWidgetPayloadSchema>;
export type MusicSuggestion = z.infer<typeof musicSuggestionSchema>;
