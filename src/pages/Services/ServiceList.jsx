import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import ServiceCard from '../../components/ServiceCard';
import SkeletonCard from '../../components/SkeletonCard';

export default function ServicesList() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchServices() {
    setLoading(true);
    const { data } = await axios.get('/services', {
      params: { search: query, category },
    });
    setServices(data.services);
    setLoading(false);
  }

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className='p-8'>
      <input
        type='text'
        placeholder='Search service...'
        className='border px-4 py-2 w-64'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        onClick={fetchServices}
        className='ml-3 px-4 py-2 bg-blue-500 text-white rounded'
      >
        Search
      </button>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-8'>
        {loading
          ? [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
          : services.map((s) => <ServiceCard key={s._id} service={s} />)}
      </div>
    </div>
  );
}
