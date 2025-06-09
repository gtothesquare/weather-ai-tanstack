import { getWeatherCondition } from './getWeatherCondition';
import { Coordinates, LocationParams, WeatherData } from '../types';
import { fetchWeatherApi } from 'openmeteo';
import { fetchGeoCodeLocation } from './fetchGeoCodeLocation';
import { fetchReverseGeoCodeLocation } from '~/features/weather/api/fetchReverseGeoCodeLocation';

type FetchWeatherParams = LocationParams | Coordinates;

const toIntArray = (val: number) => {
  return Math.ceil(val);
};

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
    if (lat && lon) {
      const result = await fetchReverseGeoCodeLocation(lat, lon);
      city = result?.name;
    }
  }

  if (!lat || !lon) {
    throw new Error(`Location '${JSON.stringify(params)}' not found`);
  }

  const weatherParams = {
    latitude: lat,
    longitude: lon,
    daily: ['weather_code', 'temperature_2m_max', 'temperature_2m_min'],
    current: [
      'temperature_2m',
      'weather_code',
      'apparent_temperature',
      'relative_humidity_2m',
      'wind_speed_10m',
      'wind_gusts_10m',
    ],
    timezone: 'auto',
  };

  const weatherUrl = `https://api.open-meteo.com/v1/forecast`;

  const weatherApiResponse = await fetchWeatherApi(weatherUrl, weatherParams);
  const response = weatherApiResponse[0];
  // Attributes for timezone and location
  const utcOffsetSeconds = response.utcOffsetSeconds();
  const current = response.current()!;
  const daily = response.daily()!;

  // Attributes for timezone and location
  /*const utcOffsetSeconds = response.utcOffsetSeconds();
  const timezone = response.timezone();
  const timezoneAbbreviation = response.timezoneAbbreviation();
  const latitude = response.latitude();
  const longitude = response.longitude();*/

  // Note: The order of weather variables in the URL query and the indices below need to match!
  const currentWeatherCode = current.variables(1)!.value();
  const dailyWeatherCodes = Array.from(daily.variables(1)!.valuesArray()!);

  return {
    location: city ?? '',
    current: {
      time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
      temperature: toIntArray(current.variables(0)!.value()),
      weatherCode: currentWeatherCode,
      feelsLike: toIntArray(current.variables(2)!.value()),
      humidity: toIntArray(current.variables(3)!.value()),
      windSpeed: toIntArray(current.variables(4)!.value()),
      windGust: toIntArray(current.variables(5)!.value()),
      conditions: getWeatherCondition(currentWeatherCode),
    },
    daily: {
      timeValues: [
        ...Array(
          (Number(daily.timeEnd()) - Number(daily.time())) / daily.interval()
        ),
      ].map(
        (_, i) =>
          new Date(
            (Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) *
              1000
          )
      ),
      weatherCodeValues: dailyWeatherCodes,
      temperatureMaxValues: Array.from(daily.variables(1)!.valuesArray()!).map(
        toIntArray
      ),
      temperatureMinValues: Array.from(daily.variables(2)!.valuesArray()!).map(
        toIntArray
      ),
      conditionValues: dailyWeatherCodes.map((code) => {
        return getWeatherCondition(code);
      }),
    },
  };
};
