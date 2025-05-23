import { createAPIFileRoute } from '@tanstack/react-start/api';
import { generateWeatherResponse } from '~/features/weather';

export const APIRoute = createAPIFileRoute('/api/weather')({
  POST: async ({ request }) => {
    const { messages } = await request.json();

    return generateWeatherResponse(messages);
  },
});
