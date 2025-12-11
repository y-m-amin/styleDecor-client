import { useEffect, useState } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router';
import axios from '../../api/axios';

const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('/decorator/projects');
      setProjects(res.data);
    } catch (err) {
      console.log('Failed fetching projects', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  if (loading) return <Skeleton count={5} height={130} />;

  return (
    <div className='p-5'>
      <h2 className='text-2xl font-bold mb-4'>My Assigned Projects</h2>

      <div className='grid md:grid-cols-2 gap-4'>
        {projects.map((p) => (
          <div
            key={p._id}
            className='bg-white shadow rounded-lg p-4 border border-gray-100'
          >
            <h3 className='text-xl font-semibold'>{p.serviceName}</h3>

            <p className='text-sm text-gray-500'>Booking ID: {p.bookingId}</p>

            <div className='flex items-center gap-2 mt-2 text-gray-600'>
              <FaMapMarkerAlt /> {p.location}
            </div>

            <p className='mt-2'>
              <span className='font-semibold'>Event Date:</span>{' '}
              {new Date(p.date).toLocaleDateString()}
            </p>

            <span
              className={`inline-block mt-3 px-3 py-1 rounded text-sm ${
                p.status === 'pending'
                  ? 'bg-yellow-200 text-yellow-700'
                  : p.status === 'in-progress'
                  ? 'bg-blue-200 text-blue-700'
                  : 'bg-green-200 text-green-700'
              }`}
            >
              {p.status}
            </span>

            <Link
              to='/dashboard/decorator/project-status'
              state={p}
              className='block mt-4 text-blue-600 hover:underline'
            >
              Update Status →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyProjects;
