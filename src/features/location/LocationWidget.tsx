import React from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { Card, CardContent } from '~/components/sui/card';

interface Props {
  latitude: number;
  longitude: number;
}

function LocationWidget({ latitude, longitude }: Props) {
  const position = { lat: latitude, lng: longitude };
  return (
    <Card>
      <CardContent>
        <MapContainer
          style={{ height: '200px', width: '300px' }}
          center={position}
          zoom={13}
          scrollWheelZoom={false}
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
