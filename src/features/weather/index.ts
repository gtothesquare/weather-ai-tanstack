import { CoreMessage, streamText } from 'ai';
import { google } from '@ai-sdk/google';
import {
  weatherInfoWithCity,
  weatherInfoWithCoordinates,
} from '~/features/weather/tools/weatherInfo';
import { userLocation } from '~/features/weather/tools/userLocation';

export const generateWeatherResponse = async (messages: CoreMessage[]) => {
  try {
    const result = streamText({
      system:
        'You are a helpful and friendly assistant that provides current weather for the users location.' +
        'If the location is not provided you should use the userLocation tool to get the user coordinates' +
        'If the tool fails, then ask to the user directly for the city.' +
        'After getting the location then call the weatherInfo tool to get the weather',
      model: google('gemini-2.0-flash'),
      temperature: 0,
      tools: {
        userLocation,
        weatherInfoWithCity,
        weatherInfoWithCoordinates,
      },
      messages,
      onError({ error }) {
        console.error(error); // your error logging logic here
      },
    });
    return result.toDataStreamResponse();
  } catch (error) {
    // TODO do i need to stream this ??
    console.log(error);
    return error;
  }
};
