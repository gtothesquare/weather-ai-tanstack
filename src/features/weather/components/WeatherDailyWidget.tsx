import React from 'react';
import { Card, CardContent } from '~/components/sui/card';
import { HStack, VStack } from '~/components/ui';
import { WeatherDataDaily } from '~/features/weather/types';
import { WeatherIcon } from '~/features/weather/components/WeatherIcon';

interface DayWeatherLineProps {
  weekDay: string;
  temperatureMin: number;
  temperatureMax: number;
  weatherCode: number;
}

function DayWeatherLine({
  weekDay,
  temperatureMin,
  temperatureMax,
  weatherCode,
}: DayWeatherLineProps) {
  return (
    <HStack justify="between" spacing="xxl">
      <HStack justify="between">
        {weekDay}
        <WeatherIcon
          weatherCode={weatherCode}
          lucideProps={{ color: 'orange', size: 32 }}
        />
      </HStack>
      <HStack justify="end" spacing="xxl">
        <div className="font-bold  text-slate-600">{`${temperatureMin}°`}</div>
        <div className="font-bold  text-slate-600">{`${temperatureMax}°`}</div>
      </HStack>
    </HStack>
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
  return (
    <Card>
      <CardContent>
        <VStack spacing={'md'}>
          {weatherData.weatherCodeValues.map((weatherCode, index) => {
            const temperatureMin = weatherData.temperatureMinValues[index];
            const temperatureMax = weatherData.temperatureMaxValues[index];
            const dateValue = new Date(weatherData.timeValues[index]);
            const weekDay = dayFormater.format(dateValue);
            return (
              <DayWeatherLine
                weekDay={weekDay}
                weatherCode={weatherCode}
                temperatureMax={temperatureMax}
                key={dateValue.getTime()}
                temperatureMin={temperatureMin}
              />
            );
          })}
        </VStack>
      </CardContent>
    </Card>
  );
}
