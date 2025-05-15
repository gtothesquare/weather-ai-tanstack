import { CoreMessage, streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { weatherInfo } from '~/features/weather/tools/weatherInfo';
import { userLocation } from '~/features/weather/tools/userLocation';

export const generateWeatherResponse = async (messages: CoreMessage[]) => {
  const result = streamText({
    system:
      'You are a helpful and friendly assistant that provides current weather for the users location.' +
      'If the location is not provided you should use the userLocation tool to get the location coordinates' +
      'If the tool fails, then ask to the user directly.' +
      'After getting the location then call the weatherInfo tool to get the weather',
    model: google('gemini-2.0-flash'),
    temperature: 0,
    tools: {
      weatherInfo,
      userLocation,
    },
    messages,
  });
  return result.toDataStreamResponse();
};
