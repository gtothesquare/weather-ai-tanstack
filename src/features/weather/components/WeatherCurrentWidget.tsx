import { WeatherIcon } from './WeatherIcon';
import { Card, CardContent, Stack } from '@yaip/yads-ui';
import { WeatherDataCurrent, WeatherDataDaily } from '../types';

interface Props {
  weatherData: WeatherDataCurrent;
  dailyWeather?: WeatherDataDaily;
  location?: string;
}

export const WeatherCurrentWidget = ({
  weatherData,
  dailyWeather,
  location,
}: Props) => {
  const { temperature, weatherCode, conditions } = weatherData;
  const highTemperature = dailyWeather?.temperatureMaxValues[0];
  const lowTemperature = dailyWeather?.temperatureMinValues[0];

  return (
    <Card className="w-full max-w-sm overflow-hidden bg-linear-to-b from-slate-700/88 to-slate-800/88 text-white shadow-lg ring-border/40 backdrop-blur-xl">
      <CardContent className="pt-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            {location && (
              <h1 className="text-xl font-semibold tracking-tight text-white">
                {location}
              </h1>
            )}
            <div className="mt-2">
              <span className="text-7xl font-light leading-none">{`${temperature}°`}</span>
            </div>
            <p className="mt-2 text-2xl font-semibold text-white/90">
              {conditions}
            </p>
            {highTemperature !== undefined && lowTemperature !== undefined ? (
              <p className="mt-1 text-lg font-semibold text-white/90">
                {`H:${highTemperature}°  L:${lowTemperature}°`}
              </p>
            ) : null}
          </div>
          <Stack className="justify-center pt-1">
            <div className="w-16">
              <WeatherIcon
                weatherCode={weatherCode}
                iconProps={{ color: '#f6b844', size: 44, weight: 'duotone' }}
              />
            </div>
          </Stack>
        </div>
      </CardContent>
    </Card>
  );
};
