import { z } from 'zod';
import { weatherSchema } from './schemas';

export interface CurrentWeather {
  time: string;
  temperature_2m: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  wind_speed_10m: number;
  wind_gusts_10m: number;
  weather_code: number;
}

export type WeatherData = z.infer<typeof weatherSchema>;

export interface WeatherResponse {
  current: CurrentWeather;
}
