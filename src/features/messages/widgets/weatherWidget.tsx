'use client';

import { useQuery } from '@tanstack/react-query';
import type { ComponentRenderProps } from '@json-render/react';
import { createRenderer } from '@json-render/react';
import { defineCatalog } from '@json-render/core';
import { schema } from '@json-render/react/schema';
import { z } from 'zod';
import {
  Alert,
  AlertDescription,
  Card,
  CardContent,
  Skeleton,
  Stack,
} from '@yaip/yads-ui';
import {
  type WeatherQueryInput,
  weatherQueryOptions,
} from '~/features/weather/queries';
import { WeatherCurrentWidget } from '~/features/weather/components/WeatherCurrentWidget';
import { WeatherDailyWidget } from '~/features/weather/components/WeatherDailyWidget';
import { LocationWidget } from '~/features/location/LocationWidget';
import {
  currentWeatherSchema,
  dailyWeatherSchema,
} from '~/features/weather/schemas';
import {
  type WeatherWidgetPayload,
  weatherWidgetPayloadSchema,
} from '~/features/weather/widgetSchema';

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

function WeatherWidgetQuery({
  element,
}: ComponentRenderProps<WeatherWidgetPayload>) {
  const props = element.props;
  const query = useQuery(weatherQueryOptions(props.query as WeatherQueryInput));

  if (query.isPending) {
    return (
      <Card className="bg-card/68 shadow-sm ring-border/45 backdrop-blur-xl">
        <CardContent className="pt-1">
          <Stack gap="3">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-56 w-full" />
          </Stack>
        </CardContent>
      </Card>
    );
  }

  if (query.isError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{query.error.message}</AlertDescription>
      </Alert>
    );
  }

  const { data } = query;

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

  elements['weather-layout'].children.push('weather-current', 'weather-daily');

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
