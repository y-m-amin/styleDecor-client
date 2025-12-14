import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import axios from '../../api/axios';

const STATUS_FLOW = [
  'assigned',
  'planning_phase',
  'materials_prepared',
  'on_the_way',
  'setup_in_progress',
  'completed',
];

export default function MyProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('/decorator/bookings');
      setProjects(res.data.bookings || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const updateStatus = async (id, status) => {
    setSavingId(id);
    try {
      await axios.patch(`/decorator/bookings/${id}/status`, { status });
      setProjects((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status } : p))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setSavingId(null);
    }
  };

  if (loading) return <Skeleton count={5} height={120} />;

  return (
    <div className='p-5'>
      <h2 className='text-2xl font-bold mb-4'>My Assigned Projects</h2>

      <div className='grid md:grid-cols-2 gap-4'>
        {projects.map((p) => (
          <div key={p._id} className='bg-base-200 p-4 rounded-lg shadow'>
            <h3 className='text-lg font-semibold'>
              {p.serviceSnapshot?.service_name || p.service?.name}
            </h3>

            <p className='text-sm text-gray-500'>#{p.bookingRef}</p>

            <p className='mt-2'>
              <b>Date:</b> {new Date(p.bookingDate).toLocaleDateString()}
            </p>

            <p className='text-gray-600'>
              {typeof p.location === 'object'
                ? `${p.location.city}, ${p.location.country}`
                : p.location}
            </p>

            <select
              className='select select-sm select-bordered mt-3 w-full'
              value={p.status}
              disabled={savingId === p._id || p.status === 'completed'}
              onChange={(e) => updateStatus(p._id, e.target.value)}
            >
              {STATUS_FLOW.map((s) => (
                <option key={s} value={s}>
                  {s.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
