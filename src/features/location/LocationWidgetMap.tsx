'use client';

import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
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

export function LocationWidgetMap({ latitude, longitude }: Props) {
  const position = { lat: latitude, lng: longitude };

  return (
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
  );
}

export default LocationWidgetMap;
