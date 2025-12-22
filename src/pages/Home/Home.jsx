import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from '../../api/axios';
import MapComponent from '../../components/MapComponent';
import ServiceCard from '../../components/ServiceCard';
import SkeletonCard from '../../components/SkeletonCard';
import Hero from './Hero';

export default function Home() {
  const [services, setServices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [decorators, setDecorators] = useState([]);

  let navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const fetchTopDecorators = async () => {
      try {
        const res = await axios.get('/decorators/top?limit=6');
        setDecorators(res.data.decorators || []);
      } catch (err) {
        console.error('Failed to load decorators', err);
      }
    };
    fetchTopDecorators();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/services', {
          params: { limit: 6 },
        });
        setServices(res.data.services || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div>
      <Hero />

      <section className='container mx-auto px-4 py-10'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-semibold'>
            Popular Decoration Services
          </h2>
          <button
            onClick={() => navigate('/services')}
            className='btn btn-outline btn-sm'
          >
            See More Services →
          </button>
        </div>

        {loading ? (
          <div className='grid md:grid-cols-3 gap-6'>
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className='grid md:grid-cols-3 gap-6'>
            {services.map((s) => (
              <ServiceCard key={s._id} service={s} />
            ))}
          </div>
        )}
      </section>

      <section className='py-10'>
        <div className='container mx-auto px-4'>
          <h3 className='text-xl font-semibold mb-4'>Top Decorators</h3>
          {decorators.length === 0 ? (
            <p className='text-gray-500'>No decorators yet.</p>
          ) : (
            <div className='grid grid-cols-2 md:grid-cols-6 gap-4'>
              {decorators.map((d) => (
                <motion.div
                  key={d._id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className='bg-base-300 p-4 rounded-lg shadow cursor-pointer'
                  onClick={() => navigate(`/decorators/${d._id}`)}
                >
                  <div className='flex flex-col items-center text-center'>
                    <img
                      src={d.photoURL}
                      alt={d.displayName}
                      className='w-20 h-20 rounded-full object-cover'
                    />
                    <div className='mt-2 font-semibold'>{d.displayName}</div>
                    <div className='text-xs text-gray-500 my-1'>
                      Rating: {d.rating ?? 'N/A'}
                    </div>
                    <div className='text-xs text-gray600'>
                      {d.specialties?.join(', ') || 'No specialties'}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className='container mx-auto px-4 py-10'>
        <h3 className='text-xl font-semibold mb-4'>Service Coverage Map</h3>
        <MapComponent />
      </section>
    </div>
  );
}
