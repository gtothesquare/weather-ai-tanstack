import React from 'react';
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudHail,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Cloudy,
  Haze,
  LucideProps,
  Sun,
} from 'lucide-react';

const dayConditions: Record<number, React.FC<LucideProps>> = {
  0: (props) => <Sun {...props} />, // Clear sky
  1: (props) => <CloudSun {...props} />, // Mainly clear
  2: (props) => <Cloud {...props} />, // Partly cloudy
  3: (props) => <Cloudy {...props} />, // Overcast
  45: (props) => <CloudFog {...props} />, // Foggy
  48: (props) => <Haze {...props} />, // Depositing rime fog
  51: (props) => <CloudDrizzle {...props} />, // Light drizzle
  53: (props) => <CloudDrizzle {...props} />, // Moderate drizzle
  55: (props) => <CloudDrizzle {...props} />, // Dense drizzle
  56: (props) => <CloudDrizzle {...props} />, // Light freezing drizzle
  57: (props) => <CloudDrizzle {...props} />, // Dense freezing drizzle
  61: (props) => <CloudRain {...props} />, // Slight rain
  63: (props) => <CloudRain {...props} />, // Moderate rain
  65: (props) => <CloudRain {...props} />, // Heavy rain
  66: (props) => <CloudRain {...props} />, // Light freezing rain
  67: (props) => <CloudRain {...props} />, // Heavy freezing rain
  71: (props) => <CloudSnow {...props} />, // Slight snow fall
  73: (props) => <CloudSnow {...props} />, // Moderate snow fall
  75: (props) => <CloudSnow {...props} />, // Heavy snow fall
  77: (props) => <CloudSnow {...props} />, // Snow grains
  80: (props) => <CloudRain {...props} />, // Slight rain showers
  81: (props) => <CloudRain {...props} />, // Moderate rain showers
  82: (props) => <CloudRain {...props} />, // Violent rain showers
  85: (props) => <CloudSnow {...props} />, // Slight snow showers
  86: (props) => <CloudSnow {...props} />, // Heavy snow showers
  95: (props) => <CloudLightning {...props} />, // Thunderstorm
  96: (props) => <CloudHail {...props} />, // Thunderstorm with slight hail
  99: (props) => <CloudHail {...props} />, // Thunderstorm with heavy hail
};

interface Props {
  weatherCode: number;
  lucideProps?: LucideProps;
}

export const WeatherIcon = ({ weatherCode, lucideProps }: Props) => {
  const IconComponent = dayConditions[weatherCode];
  return IconComponent ? <IconComponent {...lucideProps} /> : null;
};
