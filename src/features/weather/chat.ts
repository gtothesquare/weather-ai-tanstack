import {
  chat,
  convertMessagesToModelMessages,
  maxIterations,
  toServerSentEventsResponse,
} from '@tanstack/ai';
import { openaiCompatibleText } from '@tanstack/ai-openai/compatible';
import prompt from './prompt.txt?raw';
import { userLocationTool } from './tools';
import {
  weatherInfoWithCityServerTool,
  weatherInfoWithCoordinatesServerTool,
} from './tools.server';

export function generateWeatherResponse(messages: unknown[]) {
  const stream = chat({
    adapter: openaiCompatibleText('glm-5.2', {
      name: 'grunden',
      baseURL: 'https://api.grunden.ai/v1',
      apiKey: process.env.GRUNDEN_API_KEY!,
    }),
    messages: convertMessagesToModelMessages(messages as never[]) as never[],
    systemPrompts: [prompt],
    modelOptions: {
      temperature: 0,
    },
    tools: [
      userLocationTool,
      weatherInfoWithCityServerTool,
      weatherInfoWithCoordinatesServerTool,
    ],
    agentLoopStrategy: maxIterations(5),
  });

  return toServerSentEventsResponse(stream);
}
