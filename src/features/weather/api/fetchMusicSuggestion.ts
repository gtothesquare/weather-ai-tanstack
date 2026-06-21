import '@tanstack/react-start/server-only';

import type { WeatherData } from '../types';
import type { MusicSuggestion } from '../widgetSchema';

interface SpotifyTrackSearchResponse {
  tracks?: {
    items: Array<{
      name: string;
      artists: Array<{ name: string }>;
      album: {
        images: Array<{ url: string }>;
      };
      external_urls: {
        spotify: string;
      };
    }>;
  };
}

interface WeatherMusicSeed {
  query: string;
  reason: string;
}

async function readErrorPayload(response: Response) {
  const body = await response.text();

  if (!body) {
    return undefined;
  }

  try {
    return JSON.parse(body) as unknown;
  } catch {
    return body;
  }
}

function randomIntBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildWeatherMusicSeed(weather: WeatherData): WeatherMusicSeed {
  const code = weather.current.weatherCode;
  const temperature = weather.current.temperature;
  const windSpeed = weather.current.windSpeed;

  if (code === 0 && temperature >= 24) {
    return {
      query: 'sunny upbeat indie pop',
      reason: 'Warm clear weather suits bright, energetic tracks.',
    };
  }

  if (code === 0 || code === 1 || code === 2) {
    return {
      query: 'golden hour feel good indie',
      reason: 'Clear skies fit light, melodic music.',
    };
  }

  if (code === 3 || code === 45 || code === 48) {
    return {
      query: 'overcast dream pop chill',
      reason:
        'Cloudy or foggy weather pairs well with softer atmospheric songs.',
    };
  }

  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
    return {
      query: 'rainy day jazz lo-fi',
      reason: 'Rain usually works best with mellow, reflective music.',
    };
  }

  if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
    return {
      query: 'winter ambient indie folk',
      reason: 'Snowy weather tends to suit warm, spacious songs.',
    };
  }

  if (code >= 95 || windSpeed >= 35) {
    return {
      query: 'stormy electronic alt rock',
      reason:
        'Stormy or very windy conditions call for something more intense.',
    };
  }

  if (temperature <= 5) {
    return {
      query: 'cold weather acoustic calm',
      reason: 'Cold weather fits quieter, more intimate music.',
    };
  }

  return {
    query: 'chill indie pop weather vibe',
    reason: 'The forecast leans moderate, so a balanced upbeat pick works.',
  };
}

async function fetchSpotifyAccessToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID?.trim();
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET?.trim();

  if (!clientId || !clientSecret) {
    console.warn('[musicSuggestion] Missing Spotify credentials.');
    return null;
  }

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
  });

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(
        `${clientId}:${clientSecret}`
      ).toString('base64')}`,
    },
    body: body.toString(),
  });

  if (!response.ok) {
    console.warn('[musicSuggestion] Spotify token request failed.', {
      status: response.status,
      statusText: response.statusText,
      body: await readErrorPayload(response),
    });
    return null;
  }

  const data = (await response.json()) as { access_token?: string };
  return data.access_token ?? null;
}

export async function fetchMusicSuggestion(
  weather: WeatherData
): Promise<MusicSuggestion | undefined> {
  const accessToken = await fetchSpotifyAccessToken();

  if (!accessToken) {
    return undefined;
  }

  const seed = buildWeatherMusicSeed(weather);
  const params = new URLSearchParams({
    q: seed.query,
    type: 'track',
    limit: '20',
  });

  const response = await fetch(
    `https://api.spotify.com/v1/search?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    console.warn('[musicSuggestion] Spotify track search failed.', {
      status: response.status,
      statusText: response.statusText,
      body: await readErrorPayload(response),
    });
    return undefined;
  }

  const data = (await response.json()) as SpotifyTrackSearchResponse;
  const items = data.tracks?.items;

  if (!items?.length) {
    console.warn('[musicSuggestion] Spotify track search returned no results.');
    return undefined;
  }

  const track = items[randomIntBetween(0, items.length - 1)];

  return {
    source: 'spotify',
    title: track.name,
    artists: track.artists.map((artist) => artist.name),
    artworkUrl: track.album.images[0]?.url,
    spotifyUrl: track.external_urls.spotify,
    query: seed.query,
    reason: seed.reason,
  };
}
