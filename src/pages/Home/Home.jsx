import { useContext, useEffect, useMemo, useState } from 'react';
import axios from '../../api/axios';
import MapComponent from '../../components/MapComponent';
import ServiceCard from '../../components/ServiceCard';
import SkeletonCard from '../../components/SkeletonCard';
import { AuthContext } from '../../context/AuthContext';
import Hero from './Hero';

export default function Home() {
  const [services, setServices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  // search / filter state
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [minCost, setMinCost] = useState('');
  const [maxCost, setMaxCost] = useState('');

  const { user } = useContext(AuthContext) || {};

  useEffect(() => {
    let mounted = true;
    const fetchServices = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/services', { params: { limit: 12 } });
        if (!mounted) return;
        setServices(res.data.services || []);
        setFiltered(res.data.services || []);
      } catch (err) {
        console.error('Failed to fetch services', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchServices();
    return () => {
      mounted = false;
    };
  }, []);

  // derive categories from services
  const categories = useMemo(() => {
    const set = new Set(
      services.map((s) => s.service_category).filter(Boolean)
    );
    return Array.from(set);
  }, [services]);

  const handleSearch = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const params = {};
      if (q) params.search = q;
      if (category) params.category = category;
      if (minCost) params.minCost = minCost;
      if (maxCost) params.maxCost = maxCost;
      const res = await axios.get('/services', { params });
      setFiltered(res.data.services || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Top decorators: derive from services.createdByEmail grouped by count
  const topDecorators = useMemo(() => {
    const map = {};
    services.forEach((s) => {
      const email = s.createdByEmail || 'unknown';
      map[email] = (map[email] || 0) + 1;
    });
    const arr = Object.entries(map).map(([email, count]) => ({ email, count }));
    return arr.sort((a, b) => b.count - a.count).slice(0, 6);
  }, [services]);

  return (
    <div>
      <Hero />

      <section className='container mx-auto px-4 py-10'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-2xl font-semibold'>
            Popular Decoration Services
          </h2>
          <div className='text-sm text-gray-600'>Total: {services.length}</div>
        </div>

        <form
          onSubmit={handleSearch}
          className='grid grid-cols-1 md:grid-cols-6 gap-3 mb-6'
        >
          <input
            placeholder='Search by name...'
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className='col-span-2 input input-bordered'
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className='input input-bordered'
          >
            <option value=''>All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input
            placeholder='Min BDT'
            value={minCost}
            onChange={(e) => setMinCost(e.target.value)}
            className='input input-bordered'
            type='number'
          />
          <input
            placeholder='Max BDT'
            value={maxCost}
            onChange={(e) => setMaxCost(e.target.value)}
            className='input input-bordered'
            type='number'
          />
          <div className='flex items-center gap-2'>
            <button className='btn btn-primary' type='submit'>
              Search
            </button>
            <button
              type='button'
              className='btn btn-ghost'
              onClick={() => {
                setQ('');
                setCategory('');
                setMinCost('');
                setMaxCost('');
                setFiltered(services);
              }}
            >
              Reset
            </button>
          </div>
        </form>

        {loading ? (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {filtered.length === 0 ? (
              <div className='col-span-full text-center py-8 text-gray-600'>
                No services found.
              </div>
            ) : (
              filtered.map((s) => <ServiceCard key={s._id} service={s} />)
            )}
          </div>
        )}
      </section>

      <section className=' py-10'>
        <div className='container mx-auto px-4'>
          <h3 className='text-xl font-semibold mb-4'>Top Decorators</h3>
          <div className='grid grid-cols-2 md:grid-cols-6 gap-4'>
            {topDecorators.length === 0 ? (
              <div className='text-gray-500'>No decorators yet.</div>
            ) : (
              topDecorators.map((d) => (
                <div key={d.email} className=' p-4 rounded shadow text-center'>
                  <div className='w-14 h-14 rounded-full bg-indigo-100 mx-auto flex items-center justify-center text-indigo-600 font-semibold'>
                    {d.email.charAt(0).toUpperCase()}
                  </div>
                  <div className='mt-2 text-sm font-medium'>{d.email}</div>
                  <div className='text-xs text-gray-500'>
                    {d.count} packages
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className='container mx-auto px-4 py-10'>
        <h3 className='text-xl font-semibold mb-4'>Service Coverage Map</h3>
        <MapComponent />
      </section>
    </div>
  );
}
