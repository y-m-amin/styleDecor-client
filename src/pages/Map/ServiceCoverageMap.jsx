import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import axios from '../../api/axios';

  import MapComponent from '../../components/MapComponent';
import { useState,useEffect } from 'react';

export default function ServiceCoverageMap() {

  const [zones, setZones] = useState([]);
const [filteredZones, setFilteredZones] = useState([]);

useEffect(() => {
  const fetchZones = async () => {
    try {
      const res = await axios.get('/coverage-zones');
      setZones(res.data.zones);
      setFilteredZones(res.data.zones); 
    } catch (err) {
      console.error('Failed to load coverage zones', err);
    }
  };
  fetchZones();
}, []);
  return (

    <section className="container mx-auto px-4 py-10">
  <h3 className="text-xl font-semibold mb-4">Service Coverage Map</h3>

  {/* Example filter UI */}
  <div className="flex items-center gap-2 mb-4">
    <button
      className="btn btn-sm btn-outline"
      onClick={() => setFilteredZones(zones)}
    >
      Show All
    </button>
    {zones.map((z) => (
      <button
        key={z.id}
        className="btn btn-sm btn-primary"
        onClick={() => setFilteredZones([z])}
      >
        {z.name}
      </button>
    ))}
  </div>

  <MapComponent
    center={[23.8103, 90.4125]}
    zoom={7}
    zones={filteredZones}
    markers={filteredZones.map((z) => ({
      position: [z.center.lat, z.center.lng],
      popupText: z.name,
    }))}
  />
</section>

    // <MapContainer
    //   center={[23.8103, 90.4125]}
    //   zoom={12}
    //   className='h-[80vh] w-full'
    // >
    //   <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
    //   <Marker position={[23.8103, 90.4125]}>
    //     <Popup>Dhaka Coverage Area</Popup>
    //   </Marker>
    // </MapContainer>
  );
}
