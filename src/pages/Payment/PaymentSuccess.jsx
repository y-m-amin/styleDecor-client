import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useReactToPrint } from 'react-to-print';
import axios from '../../api/axios';
import logoImg from '../../assets/styledecor.png';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const session_id = searchParams.get('session_id');

  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState(null);
  const [animationComplete, setAnimationComplete] = useState(false);

  const receiptRef = useRef();

  useEffect(() => {
    if (!session_id) return;

    const verifyAndFetch = async () => {
      try {
        // Verify payment
        await axios.patch(`/payment-success?session_id=${session_id}`);

        // Fetch payment + booking together
        const res = await axios.get(`/payments/by-session/${session_id}`);
        setPayment(res.data);
      } catch (err) {
        console.error('Payment verification failed', err);
      } finally {
        setLoading(false);
      }
    };

    verifyAndFetch();
  }, [session_id]);

  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
  });

  if (loading) {
    return (
      <div className='p-6 text-center text-gray-500'>Verifying payment…</div>
    );
  }

  if (!payment) {
    return (
      <div className='p-6 text-center text-red-500'>
        Unable to load receipt.
      </div>
    );
  }

  const serviceName =
    payment.booking?.serviceSnapshot?.service_name || 'Service';
  const location = payment.booking?.location || 'Location not provided';

  return (
    <div className='p-4 sm:p-6 max-w-2xl mx-auto'>
      <motion.div
        ref={receiptRef} // <-- ref directly on motion div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        onAnimationComplete={() => setAnimationComplete(true)}
        className='bg-base-200 border rounded-xl p-6 shadow'
      >
        {/* Logo */}
        <div className='text-center mb-4'>
          <img
            src={logoImg}
            alt='StyleDecor logo'
            className='w-12 h-12 mx-auto'
          />
          <h1 className='text-2xl font-bold tracking-tight'>
            Style<span className='text-primary'>Decor</span>
          </h1>
          <p className='text-sm text-base-content/60'>
            Making every space beautiful
          </p>
        </div>

        <hr className='mb-4' />

        {/* Payment Info */}
        <div className='space-y-2 text-sm'>
          <Row label='Booking Ref' value={payment.bookingRef} />
          <Row label='Service' value={serviceName} />
          <Row label='Location' value={location} />
          <Row label='Amount Paid' value={`৳${payment.amount}`} />
          <Row
            label='Paid On'
            value={new Date(payment.paidAt).toLocaleString()}
          />
          <Row label='Payment Status' value='Paid' />
        </div>

        <hr className='my-4' />
        <p className='text-xs text-gray-400'>
          Transaction ID: {payment.transactionId || '—'}
        </p>
      </motion.div>

      {/* Actions */}
      <div className='mt-6 flex gap-3 justify-center'>
        <button
          onClick={handlePrint}
          className='btn btn-outline'
          disabled={!payment || !animationComplete}
        >
          Download / Print
        </button>

        <button
          onClick={() => navigate('/dashboard/my-bookings')}
          className='btn btn-primary'
        >
          Go to My Bookings
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className='flex justify-between'>
      <span className='text-gray-500'>{label}</span>
      <span className='font-medium'>{value}</span>
    </div>
  );
}
