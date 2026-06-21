import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { generateWeatherResponse } from '~/features/weather/chat';

const weatherRequestSchema = z.object({
  messages: z.array(z.unknown()),
});

export const Route = createFileRoute('/api/weather')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let requestBody: unknown;

        try {
          requestBody = await request.json();
        } catch {
          return Response.json(
            { error: 'Invalid weather request body' },
            { status: 400 }
          );
        }

        const body = weatherRequestSchema.safeParse(requestBody);

        if (!body.success) {
          return Response.json(
            { error: 'Invalid weather request body' },
            { status: 400 }
          );
        }

        try {
          return generateWeatherResponse(body.data.messages);
        } catch (err) {
          const error = err as Error;
          const message = error.message;
          return Response.json(
            { error: 'Weather response error', message },
            {
              status: 500,
            }
          );
        }
      },
    },
  },
});
