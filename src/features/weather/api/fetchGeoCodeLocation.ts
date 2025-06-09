import { OpenMateoGeoCodeLocation } from '~/features/weather/types';

interface GeoCodeLocationResponse {
  results: OpenMateoGeoCodeLocation[];
}

export const fetchGeoCodeLocation = async (location: string) => {
  try {
    const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`;
    const geocodingResponse = await fetch(geocodingUrl);

    const geocodingData: GeoCodeLocationResponse =
      await geocodingResponse.json();

    if (geocodingData.results.length > 0) {
      const { latitude, longitude, name } = geocodingData.results[0];
      return {
        latitude,
        longitude,
        city: name,
      };
    }
  } catch (error) {
    console.log(error);
    return;
  }
};
