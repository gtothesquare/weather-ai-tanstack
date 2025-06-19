import { CoreMessage, streamText } from 'ai';
import { google } from '@ai-sdk/google';
import {
  weatherInfoWithCity,
  weatherInfoWithCoordinates,
} from '~/features/weather/tools/weatherInfo';
import { userLocation } from '~/features/location/tools/userLocation';
import prompt from './prompt.txt?raw';

export const generateWeatherResponse = async (messages: CoreMessage[]) => {
  try {
    const result = streamText({
      system: prompt,
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
