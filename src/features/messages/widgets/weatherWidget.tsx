'use client';

import type { ComponentRenderProps } from '@json-render/react';
import { createRenderer } from '@json-render/react';
import { defineCatalog } from '@json-render/core';
import { schema } from '@json-render/react/schema';
import { z } from 'zod';
import { Music4 } from 'lucide-react';
import {
  Alert,
  AlertDescription,
  Card,
  CardContent,
  Stack,
} from '@yaip/yads-ui';
import { WeatherCurrentWidget } from '~/features/weather/components/WeatherCurrentWidget';
import { WeatherDailyWidget } from '~/features/weather/components/WeatherDailyWidget';
import { LocationWidget } from '~/features/location/LocationWidget';
import {
  dailyWeatherSchema,
  currentWeatherSchema,
} from '~/features/weather/schemas';
import {
  musicSuggestionSchema,
  type SerializedWeatherData,
  type WeatherWidgetPayload,
  weatherWidgetPayloadSchema,
} from '~/features/weather/widgetSchema';
import type { WeatherData } from '~/features/weather/types';

const weatherCurrentCardPropsSchema = z.object({
  location: z.string(),
  current: currentWeatherSchema,
  daily: dailyWeatherSchema,
});

const weatherDailyCardPropsSchema = z.object({
  location: z.string(),
  daily: dailyWeatherSchema,
});

const locationMapPropsSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

const musicSuggestionCardPropsSchema = z.object({
  suggestion: musicSuggestionSchema,
});

const weatherLayoutPropsSchema = z.object({
  maxWidth: z.string().optional(),
});

const weatherCatalog = defineCatalog(schema, {
  components: {
    WeatherWidgetLayout: {
      props: weatherLayoutPropsSchema,
      description: 'Layout wrapper for weather widget sections.',
    },
    CurrentWeatherCard: {
      props: weatherCurrentCardPropsSchema,
      description: 'Render the current weather summary card.',
    },
    DailyForecastCard: {
      props: weatherDailyCardPropsSchema,
      description: 'Render the daily forecast card.',
    },
    LocationMapCard: {
      props: locationMapPropsSchema,
      description: 'Render the location map card.',
    },
    MusicSuggestionCard: {
      props: musicSuggestionCardPropsSchema,
      description: 'Render the music suggestion card.',
    },
    WeatherWidgetQuery: {
      props: weatherWidgetPayloadSchema,
      description: 'Load weather data and render the widget spec.',
    },
  },
  actions: {},
});

function WeatherWidgetLayout({
  element,
  children,
}: ComponentRenderProps<z.infer<typeof weatherLayoutPropsSchema>>) {
  return (
    <Stack className={`w-full ${element.props.maxWidth ?? 'max-w-xl'}`} gap="4">
      {children}
    </Stack>
  );
}

function CurrentWeatherCard({
  element,
}: ComponentRenderProps<z.infer<typeof weatherCurrentCardPropsSchema>>) {
  return (
    <WeatherCurrentWidget
      weatherData={element.props.current}
      dailyWeather={element.props.daily}
      location={element.props.location}
    />
  );
}

function DailyForecastCard({
  element,
}: ComponentRenderProps<z.infer<typeof weatherDailyCardPropsSchema>>) {
  return (
    <WeatherDailyWidget
      weatherData={element.props.daily}
      location={element.props.location}
    />
  );
}

function LocationMapCard({
  element,
}: ComponentRenderProps<z.infer<typeof locationMapPropsSchema>>) {
  return (
    <LocationWidget
      latitude={element.props.latitude}
      longitude={element.props.longitude}
    />
  );
}

function MusicSuggestionCard({
  element,
}: ComponentRenderProps<z.infer<typeof musicSuggestionCardPropsSchema>>) {
  const { suggestion } = element.props;

  return (
    <Card className="w-full max-w-xl overflow-hidden bg-linear-to-br from-emerald-500/14 via-card/90 to-sky-500/14 shadow-sm ring-border/45 backdrop-blur-xl">
      <CardContent className="pt-1">
        <div className="flex items-center gap-4">
          {suggestion.artworkUrl ? (
            <img
              alt={`${suggestion.title} cover art`}
              className="size-20 rounded-xl object-cover shadow-sm"
              src={suggestion.artworkUrl}
            />
          ) : (
            <div className="flex size-20 items-center justify-center rounded-xl bg-emerald-500/16 text-emerald-700">
              <Music4 size={28} />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Weather pick
            </p>
            <p className="truncate pt-1 text-lg font-semibold text-foreground">
              {suggestion.title}
            </p>
            <p className="truncate text-sm text-foreground/72">
              {suggestion.artists.join(', ')}
            </p>
            <p className="pt-2 text-sm leading-relaxed text-foreground/80">
              {suggestion.reason}
            </p>
            <a
              className="inline-flex pt-3 text-sm font-medium text-emerald-700 transition hover:text-emerald-600"
              href={suggestion.spotifyUrl}
              rel="noreferrer"
              target="_blank"
            >
              Open in Spotify
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function deserializeWeatherData(forecast: SerializedWeatherData): WeatherData {
  return {
    ...forecast,
    current: {
      ...forecast.current,
      time: new Date(forecast.current.time),
    },
  };
}

function WeatherWidgetQuery({
  element,
}: ComponentRenderProps<WeatherWidgetPayload>) {
  const props = element.props;
  if (!props.forecast) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Forecast data is unavailable.</AlertDescription>
      </Alert>
    );
  }

  const data = deserializeWeatherData(props.forecast);

  const elements: Record<
    string,
    {
      type: string;
      props: Record<string, unknown>;
      children: string[];
    }
  > = {
    'weather-layout': {
      type: 'WeatherWidgetLayout',
      props: {
        maxWidth: 'max-w-xl',
      },
      children: [],
    },
    'weather-current': {
      type: 'CurrentWeatherCard',
      props: {
        location: data.location,
        current: data.current,
        daily: data.daily,
      },
      children: [],
    },
    'weather-daily': {
      type: 'DailyForecastCard',
      props: {
        location: data.location,
        daily: data.daily,
      },
      children: [],
    },
  };

  if (props.showMap && props.query.kind === 'coordinates') {
    elements['weather-map'] = {
      type: 'LocationMapCard',
      props: {
        latitude: props.query.latitude,
        longitude: props.query.longitude,
      },
      children: [],
    };
    elements['weather-layout'].children.push('weather-map');
  }

  elements['weather-layout'].children.push('weather-current');

  if (props.musicSuggestion) {
    elements['weather-music'] = {
      type: 'MusicSuggestionCard',
      props: {
        suggestion: props.musicSuggestion,
      },
      children: [],
    };
    elements['weather-layout'].children.push('weather-music');
  }

  elements['weather-layout'].children.push('weather-daily');

  return (
    <WeatherRenderer
      spec={{
        root: 'weather-layout',
        elements,
      }}
    />
  );
}

const WeatherRenderer = createRenderer(weatherCatalog, {
  WeatherWidgetLayout,
  CurrentWeatherCard,
  DailyForecastCard,
  LocationMapCard,
  MusicSuggestionCard,
  WeatherWidgetQuery,
});

export function WeatherWidgetRenderer({
  widget,
}: {
  widget: WeatherWidgetPayload;
}) {
  return (
    <WeatherRenderer
      spec={{
        root: 'weather-widget',
        elements: {
          'weather-widget': {
            type: 'WeatherWidgetQuery',
            props: widget,
            children: [],
          },
        },
      }}
    />
  );
}
