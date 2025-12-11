import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

// optional: small inline style for map container
export default function MapComponent({
  center = [23.8103, 90.4125],
  zoom = 12,
}) {
  return (
    <div className='w-full h-[420px] rounded-md overflow-hidden border'>
      <MapContainer center={center} zoom={zoom} className='w-full h-full'>
        <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
        {/* Example marker in Dhaka center */}
        <Marker position={center}>
          <Popup>Service coverage center (Dhaka)</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
