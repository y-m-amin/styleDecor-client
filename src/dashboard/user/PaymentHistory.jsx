import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useNavigate } from 'react-router';
import axios from '../../api/axios';

function PaymentSkeletonCard() {
  return (
    <div className='bg-base-200 p-4 rounded-lg shadow'>
      <Skeleton height={18} width='60%' />
      <Skeleton height={14} width='40%' className='mt-2' />
      <Skeleton height={14} width='70%' className='mt-1' />
      <Skeleton height={20} width='30%' className='mt-3' />
    </div>
  );
}

const PaymentHistory = () => {
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [bookingsMap, setBookingsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(false);

  // prevent skeleton flash
  useEffect(() => {
    const t = setTimeout(() => loading && setShowSkeleton(true), 300);
    return () => clearTimeout(t);
  }, [loading]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [paymentsRes, bookingsRes] = await Promise.all([
          axios.get('/payments'),
          axios.get('/bookings'),
        ]);

        const bookings = bookingsRes.data.bookings || [];
        const map = {};
        bookings.forEach((b) => {
          map[b._id] = b;
        });

        setBookingsMap(map);
        setPayments(paymentsRes.data || []);
      } catch (err) {
        console.error('Error fetching payment history', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='p-4 sm:p-5'>
      <h2 className='text-xl sm:text-2xl font-bold mb-4'>Payment History</h2>

      {!loading && payments.length === 0 && (
        <div className='text-gray-500 py-6'>No payments made yet.</div>
      )}

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <AnimatePresence>
          {showSkeleton &&
            loading &&
            Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={`sk-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <PaymentSkeletonCard />
              </motion.div>
            ))}

          {!loading &&
            payments.map((p) => {
              const booking = bookingsMap[p.bookingId];

              return (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className='bg-base-200 p-4 rounded-lg shadow flex flex-col gap-1'
                >
                  <div className='flex items-start justify-between gap-2'>
                    <h3 className='font-semibold leading-tight'>
                      {booking?.serviceSnapshot?.service_name || 'Service'}
                    </h3>

                    <span className='badge badge-success badge-sm'>Paid</span>
                  </div>

                  {booking && (
                    <>
                      <p className='text-sm text-gray-600'>
                        Booking Date:{' '}
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </p>

                      <p className='text-sm text-gray-500'>
                        {typeof booking.location === 'object'
                          ? `${booking.location.city}, ${booking.location.country}`
                          : booking.location}
                      </p>
                    </>
                  )}

                  <div className='mt-2 flex items-center justify-between'>
                    <p className='font-bold text-lg'>৳{p.amount}</p>
                    <p className='text-sm text-gray-600'>
                      Paid on {new Date(p.paidAt).toLocaleDateString()}
                    </p>
                  </div>

                  <p className='text-xs text-gray-400 mt-1'>
                    Ref: {p.bookingRef}
                  </p>

                  <button
                    onClick={() =>
                      navigate(`/dashboard/payment-receipt/${p._id}`)
                    }
                    className='btn btn-xs btn-outline mt-2 self-end'
                  >
                    View Receipt
                  </button>
                </motion.div>
              );
            })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PaymentHistory;
