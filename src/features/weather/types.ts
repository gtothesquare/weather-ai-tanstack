import { z } from 'zod';
import {
  coordinatesSchema,
  currentWeatherSchema,
  dailyWeatherSchema,
  locationSchema,
  weatherSchema,
} from './schemas';

export type WeatherDataCurrent = z.infer<typeof currentWeatherSchema>;
export type WeatherDataDaily = z.infer<typeof dailyWeatherSchema>;

export type WeatherData = z.infer<typeof weatherSchema>;

export type LocationParams = z.infer<typeof locationSchema>;
export type Coordinates = z.infer<typeof coordinatesSchema>;

export interface OpenMateoGeoCodeLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  feature_code: string;
  country_code: string;
  admin1_id: number;
  admin2_id: number;
  admin3_id: number;
  admin4_id: number;
  timezone: string;
  population: number;
  postcodes: string[];
  country_id: number;
  country: string;
  admin1: string;
  admin2: string;
  admin3: string;
  admin4: string;
}

export interface ReverseGeocodingLocation {
  place_id: string;
  licence: string;
  osm_type: string;
  osm_id: string;
  lat: string;
  lon: string;
  place_rank: string;
  category: string;
  type: string;
  importance: string;
  addresstype: string;
  display_name: string;
  name: string;
  address: {
    road?: string;
    village?: string;
    state_district?: string;
    state?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
  };
  boundingbox: [string, string, string, string];
}
