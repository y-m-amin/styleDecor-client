import { useEffect, useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-toastify';
import axios from '../../api/axios';
import { initiateStripePayment } from '../../api/paymentAPI';

const formatCurrency = (amt) => `৳${amt?.toLocaleString() || 0}`;

const STATUS_ORDER = [
  'assigned',
  'planning_phase',
  'materials_prepared',
  'on_the_way',
  'setup_in_progress',
  'completed',
];

const formatStatusLabel = (s) => {
  if (!s) return '';
  return s
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    status: '',
    paymentStatus: '',
    dateOrder: 'new', // new or old
  });

  const [editBooking, setEditBooking] = useState(null);

  // Proper rating modal state
  const [ratingModal, setRatingModal] = useState({
    open: false,
    decoratorId: null,
    bookingId: null,
  });
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingSubmitting, setRatingSubmitting] = useState(false);

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
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (err) {
      console.error('Cancel failed', err);
      toast.error(err.response?.data?.message || 'Cancel failed');
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

  const openRating = (booking) => {
    const decoratorId = booking?.assignedDecorators?.[0]?.userId || null;
    if (!decoratorId) return;

    setSelectedRating(0);
    setHoverRating(0);
    setRatingModal({
      open: true,
      decoratorId,
      bookingId: booking._id,
    });
  };

  const closeRating = () => {
    if (ratingSubmitting) return;
    setRatingModal({ open: false, decoratorId: null, bookingId: null });
    setSelectedRating(0);
    setHoverRating(0);
  };

  const handleSubmitRating = async () => {
    if (!selectedRating) {
      toast.error('Please select a rating');
      return;
    }

    setRatingSubmitting(true);
    try {
      await axios.post(`/decorators/${ratingModal.decoratorId}/rate`, {
        rating: selectedRating,
      });
      toast.success('Rating submitted!');
      closeRating();
      fetchBookings();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setRatingSubmitting(false);
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings
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
  }, [bookings, filters]);

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
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
        >
          <option value=''>All Status</option>
          <option value='assigned'>Assigned</option>
          <option value='planning_phase'>Planning Phase</option>
          <option value='materials_prepared'>Materials Prepared</option>
          <option value='on_the_way'>On The Way</option>
          <option value='setup_in_progress'>Setup In Progress</option>
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
          onChange={(e) => setFilters((f) => ({ ...f, dateOrder: e.target.value }))}
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

        {filteredBookings.map((b) => {
          const status = b.status;
          const paymentStatus = b.payment?.paymentStatus;

          const isCancelled = status === 'cancelled';
          const isCompleted = status === 'completed';
          const isTerminal = isCancelled || isCompleted;

          const statusIdx = STATUS_ORDER.indexOf(status);
          const onTheWayIdx = STATUS_ORDER.indexOf('on_the_way');

          // EDIT up to on_the_way (inclusive), but never for cancelled/completed
          const canEdit =
            !isTerminal &&
            statusIdx !== -1 &&
            onTheWayIdx !== -1 &&
            statusIdx <= onTheWayIdx;

          // CANCEL only before paid (and never for cancelled/completed)
          const canCancel = !isTerminal && paymentStatus !== 'paid';

          // RATE only after completed
          const canRate = isCompleted && (b.assignedDecorators?.length || 0) > 0;

          // PAY: keep your current logic (not cancelled + unpaid/initiated)
          const canPay =
            !isCancelled &&
            (paymentStatus === 'unpaid' || paymentStatus === 'initiated');

          return (
            <li key={b._id} className='list-row items-center'>
              <div>
                <img
                  className='size-10 rounded-box'
                  src={
                    b.serviceSnapshot?.image ||
                    'https://i.ibb.co/2kRzF5H/user.png'
                  }
                  alt='service'
                />
              </div>

              <div className='flex-1'>
                <div className='font-semibold'>
                  {b.serviceSnapshot?.service_name}
                </div>

                <div className='text-xs font-semibold uppercase opacity-60 flex flex-wrap gap-2'>
                  <span>{formatStatusLabel(status)}</span>
                  <span>•</span>
                  <span>Payment: {paymentStatus || 'unknown'}</span>

                  {b.payment?.couponCode && (
                    <span className='badge badge-success badge-sm'>
                      Coupon: {b.payment.couponCode}
                    </span>
                  )}
                </div>

                <div className='text-xs opacity-60'>
                  {new Date(b.bookingDate).toLocaleDateString()}
                </div>

                <div className='text-xs mt-1 space-y-1'>
                  {b.payment?.originalAmount && (
                    <p className='line-through opacity-50'>
                      Original: {formatCurrency(b.payment.originalAmount)}
                    </p>
                  )}

                  {b.payment?.discount > 0 && (
                    <p className='text-green-600'>
                      Discount: −{formatCurrency(b.payment.discount)}
                    </p>
                  )}

                  <p className='font-semibold'>
                    Amount: {formatCurrency(b.payment.amount)}
                  </p>
                </div>
              </div>

              <div className='flex flex-wrap px-2 gap-2'>
                {canPay && (
                  <button
                    className='btn btn-square btn-sm btn-primary w-20'
                    onClick={() => handlePay(b._id)}
                  >
                    Pay
                  </button>
                )}

                {canCancel && (
                  <button
                    className='btn btn-square btn-sm btn-outline btn-error w-20'
                    onClick={() => handleCancel(b._id)}
                  >
                    Cancel
                  </button>
                )}

                {canEdit && (
                  <button
                    className='btn btn-square btn-sm btn-info w-20'
                    onClick={() => setEditBooking(b)}
                  >
                    Edit
                  </button>
                )}

                {canRate && (
                  <button
                    className='btn btn-square btn-sm btn-secondary w-20'
                    onClick={() => openRating(b)}
                  >
                    Rate
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {/* EDIT BOOKING MODAL */}
      {editBooking && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3'>
          <div className='bg-base-100 p-6 rounded-lg w-full max-w-md shadow-xl'>
            <h2 className='text-xl font-bold mb-4'>Edit Booking</h2>

            <label className='block mb-2'>Booking Date:</label>
            <input
              type='date'
              value={String(editBooking.bookingDate).slice(0, 10)}
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
                Close
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

      {/* RATING MODAL (proper) */}
      {ratingModal.open && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3'>
          <div className='bg-base-100 rounded-xl w-full max-w-sm shadow-xl'>
            <div className='p-5 border-b'>
              <h2 className='text-lg font-bold'>Rate Decorator</h2>
              <p className='text-sm opacity-70 mt-1'>
                Select a star rating and submit.
              </p>
            </div>

            <div className='p-5'>
              <div className='flex justify-center gap-2 mb-4'>
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = (hoverRating || selectedRating) >= star;
                  return (
                    <button
                      key={star}
                      type='button'
                      className={`text-3xl transition ${
                        active ? 'opacity-100' : 'opacity-30'
                      }`}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setSelectedRating(star)}
                      disabled={ratingSubmitting}
                      aria-label={`${star} star`}
                    >
                      ★
                    </button>
                  );
                })}
              </div>

              <div className='text-center text-sm opacity-70 mb-4'>
                {selectedRating ? `${selectedRating}/5` : 'No rating selected'}
              </div>

              <div className='flex gap-2'>
                <button
                  className='btn btn-outline flex-1'
                  onClick={closeRating}
                  disabled={ratingSubmitting}
                >
                  Close
                </button>
                <button
                  className='btn btn-secondary flex-1'
                  onClick={handleSubmitRating}
                  disabled={ratingSubmitting || !selectedRating}
                >
                  {ratingSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
