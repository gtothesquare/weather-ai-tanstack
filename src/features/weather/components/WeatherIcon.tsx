import React from 'react';
import {
  type IconProps,
  CloudIcon,
  CloudFogIcon,
  CloudLightningIcon,
  CloudRainIcon,
  CloudSnowIcon,
  CloudSunIcon,
  CloudWarningIcon,
  SunIcon,
} from '@phosphor-icons/react';

type WeatherIconRenderer = (props: IconProps) => React.JSX.Element;

const dayConditions: Record<number, WeatherIconRenderer> = {
  0: (props) => <SunIcon {...props} />, // Clear sky
  1: (props) => <CloudSunIcon {...props} />, // Mainly clear
  2: (props) => <CloudSunIcon {...props} />, // Partly cloudy
  3: (props) => <CloudIcon {...props} />, // Overcast
  45: (props) => <CloudFogIcon {...props} />, // Foggy
  48: (props) => <CloudFogIcon {...props} />, // Depositing rime fog
  51: (props) => <CloudRainIcon {...props} />, // Light drizzle
  53: (props) => <CloudRainIcon {...props} />, // Moderate drizzle
  55: (props) => <CloudRainIcon {...props} />, // Dense drizzle
  56: (props) => <CloudRainIcon {...props} />, // Light freezing drizzle
  57: (props) => <CloudRainIcon {...props} />, // Dense freezing drizzle
  61: (props) => <CloudRainIcon {...props} />, // Slight rain
  63: (props) => <CloudRainIcon {...props} />, // Moderate rain
  65: (props) => <CloudRainIcon {...props} />, // Heavy rain
  66: (props) => <CloudRainIcon {...props} />, // Light freezing rain
  67: (props) => <CloudRainIcon {...props} />, // Heavy freezing rain
  71: (props) => <CloudSnowIcon {...props} />, // Slight snow fall
  73: (props) => <CloudSnowIcon {...props} />, // Moderate snow fall
  75: (props) => <CloudSnowIcon {...props} />, // Heavy snow fall
  77: (props) => <CloudSnowIcon {...props} />, // Snow grains
  80: (props) => <CloudRainIcon {...props} />, // Slight rain showers
  81: (props) => <CloudRainIcon {...props} />, // Moderate rain showers
  82: (props) => <CloudRainIcon {...props} />, // Violent rain showers
  85: (props) => <CloudSnowIcon {...props} />, // Slight snow showers
  86: (props) => <CloudSnowIcon {...props} />, // Heavy snow showers
  95: (props) => <CloudLightningIcon {...props} />, // Thunderstorm
  96: (props) => <CloudWarningIcon {...props} />, // Thunderstorm with slight hail
  99: (props) => <CloudWarningIcon {...props} />, // Thunderstorm with heavy hail
};

interface Props {
  weatherCode: number;
  iconProps?: IconProps;
}

export const WeatherIcon = ({ weatherCode, iconProps }: Props) => {
  const IconComponent = dayConditions[weatherCode];
  return IconComponent ? <IconComponent {...iconProps} /> : null;
};
