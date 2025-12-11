import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

export default function ServiceCoverageMap() {
  return (
    <MapContainer
      center={[23.8103, 90.4125]}
      zoom={12}
      className='h-[80vh] w-full'
    >
      <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
      <Marker position={[23.8103, 90.4125]}>
        <Popup>Dhaka Coverage Area</Popup>
      </Marker>
    </MapContainer>
  );
}
