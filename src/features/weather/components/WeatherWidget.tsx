import { WeatherIcon } from './WeatherIcon';
import { VStack } from '~/components/ui/VStack';
import { HStack } from '~/components/ui/HStack';
import { Card, CardContent } from '~/components/sui/card';
import { WeatherDataCurrent } from '../types';

interface Props {
  weatherData: WeatherDataCurrent;
  location?: string;
}

export const WeatherWidget = ({ weatherData, location }: Props) => {
  const { temperature, weatherCode } = weatherData;
  return (
    <Card>
      <CardContent>
        <HStack justify="between" spacing="lg">
          <VStack justify="center">
            <div className="w-20">
              <WeatherIcon
                weatherCode={weatherCode}
                lucideProps={{ color: 'orange', size: 'xl' }}
              />
            </div>
          </VStack>
          <span className="font-bold text-6xl text-slate-600">{`${temperature}°`}</span>
        </HStack>
        {location && (
          <h1 className="text-slate-600 text-xl font-semibold">{location}</h1>
        )}
      </CardContent>
    </Card>
  );
};
