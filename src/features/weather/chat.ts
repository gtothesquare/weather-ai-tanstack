import {
  chat,
  convertMessagesToModelMessages,
  maxIterations,
  toServerSentEventsResponse,
} from '@tanstack/ai';
import { geminiText } from '@tanstack/ai-gemini';
import prompt from './prompt.txt?raw';
import { userLocationTool } from './tools';
import {
  weatherInfoWithCityServerTool,
  weatherInfoWithCoordinatesServerTool,
} from './tools.server';

export function generateWeatherResponse(messages: unknown[]) {
  const stream = chat({
    adapter: geminiText('gemini-2.5-flash'),
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
