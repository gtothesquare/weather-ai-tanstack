import { getWeatherCondition } from './getWeatherCondition';
import { Coordinates, LocationParams, WeatherData } from '../types';
import { fetchWeatherApi } from 'openmeteo';
import { fetchGeoCodeLocation } from './fetchGeoCodeLocation';
import { fetchReverseGeoCodeLocation } from '~/features/weather/api/fetchReverseGeoCodeLocation';
import {
  WEATHER_CURRENT_KEYS,
  WEATHER_CURRENT_PARAMS,
  WEATHER_DAILY_KEYS,
  WEATHER_DAILY_PARAMS,
} from '~/features/weather/api/constants';

type FetchWeatherParams = LocationParams | Coordinates;

const toIntArray = (val: number) => {
  return Math.ceil(val);
};

function hasCoordinates(lat?: number, lon?: number) {
  return Number.isFinite(lat) && Number.isFinite(lon);
}

interface WeatherVariable {
  value(): number;
  valuesArray(): ArrayLike<number> | null;
}

interface WeatherVariableContainer {
  variables(index: number): WeatherVariable | null;
}

function requireVariable<
  T extends { variables: (index: number) => WeatherVariable | null },
>(container: T, index: number, label: string) {
  const variable = container.variables(index);

  if (!variable) {
    throw new Error(
      `The weather service returned an incomplete forecast for ${label}.`
    );
  }

  return variable;
}

export const fetchWeather = async (
  params: FetchWeatherParams
): Promise<WeatherData> => {
  let lat: number | undefined,
    lon: number | undefined,
    city: string | undefined;

  if ('location' in params) {
    const result = await fetchGeoCodeLocation(params.location);
    if (result) {
      const { latitude, longitude, city: cityLocation } = result;
      lat = latitude;
      lon = longitude;
      city = cityLocation;
    }
  } else {
    lat = params.coordinates?.latitude;
    lon = params.coordinates?.longitude;
    if (
      lat !== undefined &&
      lon !== undefined &&
      Number.isFinite(lat) &&
      Number.isFinite(lon)
    ) {
      const result = await fetchReverseGeoCodeLocation(lat, lon);
      city = result?.name;
    }
  }

  if (!hasCoordinates(lat, lon)) {
    throw new Error('I could not determine a valid forecast location.');
  }

  const latitude = lat;
  const longitude = lon;

  const weatherParams = {
    latitude,
    longitude,
    daily: WEATHER_DAILY_KEYS,
    current: WEATHER_CURRENT_KEYS,
    timezone: 'auto',
  };

  const weatherUrl = `https://api.open-meteo.com/v1/forecast`;

  const weatherApiResponse = await fetchWeatherApi(weatherUrl, weatherParams);
  const response = weatherApiResponse[0];

  if (!response) {
    throw new Error('The weather service returned no forecast data.');
  }

  // Attributes for timezone and location
  const utcOffsetSeconds = response.utcOffsetSeconds();
  const current = response.current();
  const daily = response.daily();

  if (!current || !daily) {
    throw new Error('The weather service returned an incomplete forecast.');
  }

  // Attributes for timezone and location
  /*const utcOffsetSeconds = response.utcOffsetSeconds();
  const timezone = response.timezone();
  const timezoneAbbreviation = response.timezoneAbbreviation();
  const latitude = response.latitude();
  const longitude = response.longitude();*/

  // Note: The order of weather variables in the URL query and the indices below need to match!
  const currentWeatherCode = requireVariable(
    current as WeatherVariableContainer,
    WEATHER_CURRENT_PARAMS.weather_code.index,
    'current conditions'
  ).value();
  const dailyWeatherCodes = Array.from(
    requireVariable(
      daily as WeatherVariableContainer,
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
          current as WeatherVariableContainer,
          WEATHER_CURRENT_PARAMS.temperature_2m.index,
          'temperature'
        ).value()
      ),
      weatherCode: currentWeatherCode,
      feelsLike: toIntArray(
        requireVariable(
          current as WeatherVariableContainer,
          WEATHER_CURRENT_PARAMS.apparent_temperature.index,
          'apparent temperature'
        ).value()
      ),
      humidity: toIntArray(
        requireVariable(
          current as WeatherVariableContainer,
          WEATHER_CURRENT_PARAMS.relative_humidity_2m.index,
          'humidity'
        ).value()
      ),
      windSpeed: toIntArray(
        requireVariable(
          current as WeatherVariableContainer,
          WEATHER_CURRENT_PARAMS.wind_speed_10m.index,
          'wind speed'
        ).value()
      ),
      windGust: toIntArray(
        requireVariable(
          current as WeatherVariableContainer,
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
          daily as WeatherVariableContainer,
          WEATHER_DAILY_PARAMS.temperature_2m_max.index,
          'daily high temperatures'
        ).valuesArray()!
      ).map(toIntArray),
      temperatureMinValues: Array.from(
        requireVariable(
          daily as WeatherVariableContainer,
          WEATHER_DAILY_PARAMS.temperature_2m_min.index,
          'daily low temperatures'
        ).valuesArray()!
      ).map(toIntArray),
      conditionValues: dailyWeatherCodes.map((code) => {
        return getWeatherCondition(code);
      }),
    },
  };
};
