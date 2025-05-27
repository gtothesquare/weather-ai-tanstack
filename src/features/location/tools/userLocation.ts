import { tool } from 'ai';
import { coordinatesSchema } from '~/features/weather/schemas';

export const userLocation = tool({
  description: 'Get the user coordinates',
  parameters: coordinatesSchema,
});
