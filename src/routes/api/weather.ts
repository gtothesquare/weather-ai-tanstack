import { createFileRoute } from '@tanstack/react-router';
import { generateWeatherResponse } from '~/features/weather';

export const Route = createFileRoute('/api/weather')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = await request.json();
        try {
          return generateWeatherResponse(messages);
        } catch (err) {
          const error = err as Error;
          const message = error.message;
          return new Response('Weather response error', {
            status: 500,
            statusText: message,
          });
        }
      },
    },
  },
});
