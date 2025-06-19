//https://nominatim.openstreetmap.org/reverse?lat=<value>&lon=<value>

import { ReverseGeocodingLocation } from '~/features/weather/types';

export const fetchReverseGeoCodeLocation = async (lat: number, lon: number) => {
  try {
    const geocodingUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=jsonv2&zoom=18&addressdetails=1`;

    const geocodingResponse = await fetch(geocodingUrl, {
      method: 'GET',
      headers: {
        'User-Agent':
          'yaip weather/1.0 (Contact: gghandal@gmail.com) Yaip weather agent',
        Referer: 'https://weather.yaip.app/',
        Accept: 'application/json',
      },
    });
    if (!geocodingResponse.ok) {
      console.error(geocodingResponse.statusText);
      return;
    }

    const geocodingData: ReverseGeocodingLocation =
      await geocodingResponse.json();

    if (geocodingData) {
      const { lat, lon, name } = geocodingData;
      return {
        latitude: lat,
        longitude: lon,
        name,
      };
    }
  } catch (error) {
    console.log(error);
    return;
  }
};
