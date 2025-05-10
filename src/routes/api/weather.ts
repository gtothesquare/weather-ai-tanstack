import { createAPIFileRoute } from '@tanstack/react-start/api';
import { CoreMessage, streamText, tool } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { fetchWeather } from '~/features/weather/tool/fetchWeather';

const weatherInfo = tool({
  description: 'show the weather in a given city to the user',
  parameters: z.object({
    location: z.string().describe('City name'),
    /*coordinates: z
      .object({
        latitude: z.number().describe('Location latitude coordinate'),
        longitude: z.number().describe('location longitude coordinate'),
      })
      .optional(),*/
  }),
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
          : 'Unknown error fetching weather info';
      return {
        success: false,
        error,
      };
    }
  },
});

const getUserLocation = tool({
  description: 'Get user coordinates using the user browser api',
  parameters: z.object({
    coordinates: z.object({
      latitude: z.number().describe('Location latitude coordinate'),
      longitude: z.number().describe('location longitude coordinate'),
    }),
  }),
});

const generateWeatherResponse = async (messages: CoreMessage[]) => {
  const result = streamText({
    system:
      'You are a helpful assistant that provides current weather information based on the location provided',
    model: google('gemini-2.0-flash'),
    tools: {
      weatherInfo,
      getUserLocation,
    },
    messages,
  });
  return result.toDataStreamResponse();
};

export const APIRoute = createAPIFileRoute('/api/weather')({
  POST: async ({ request }) => {
    const { messages } = await request.json();

    return generateWeatherResponse(messages);
  },
});
