import { generateWeatherResponse } from '~/features/weather';
import { createServerFileRoute } from '@tanstack/react-start/server';

export const ServerRoute = createServerFileRoute('/api/weather').methods({
  POST: async ({ request }) => {
    const { messages } = await request.json();

    return generateWeatherResponse(messages);
  },
});
