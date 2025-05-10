import { WeatherIcon } from './WeatherIcon';
import { VStack } from '~/components/ui/VStack';
import { HStack } from '~/components/ui/HStack';
import { Card, CardContent } from '~/components/sui/card';
import { WeatherData } from '../tool/types';

interface Props {
  data: WeatherData;
}

export const WeatherWidget = ({ data }: Props) => {
  return (
    <Card>
      <CardContent>
        <HStack justify="between" spacing="lg">
          <VStack justify="center">
            <div className="w-20">
              <WeatherIcon
                weatherCode={data.weatherCode}
                lucideProps={{ color: 'orange', size: 'xl' }}
              />
            </div>
          </VStack>
          <span className="font-bold text-6xl text-slate-600">{`${data.temperature}°`}</span>
        </HStack>
        <h1 className="text-slate-600 text-xl font-semibold">
          {data.location}
        </h1>
      </CardContent>
    </Card>
  );
};
