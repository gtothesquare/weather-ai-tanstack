import { tool } from 'ai';

import { fetchWeather } from '../api/fetchWeather';
import { coordinatesSchema, locationSchema } from '../schemas';

export const weatherInfoWithCity = tool({
  description: 'Provide the weather for a location to the user.',
  parameters: locationSchema,
  execute: async (context) => {
    try {
      const result = await fetchWeather({
        location: context.location,
      });

      return {
        success: true,
        data: result,
      };
    } catch (err) {
      const error =
        err instanceof Error
          ? err.message
          : 'Unknown error fetching weather info with city';
      return {
        success: false,
        error,
      };
    }
  },
});

export const weatherInfoWithCoordinates = tool({
  description: 'Provide the weather for the coordinates of the user.',
  parameters: coordinatesSchema,
  execute: async (context) => {
    try {
      const result = await fetchWeather({
        coordinates: context.coordinates,
      });

      return {
        success: true,
        data: result,
      };
    } catch (err) {
      const error =
        err instanceof Error
          ? err.message
          : 'Unknown error fetching weather info with coordinates';
      return {
        success: false,
        error,
      };
    }
  },
});
