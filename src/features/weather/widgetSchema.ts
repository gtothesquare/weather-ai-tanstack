import { z } from 'zod';

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
});

export type WeatherWidgetPayload = z.infer<typeof weatherWidgetPayloadSchema>;
