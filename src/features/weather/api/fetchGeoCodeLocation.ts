import {
  OpenMateoGeoCodeLocation,
  SearchGeocodingLocation,
} from '~/features/weather/types';

interface GeoCodeLocationResponse {
  results?: OpenMateoGeoCodeLocation[];
}

const WEATHER_NOISE_WORDS =
  /\b(weather|forecast|temperature|today|tomorrow|for|in)\b/gi;

function normalizeLocationQuery(location: string) {
  return location
    .replace(WEATHER_NOISE_WORDS, ' ')
    .replace(/[?]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function createCandidateQueries(location: string) {
  const normalized = normalizeLocationQuery(location);
  const withComma = normalized.replace(/\s{1,}([A-Za-z]{3,})$/, ', $1');
  const withoutComma = normalized.replace(/,\s*/g, ' ');

  return [
    ...new Set([location.trim(), normalized, withComma, withoutComma]),
  ].filter(Boolean);
}

function scoreOpenMeteoResult(
  result: OpenMateoGeoCodeLocation,
  normalizedQuery: string
) {
  const haystack = [
    result.name,
    result.country,
    result.admin1,
    result.admin2,
    result.admin3,
    result.admin4,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  const tokens = normalizedQuery
    .toLowerCase()
    .split(/\s+/)
    .filter((token) => token.length > 1);

  const overlap = tokens.filter((token) => haystack.includes(token)).length;

  return overlap * 1000 + (result.population ?? 0);
}

async function searchOpenMeteo(location: string) {
  const normalizedQuery = normalizeLocationQuery(location);
  const queries = createCandidateQueries(location);
  const candidates: OpenMateoGeoCodeLocation[] = [];

  for (const query of queries) {
    const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
    const geocodingResponse = await fetch(geocodingUrl);

    if (!geocodingResponse.ok) {
      console.error(geocodingResponse.statusText);
      continue;
    }

    const geocodingData: GeoCodeLocationResponse =
      await geocodingResponse.json();

    if (geocodingData.results?.length) {
      candidates.push(...geocodingData.results);
    }
  }

  const bestMatch = [...candidates].sort(
    (left, right) =>
      scoreOpenMeteoResult(right, normalizedQuery) -
      scoreOpenMeteoResult(left, normalizedQuery)
  )[0];

  if (!bestMatch) {
    return;
  }

  return {
    latitude: bestMatch.latitude,
    longitude: bestMatch.longitude,
    city: bestMatch.name,
  };
}

async function searchNominatim(location: string) {
  const queries = createCandidateQueries(location);

  for (const query of queries) {
    const geocodingUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=jsonv2&limit=5&addressdetails=1`;
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
      continue;
    }

    const geocodingData: SearchGeocodingLocation[] =
      await geocodingResponse.json();
    const firstResult = geocodingData[0];

    if (firstResult) {
      return {
        latitude: Number(firstResult.lat),
        longitude: Number(firstResult.lon),
        city:
          firstResult.name ??
          firstResult.address?.city ??
          firstResult.address?.town ??
          firstResult.address?.village ??
          firstResult.address?.municipality ??
          query,
      };
    }
  }
}

export const fetchGeoCodeLocation = async (location: string) => {
  try {
    const openMeteoResult = await searchOpenMeteo(location);
    if (openMeteoResult) {
      return openMeteoResult;
    }

    const nominatimResult = await searchNominatim(location);
    if (nominatimResult) {
      return nominatimResult;
    }
  } catch (error) {
    console.log(error);
    return;
  }
};
