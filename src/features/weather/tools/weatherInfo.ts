import { tool } from 'ai';

import { fetchWeather } from '../api/fetchWeather';
import { coordinatesSchema, locationSchema } from '../schemas';
import { z } from 'zod';

export const weatherInfo = tool({
  description: 'Provide the weather for a location to the user.',
  parameters: z.union([locationSchema, coordinatesSchema]),
  execute: async (context) => {
    try {
      const result = await fetchWeather({
        location: context.location,
        coordinates: context?.coordinates,
      });

      return {
        success: true,
        data: result,
      };
    } catch (err) {
      const error =
        err instanceof Error
          ? err.message
          : 'Unknown error fetching weather info';
      return {
        success: false,
        error,
      };
    }
  },
});
