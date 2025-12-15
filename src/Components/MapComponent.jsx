import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, TileLayer, Circle } from 'react-leaflet';

export default function MapComponent({
  center = [23.8103, 90.4125],
  zoom = 7,
  zones = [],       // array of { id, name, center, radiusKm }
  markers = [],     // array of { position: [lat, lng], popupText }
}) {
  return (
    <div className="w-full h-[480px] rounded-md overflow-hidden border">
      <MapContainer center={center} zoom={zoom} className="w-full h-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Render coverage circles */}
        {zones.map((z) => (
          <Circle
            key={z.id}
            center={[z.center.lat, z.center.lng]}
            radius={z.radiusKm * 1000}       // km → meters
            pathOptions={{ color: "#2a9d8f", fillOpacity: 0.15 }}
          >
            <Popup>{z.name}</Popup>
          </Circle>
        ))}

        {/* Render markers */}
        {markers.map((m, i) => (
          <Marker key={i} position={m.position}>
            <Popup>{m.popupText}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
