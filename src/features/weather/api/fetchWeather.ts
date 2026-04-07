import { fetchWeatherApi } from 'openmeteo';
import { fetchGeoCodeLocation } from './fetchGeoCodeLocation';
import { getWeatherCondition } from './getWeatherCondition';
import { fetchReverseGeoCodeLocation } from '~/features/weather/api/fetchReverseGeoCodeLocation';
import {
  WEATHER_CURRENT_KEYS,
  WEATHER_CURRENT_PARAMS,
  WEATHER_DAILY_KEYS,
  WEATHER_DAILY_PARAMS,
} from '~/features/weather/api/constants';
import { Coordinates, LocationParams, WeatherData } from '../types';

type FetchWeatherParams = LocationParams | Coordinates;
type WeatherProviderErrorCode =
  | 'location-not-found'
  | 'provider-rate-limit'
  | 'provider-unavailable';

export const WEATHER_CACHE_TTL_MS = 2 * 60 * 1000;

const WEATHER_RETRY_DELAYS_MS = [300, 900, 1800] as const;

const weatherResponseCache = new Map<
  string,
  { data: WeatherData; expiresAt: number }
>();

const inFlightWeatherRequests = new Map<string, Promise<WeatherData>>();

interface WeatherVariable {
  value(): number;
  valuesArray(): ArrayLike<number> | null;
}

interface WeatherVariableContainer {
  variables(index: number): WeatherVariable | null;
}

interface CurrentWeatherResponse extends WeatherVariableContainer {
  time(): number | bigint;
}

interface DailyWeatherResponse extends WeatherVariableContainer {
  interval(): number;
  time(): number | bigint;
  timeEnd(): number | bigint;
}

interface ForecastResponse {
  current(): CurrentWeatherResponse | null;
  daily(): DailyWeatherResponse | null;
  utcOffsetSeconds(): number;
}

interface ResolvedForecastLocation {
  city?: string;
  latitude: number;
  longitude: number;
}

export class WeatherProviderError extends Error {
  code: WeatherProviderErrorCode;

  constructor(code: WeatherProviderErrorCode, message: string) {
    super(message);
    this.name = 'WeatherProviderError';
    this.code = code;
  }
}

const toIntArray = (val: number) => {
  return Math.ceil(val);
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function hasCoordinates(lat?: number, lon?: number) {
  return Number.isFinite(lat) && Number.isFinite(lon);
}

function isOpenMeteoRateLimitError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();

  return (
    message.includes('too many concurrent requests') ||
    message.includes('rate limit') ||
    message.includes('429')
  );
}

function isTransientWeatherProviderError(error: unknown) {
  if (error instanceof WeatherProviderError) {
    return error.code !== 'location-not-found';
  }

  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();

  return (
    isOpenMeteoRateLimitError(error) ||
    message.includes('fetch failed') ||
    message.includes('network') ||
    message.includes('temporarily unavailable') ||
    message.includes('timed out')
  );
}

function toWeatherProviderError(error: unknown) {
  if (error instanceof WeatherProviderError) {
    return error;
  }

  if (isOpenMeteoRateLimitError(error)) {
    return new WeatherProviderError(
      'provider-rate-limit',
      'Open-Meteo is rate limiting requests right now.'
    );
  }

  if (error instanceof Error) {
    return new WeatherProviderError('provider-unavailable', error.message);
  }

  return new WeatherProviderError(
    'provider-unavailable',
    'The weather service is temporarily unavailable.'
  );
}

function normalizeWeatherRequestKey(params: FetchWeatherParams) {
  if ('location' in params) {
    return `city:${params.location.trim().toLowerCase().replace(/\s+/g, ' ')}`;
  }

  const latitude = params.coordinates?.latitude;
  const longitude = params.coordinates?.longitude;

  return `coordinates:${latitude?.toFixed(3) ?? 'unknown'}:${longitude?.toFixed(3) ?? 'unknown'}`;
}

function getCachedWeather(key: string) {
  const cached = weatherResponseCache.get(key);

  if (!cached) {
    return null;
  }

  if (cached.expiresAt <= Date.now()) {
    weatherResponseCache.delete(key);
    return null;
  }

  return cached.data;
}

function setCachedWeather(key: string, data: WeatherData) {
  weatherResponseCache.set(key, {
    data,
    expiresAt: Date.now() + WEATHER_CACHE_TTL_MS,
  });
}

function requireVariable<
  T extends { variables: (index: number) => WeatherVariable | null },
>(container: T, index: number, label: string) {
  const variable = container.variables(index);

  if (!variable) {
    throw new WeatherProviderError(
      'provider-unavailable',
      `The weather service returned an incomplete forecast for ${label}.`
    );
  }

  return variable;
}

async function resolveForecastLocation(
  params: FetchWeatherParams
): Promise<ResolvedForecastLocation> {
  let lat: number | undefined;
  let lon: number | undefined;
  let city: string | undefined;

  if ('location' in params) {
    const result = await fetchGeoCodeLocation(params.location);

    if (result) {
      lat = result.latitude;
      lon = result.longitude;
      city = result.city;
    }
  } else {
    lat = params.coordinates?.latitude;
    lon = params.coordinates?.longitude;

    if (lat !== undefined && lon !== undefined && hasCoordinates(lat, lon)) {
      const result = await fetchReverseGeoCodeLocation(lat, lon);
      city = result?.name;
    }
  }

  if (!hasCoordinates(lat, lon)) {
    throw new WeatherProviderError(
      'location-not-found',
      'I could not determine a valid forecast location.'
    );
  }

  const latitude = lat as number;
  const longitude = lon as number;

  return {
    latitude,
    longitude,
    city,
  };
}

