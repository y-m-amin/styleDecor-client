import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import axios from '../../api/axios';
import { initiateStripePayment } from '../../api/paymentAPI';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Modals
  const [editBooking, setEditBooking] = useState(null);
  const [ratingData, setRatingData] = useState({
    show: false,
    decoratorId: null,
  });

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

  const handlePay = async (bookingId) => {
    try {
      const { url } = await initiateStripePayment(bookingId);
      if (url) window.location.href = url;
    } catch (err) {
      console.error('Payment failed:', err);
      toast.error(err.response?.data?.message || 'Payment failed');
    }
  };

  const handleCancel = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await axios.patch(`/bookings/${bookingId}/cancel`);
      fetchBookings();
    } catch (err) {
      console.error('Cancel failed', err);
    }
  };

  const handleEditSubmit = async () => {
    try {
      await axios.patch(`/bookings/${editBooking._id}`, {
        bookingDate: editBooking.bookingDate,
        location: editBooking.location,
      });
      toast.success('Booking updated!');
      setEditBooking(null);
      fetchBookings();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update booking');
    }
  };

  const handleSubmitRating = async (rating) => {
    try {
      await axios.post(`/decorators/${ratingData.decoratorId}/rate`, {
        rating,
      });
      toast.success('Rating submitted!');
      setRatingData({ show: false, decoratorId: null });
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit rating');
    }
  };

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
              className='border p-4 rounded-lg shadow-sm space-y-2'
            >
              <h3 className='font-semibold'>
                {b.serviceSnapshot?.service_name}
              </h3>

              <p className='text-sm text-gray-600'>
                Date: {new Date(b.bookingDate).toLocaleDateString()}
              </p>

              <p className='text-sm'>Status: {b.status}</p>

              <p className='text-sm'>
                Location:{' '}
                {typeof b.location === 'object'
                  ? `${b.location.city ?? ''}, ${b.location.country ?? ''}`
                  : b.location || 'N/A'}
              </p>
              <p className='text-sm'>
                Payment Status: {b.payment?.paymentStatus}
              </p>

              <div className='mt-3 flex flex-wrap gap-2'>
                {/* Pay Now */}
                {b.status !== 'cancelled' &&
                  (b.payment?.paymentStatus === 'unpaid' ||
                    b.payment?.paymentStatus === 'initiated') && (
                    <button
                      className='btn btn-primary'
                      onClick={() => handlePay(b._id)}
                    >
                      Pay Now
                    </button>
                  )}

                {/* Cancel */}
                {b.status === 'pending' && (
                  <button
                    onClick={() => handleCancel(b._id)}
                    className='btn btn-sm btn-outline btn-error'
                  >
                    Cancel
                  </button>
                )}

                {/* Edit */}
                {b.status !== 'cancelled' && (
                  <button
                    className='btn btn-sm btn-info'
                    onClick={() => setEditBooking(b)}
                  >
                    Edit Booking
                  </button>
                )}

                {/* Rate */}
                {b.assignedDecorators?.length > 0 && (
                  <button
                    className='btn btn-sm btn-secondary'
                    onClick={() =>
                      setRatingData({
                        show: true,
                        decoratorId: b.assignedDecorators[0].userId,
                      })
                    }
                  >
                    Rate Decorator
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Edit Booking Modal */}
      {editBooking && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-gray-500 p-6 rounded-lg w-full max-w-md'>
            <h2 className='text-xl font-bold mb-4'>Edit Booking</h2>

            <label className='block mb-2'>Booking Date:</label>
            <input
              type='date'
              value={editBooking.bookingDate.slice(0, 10)}
              onChange={(e) =>
                setEditBooking({ ...editBooking, bookingDate: e.target.value })
              }
              className='input input-bordered w-full mb-3'
            />

            <label className='block mb-2'>Location:</label>
            <input
              type='text'
              value={editBooking.location || ''}
              onChange={(e) =>
                setEditBooking({ ...editBooking, location: e.target.value })
              }
              className='input input-bordered w-full mb-3'
            />

            <div className='flex justify-end gap-2'>
              <button
                onClick={() => setEditBooking(null)}
                className='btn btn-outline'
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className='btn btn-accent text-white'
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rate Decorator Modal */}
      {ratingData.show && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className=' p-6 rounded-lg w-full max-w-sm'>
            <h2 className='text-xl font-bold mb-4'>Rate Decorator</h2>

            <div className='flex justify-center space-x-2 mb-4'>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleSubmitRating(star)}
                  className='text-2xl'
                >
                  ⭐
                </button>
              ))}
            </div>

            <button
              className='btn btn-outline w-full'
              onClick={() => setRatingData({ show: false, decoratorId: null })}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
