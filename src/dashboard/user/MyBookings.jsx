

import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-toastify';
import axios from '../../api/axios';
import { initiateStripePayment } from '../../api/paymentAPI';

const formatCurrency = (amt) => `৳${amt?.toLocaleString() || 0}`;


const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    paymentStatus: '',
    dateOrder: 'new', // new or old
  });

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
      console.error(err);
      toast.error('Failed to fetch bookings');
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

  /** Client-side filtering */
  const filteredBookings = bookings
    .filter((b) => (filters.status ? b.status === filters.status : true))
    .filter((b) =>
      filters.paymentStatus
        ? b.payment?.paymentStatus === filters.paymentStatus
        : true
    )
    .sort((a, b) => {
      if (filters.dateOrder === 'new') {
        return new Date(b.bookingDate) - new Date(a.bookingDate);
      } else {
        return new Date(a.bookingDate) - new Date(b.bookingDate);
      }
    });

  if (loading) {
    return (
      <div className='p-5 space-y-4'>
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} height={80} />
        ))}
      </div>
    );
  }

  return (
    <div className='p-5 max-w-5xl mx-auto'>
      <h2 className='text-2xl font-bold mb-4'>My Bookings</h2>

      {/* FILTERS */}
      <div className='flex flex-wrap gap-3 mb-5'>
        <select
          className='select select-bordered select-sm'
          value={filters.status}
          onChange={(e) =>
            setFilters((f) => ({ ...f, status: e.target.value }))
          }
        >
          <option value=''>All Status</option>
          <option value='pending'>Pending</option>
          <option value='completed'>Completed</option>
          <option value='cancelled'>Cancelled</option>
        </select>

        <select
          className='select select-bordered select-sm'
          value={filters.paymentStatus}
          onChange={(e) =>
            setFilters((f) => ({ ...f, paymentStatus: e.target.value }))
          }
        >
          <option value=''>All Payments</option>
          <option value='paid'>Paid</option>
          <option value='unpaid'>Unpaid</option>
          <option value='initiated'>Initiated</option>
        </select>

        <select
          className='select select-bordered select-sm'
          value={filters.dateOrder}
          onChange={(e) =>
            setFilters((f) => ({ ...f, dateOrder: e.target.value }))
          }
        >
          <option value='new'>Newest First</option>
          <option value='old'>Oldest First</option>
        </select>
      </div>

      {/* booking list */}
      <ul className='list bg-base-100 rounded-box shadow-md'>
        {filteredBookings.length === 0 && (
          <li className='p-4 text-gray-500'>No bookings found</li>
        )}

        {filteredBookings.map((b) => (
          <li key={b._id} className='list-row items-center'>
            <div>
              <img
                className='size-10 rounded-box'
                src={
                  b.serviceSnapshot?.image ||
                  'https://i.ibb.co/2kRzF5H/user.png'
                }
              />
            </div>
            <div className='flex-1'>
              <div className='font-semibold'>
                {b.serviceSnapshot?.service_name}
              </div>
              <div className="text-xs font-semibold uppercase opacity-60 flex flex-wrap gap-2">
  <span>{b.status}</span>
  <span>•</span>
  <span>Payment: {b.payment?.paymentStatus}</span>

  {b.payment?.couponCode && (
    <span className="badge badge-success badge-sm">
      Coupon: {b.payment.couponCode}
    </span>
  )}
</div>

              <div className='text-xs opacity-60'>
                {new Date(b.bookingDate).toLocaleDateString()}
              </div>

              <div className="text-xs mt-1 space-y-1">
  {b.payment?.originalAmount && (
    <p className="line-through opacity-50">
      Original: {formatCurrency(b.payment.originalAmount)}
    </p>
  )}

  {b.payment?.discount > 0 && (
    <p className="text-green-600">
      Discount: −{formatCurrency(b.payment.discount)}
    </p>
  )}

  <p className="font-semibold">
    Amount: {formatCurrency(b.payment.amount)}
  </p>
</div>
              
            </div>




            <div className='flex flex-wrap px-2 gap-2'>
              {/* Pay Now */}
              {b.status !== 'cancelled' &&
                (b.payment?.paymentStatus === 'unpaid' ||
                  b.payment?.paymentStatus === 'initiated') && (
                  <button
                    className='btn btn-square btn-sm btn-primary w-20 '
                    onClick={() => handlePay(b._id)}
                  >
                    Pay
                  </button>
                )}

              {/* Cancel */}
              {b.status === 'pending' && (
                <button
                  className='btn btn-square btn-sm btn-outline btn-error w-20'
                  onClick={() => handleCancel(b._id)}
                >
                  Cancel
                </button>
              )}

              {/* Edit */}
              {(b.status !== 'cancelled' || b.status !== 'completed') && (
                <button
                  className='btn btn-square btn-sm btn-info w-20'
                  onClick={() => setEditBooking(b)}
                >
                  Edit
                </button>
              )}

              {/* Rate */}
              {b.assignedDecorators?.length > 0 && (
                <button
                  className='btn btn-square btn-sm btn-secondary w-20'
                  onClick={() =>
                    setRatingData({
                      show: true,
                      decoratorId: b.assignedDecorators[0].userId,
                    })
                  }
                >
                  Rate
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
      {/* EDIT BOOKING MODAL */}
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

      {/* RATE DECORATOR MODAL */}
      {ratingData.show && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='p-6 rounded-lg w-full max-w-sm'>
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
