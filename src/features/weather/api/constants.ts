export const WEATHER_DAILY_PARAMS = {
  weather_code: {
    key: 'weather_code',
    index: 0,
  },
  temperature_2m_max: {
    key: 'temperature_2m_max',
    index: 1,
  },
  temperature_2m_min: {
    key: 'temperature_2m_min',
    index: 2,
  },
} as const;

export const WEATHER_DAILY_KEYS = Object.keys(WEATHER_DAILY_PARAMS);

export const WEATHER_CURRENT_PARAMS = {
  temperature_2m: {
    key: 'temperature_2m',
    index: 0,
  },
  weather_code: {
    key: 'weather_code',
    index: 1,
  },
  apparent_temperature: {
    key: 'apparent_temperature',
    index: 2,
  },
  relative_humidity_2m: {
    key: 'relative_humidity_2m',
    index: 3,
  },
  wind_speed_10m: {
    key: 'wind_speed_10m',
    index: 4,
  },
  wind_gusts_10m: {
    key: 'wind_gusts_10m',
    index: 5,
  },
} as const;

export const WEATHER_CURRENT_KEYS = Object.keys(WEATHER_CURRENT_PARAMS);
