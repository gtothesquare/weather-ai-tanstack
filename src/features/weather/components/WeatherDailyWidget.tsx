import React from 'react';
import { Card, CardContent, Stack } from '@yaip/yads-ui';
import { WeatherDataDaily } from '~/features/weather/types';
import { WeatherIcon } from '~/features/weather/components/WeatherIcon';
import { TemperatureRangeBar } from './TemperatureRangeBar';

interface DayWeatherLineProps {
  weekDay: string;
  temperatureMin: number;
  temperatureMax: number;
  weatherCode: number;
  rangeStart: number;
  rangeWidth: number;
}

function DayWeatherLine({
  weekDay,
  temperatureMin,
  temperatureMax,
  weatherCode,
  rangeStart,
  rangeWidth,
}: DayWeatherLineProps) {
  return (
    <div className="grid grid-cols-[72px_40px_minmax(0,1fr)] items-center gap-4">
      <div className="text-lg font-medium text-slate-700">{weekDay}</div>
      <div className="flex justify-center text-amber-200/85">
        <WeatherIcon
          weatherCode={weatherCode}
          iconProps={{ color: '#f7c66b', size: 32, weight: 'duotone' }}
        />
      </div>
      <div className="grid grid-cols-[40px_minmax(0,1fr)_40px] items-center gap-3">
        <div className="text-right font-bold text-white/56">{`${temperatureMin}°`}</div>
        <TemperatureRangeBar start={rangeStart} width={rangeWidth} />
        <div className="text-right font-bold text-white/84">{`${temperatureMax}°`}</div>
      </div>
    </div>
  );
}

interface WeatherDailyWidgetProps {
  weatherData: WeatherDataDaily;
  location?: string;
}

const dayFormater = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
});

export function WeatherDailyWidget({ weatherData }: WeatherDailyWidgetProps) {
  const allTemperatures = [
    ...weatherData.temperatureMinValues,
    ...weatherData.temperatureMaxValues,
  ];
  const globalMin = Math.min(...allTemperatures);
  const globalMax = Math.max(...allTemperatures);
  const globalSpan = Math.max(globalMax - globalMin, 1);

  return (
    <Card className="w-full max-w-xl bg-card/68 shadow-sm ring-border/45 backdrop-blur-xl">
      <CardContent className="pt-1">
        <Stack gap="3">
          <div className="border-b border-border/70 pb-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              7-day forecast
            </p>
          </div>
          {weatherData.weatherCodeValues.map((weatherCode, index) => {
            const temperatureMin = weatherData.temperatureMinValues[index];
            const temperatureMax = weatherData.temperatureMaxValues[index];
            const dateValue = new Date(weatherData.timeValues[index]);
            const weekDay = dayFormater.format(dateValue);
            const rangeStart =
              ((temperatureMin - globalMin) / globalSpan) * 100;
            const rangeWidth =
              ((temperatureMax - temperatureMin) / globalSpan) * 100;
            return (
              <DayWeatherLine
                weekDay={weekDay}
                weatherCode={weatherCode}
                temperatureMax={temperatureMax}
                key={dateValue.getTime()}
                temperatureMin={temperatureMin}
                rangeStart={rangeStart}
                rangeWidth={rangeWidth}
              />
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
}
