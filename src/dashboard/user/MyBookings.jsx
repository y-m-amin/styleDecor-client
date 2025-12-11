import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import Skeleton from 'react-loading-skeleton';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await axios.get('/bookings');
      setBookings(res.data.bookings);
    } catch (err) {
      console.error('Error fetching bookings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) return <Skeleton count={3} height={80} />;

  return (
    <div className='p-5'>
      <h2 className='text-2xl font-bold mb-4'>My Bookings</h2>

      {bookings.length === 0 ? (
        <p className='text-gray-600'>No bookings found.</p>
      ) : (
        <ul className='space-y-4'>
          {bookings.map((b) => (
            <li
              key={b._id}
              className='border p-4 rounded-lg shadow-sm '
            >
              <h3 className='font-semibold'>{b.serviceSnapshot?.service_name}</h3>
              <p className='text-sm text-gray-600'>Date: {new Date(b.bookingDate).toLocaleDateString()}</p>
              <p className='text-sm'>Status: {b.status}</p>
              <p className='text-sm'>Location: {typeof b.location === 'object'
    ? `${b.location.city ?? ''}, ${b.location.country ?? ''}`
    : b.location || 'N/A'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyBookings;
