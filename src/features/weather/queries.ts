import { queryOptions } from '@tanstack/react-query';
import { fetchWeather } from './api/fetchWeather';

export type WeatherQueryInput =
  | {
      kind: 'city';
      location: string;
    }
  | {
      kind: 'coordinates';
      latitude: number;
      longitude: number;
    };

export const weatherQueryOptions = (input: WeatherQueryInput) =>
  queryOptions({
    queryKey:
      input.kind === 'city'
        ? ['weather', 'city', input.location]
        : ['weather', 'coordinates', input.latitude, input.longitude],
    queryFn: () =>
      input.kind === 'city'
        ? fetchWeather({ location: input.location })
        : fetchWeather({
            coordinates: {
              latitude: input.latitude,
              longitude: input.longitude,
            },
          }),
  });