async function fetchWeatherForecast(latitude: number, longitude: number) {
  const weatherUrl = 'https://api.open-meteo.com/v1/forecast';
  const weatherParams = {
    latitude,
    longitude,
    daily: WEATHER_DAILY_KEYS,
    current: WEATHER_CURRENT_KEYS,
    timezone: 'auto',
  };

  for (let attempt = 0; attempt <= WEATHER_RETRY_DELAYS_MS.length; attempt++) {
    try {
      const weatherApiResponse = await fetchWeatherApi(
        weatherUrl,
        weatherParams,
        3,
        0.2,
        2
      );
      const response = weatherApiResponse[0] as ForecastResponse | undefined;

      if (!response) {
        throw new WeatherProviderError(
          'provider-unavailable',
          'The weather service returned no forecast data.'
        );
      }

      const current = response.current();
      const daily = response.daily();

      if (!current || !daily) {
        throw new WeatherProviderError(
          'provider-unavailable',
          'The weather service returned an incomplete forecast.'
        );
      }

      return { current, daily, response };
    } catch (error) {
      const providerError = toWeatherProviderError(error);

      if (
        !isTransientWeatherProviderError(providerError) ||
        attempt === WEATHER_RETRY_DELAYS_MS.length
      ) {
        throw providerError;
      }

      await sleep(WEATHER_RETRY_DELAYS_MS[attempt]);
    }
  }

  throw new WeatherProviderError(
    'provider-unavailable',
    'The weather service is temporarily unavailable.'
  );
}

async function fetchWeatherUncached(
  params: FetchWeatherParams
): Promise<WeatherData> {
  const { latitude, longitude, city } = await resolveForecastLocation(params);
  const { response, current, daily } = await fetchWeatherForecast(
    latitude,
    longitude
  );
  const utcOffsetSeconds = response.utcOffsetSeconds();
  const currentWeatherCode = requireVariable(
    current,
    WEATHER_CURRENT_PARAMS.weather_code.index,
    'current conditions'
  ).value();
  const dailyWeatherCodes = Array.from(
    requireVariable(
      daily,
      WEATHER_DAILY_PARAMS.weather_code.index,
      'daily conditions'
    ).valuesArray()!
  );

  return {
    location: city ?? '',
    current: {
      time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
      temperature: toIntArray(
        requireVariable(
          current,
          WEATHER_CURRENT_PARAMS.temperature_2m.index,
          'temperature'
        ).value()
      ),
      weatherCode: currentWeatherCode,
      feelsLike: toIntArray(
        requireVariable(
          current,
          WEATHER_CURRENT_PARAMS.apparent_temperature.index,
          'apparent temperature'
        ).value()
      ),
      humidity: toIntArray(
        requireVariable(
          current,
          WEATHER_CURRENT_PARAMS.relative_humidity_2m.index,
          'humidity'
        ).value()
      ),
      windSpeed: toIntArray(
        requireVariable(
          current,
          WEATHER_CURRENT_PARAMS.wind_speed_10m.index,
          'wind speed'
        ).value()
      ),
      windGust: toIntArray(
        requireVariable(
          current,
          WEATHER_CURRENT_PARAMS.wind_gusts_10m.index,
          'wind gusts'
        ).value()
      ),
      conditions: getWeatherCondition(currentWeatherCode),
    },
    daily: {
      timeValues: [
        ...Array(
          (Number(daily.timeEnd()) - Number(daily.time())) / daily.interval()
        ),
      ].map((_, i) =>
        new Date(
          (Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) *
            1000
        ).toLocaleString()
      ),
      weatherCodeValues: dailyWeatherCodes,
      temperatureMaxValues: Array.from(
        requireVariable(
          daily,
          WEATHER_DAILY_PARAMS.temperature_2m_max.index,
          'daily high temperatures'
        ).valuesArray()!
      ).map(toIntArray),
      temperatureMinValues: Array.from(
        requireVariable(
          daily,
          WEATHER_DAILY_PARAMS.temperature_2m_min.index,
          'daily low temperatures'
        ).valuesArray()!
      ).map(toIntArray),
      conditionValues: dailyWeatherCodes.map((code) => {
        return getWeatherCondition(code);
      }),
    },
  };
}

export const fetchWeather = async (
  params: FetchWeatherParams
): Promise<WeatherData> => {
  const key = normalizeWeatherRequestKey(params);
  const cached = getCachedWeather(key);

  if (cached) {
    return cached;
  }

  const inFlight = inFlightWeatherRequests.get(key);

  if (inFlight) {
    return inFlight;
  }

  const request = fetchWeatherUncached(params)
    .then((data) => {
      setCachedWeather(key, data);
      return data;
    })
    .finally(() => {
      inFlightWeatherRequests.delete(key);
    });

  inFlightWeatherRequests.set(key, request);
  return request;
};
