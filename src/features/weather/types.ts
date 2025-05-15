import { z } from 'zod';
import { coordinatesSchema, locationSchema, weatherSchema } from './schemas';

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

export type Location = z.infer<typeof locationSchema>;
export type Coordinates = z.infer<typeof coordinatesSchema>;
