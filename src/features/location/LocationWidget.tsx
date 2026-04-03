'use client';
import React from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { Card, CardContent } from '@yaip/yads-ui';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface Props {
  latitude: number;
  longitude: number;
}

function LocationWidget({ latitude, longitude }: Props) {
  const position = { lat: latitude, lng: longitude };
  return (
    <Card className="w-full max-w-xl bg-card/68 shadow-sm ring-border/45 backdrop-blur-xl">
      <CardContent className="pt-1">
        <MapContainer
          style={{ height: '200px', width: '100%' }}
          center={position}
          zoom={13}
          scrollWheelZoom={false}
          className="rounded-lg"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={position}>
            <Popup>your location</Popup>
          </Marker>
        </MapContainer>
      </CardContent>
    </Card>
  );
}

export default LocationWidget;
export { LocationWidget };
