 import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import axios from '../../api/axios';
import ServiceCard from '../../components/ServiceCard';
import SkeletonCard from '../../components/SkeletonCard';

export default function ServicesList() {
  const location = useLocation();

  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [minCost, setMinCost] = useState('');
  const [maxCost, setMaxCost] = useState('');

  // pagination
  const [page, setPage] = useState(1);
  const limit = 9;
  const [totalPages, setTotalPages] = useState(1);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/services', {
        params: {
          search: query || undefined,
          category: category || undefined,
          minCost: minCost || undefined,
          maxCost: maxCost || undefined,
          page,
          limit,
        },
      });

      setServices(data.services || []);
      setTotalPages(Math.ceil(data.total / limit));
    } catch (err) {
      console.error('Failed to load services', err);
    } finally {
      setLoading(false);
    }
  };

  // fetch
useEffect(() => {
  axios.get('/services/categories').then((res) => {
    const raw = res.data || [];

    // raw is [{label,value}] now
    const normalized = raw
      .map((c) => {
        if (typeof c === 'string') return { label: c, value: c };
        if (c && typeof c === 'object')
          return { label: String(c.label ?? c.value ?? ''), value: String(c.value ?? c.label ?? '') };
        return null;
      })
      .filter((x) => x?.value);

    // dedupe by value
    const seen = new Set();
    const unique = normalized.filter((x) => (seen.has(x.value) ? false : (seen.add(x.value), true)));

    setCategories(unique);
  });
}, []);

  //  Read query param on route change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category') || '';
    setCategory(cat);
    setPage(1);
  }, [location.search]);

  //  Fetch when page changes OR when filters change
  useEffect(() => {
    fetchServices();
  }, [page, query, category, minCost, maxCost]);

  // load categories once
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    axios.get('/services/categories').then((res) => {
      setCategories(res.data || []);
    });
  }, []);

  const handleSearch = () => {
    setPage(1);
    fetchServices();
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <h2 className='text-2xl font-semibold mb-6'>All Services</h2>

      {/* Filters */}
      <div className='grid grid-cols-1 md:grid-cols-6 gap-3 mb-6'>
        <input
          className='input input-bordered md:col-span-2'
          placeholder='Search service...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <select
          className='input input-bordered'
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value=''>All Categories</option>
          {categories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>


        <input
          type='number'
          className='input input-bordered'
          placeholder='Min BDT'
          value={minCost}
          onChange={(e) => setMinCost(e.target.value)}
        />

        <input
          type='number'
          className='input input-bordered'
          placeholder='Max BDT'
          value={maxCost}
          onChange={(e) => setMaxCost(e.target.value)}
        />

        <div className='flex gap-2'>
          <button className='btn btn-primary' onClick={handleSearch}>
            Search
          </button>
          <button
            className='btn btn-ghost'
            onClick={() => {
              setQuery('');
              setCategory('');
              setMinCost('');
              setMaxCost('');
              setPage(1);
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className='grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6'>
          {[...Array(9)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className='grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6'>
          {services.length === 0 ? (
            <div className='col-span-full text-center text-gray-500'>
              No services found
            </div>
          ) : (
            services.map((s) => <ServiceCard key={s._id} service={s} />)
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='flex justify-center mt-10'>
          <div className='join'>
            <button
              className='join-item btn'
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              «
            </button>

            <button className='join-item btn btn-active'>
              Page {page} / {totalPages}
            </button>

            <button
              className='join-item btn'
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
