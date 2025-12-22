import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useReactToPrint } from 'react-to-print';
import axios from '../../api/axios';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const session_id = searchParams.get('session_id');

  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState(null);
  const receiptRef = useRef();

  useEffect(() => {
    if (!session_id) return;

    const verifyAndFetch = async () => {
      try {
        // verify payment
        await axios.patch(`/payment-success?session_id=${session_id}`);

        // fetch latest payment by session id
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

  return (
    <div className='p-4 sm:p-6 max-w-2xl mx-auto'>
      {/* Receipt */}
      <motion.div
        ref={receiptRef}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className='bg-base-200 border rounded-xl p-6 shadow'
      >
        <h1 className='text-2xl font-bold text-green-600 mb-1'>
          Payment Receipt
        </h1>
        <p className='text-sm text-gray-300 mb-6'>Transaction successful</p>

        <div className='space-y-2 text-sm'>
          <Row label='Booking Ref' value={payment.bookingRef} />
          <Row label='Service' value={payment.serviceName} />
          <Row
            label='Paid On'
            value={new Date(payment.paidAt).toLocaleString()}
          />
          <Row label='Payment Method' value='Online' />
        </div>

        <hr className='my-4' />

        <div className='flex justify-between items-center text-lg font-semibold'>
          <span>Total Paid</span>
          <span>৳{payment.amount}</span>
        </div>
      </motion.div>

      {/* Actions */}
      <div className='mt-6 flex flex-wrap gap-3 justify-center'>
        <button onClick={handlePrint} className='btn btn-outline'>
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
    <div className='flex justify-between gap-2'>
      <span className='text-gray-500'>{label}</span>
      <span className='font-medium text-right'>{value}</span>
    </div>
  );
}
