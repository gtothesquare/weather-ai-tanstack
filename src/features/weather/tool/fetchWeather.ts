import { getWeatherCondition } from './getWeatherCondition';
import { WeatherResponse } from './types';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface FetchWeatherParams {
  location?: string;
  coordinates?: Coordinates;
}

export const fetchWeather = async (params: FetchWeatherParams) => {
  let lat, long, city;

  if (params.location) {
    const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(params.location)}&count=1`;
    const geocodingResponse = await fetch(geocodingUrl);
    const geocodingData = await geocodingResponse.json();
    const { latitude, longitude, name } = geocodingData.results[0];
    lat = latitude;
    long = longitude;
    city = name;
  } else if (params.coordinates) {
    lat = params.coordinates.latitude;
    long = params.coordinates.longitude;
  }

  if (!lat || !long) {
    throw new Error(`Location '${JSON.stringify(params)}' not found`);
  }

  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_gusts_10m,weather_code`;

  const response = await fetch(weatherUrl);
  const data: WeatherResponse = await response.json();

  return {
    weatherCode: data.current.weather_code,
    temperature: data.current.temperature_2m,
    feelsLike: data.current.apparent_temperature,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    windGust: data.current.wind_gusts_10m,
    conditions: getWeatherCondition(data.current.weather_code),
    location: city,
  };
};
