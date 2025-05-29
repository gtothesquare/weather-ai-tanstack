import { CoreMessage, streamText } from 'ai';
import { google } from '@ai-sdk/google';
import {
  weatherInfoWithCity,
  weatherInfoWithCoordinates,
} from '~/features/weather/tools/weatherInfo';
import { userLocation } from '~/features/location/tools/userLocation';

export const generateWeatherResponse = async (messages: CoreMessage[]) => {
  try {
    const result = streamText({
      system:
        'You are a helpful and friendly assistant that provides the weather forecast in natural text and as a widget ' +
        'for the user location.' +
        'Get the user location using the userLocation tool to get the user coordinates longitude and latitude.' +
        'If you get the coordinates, use the weatherInfoWithCoordinates tool. If getting coordinates fails' +
        'then ask to the user directly for the location.' +
        'If user gives you a location or city, use the weatherInfoWithCity tool to get the forecast',
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
