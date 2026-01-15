import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useReactToPrint } from 'react-to-print';
import axios from '../../api/axios';
import logoImg from '../../assets/styledecor.png';

export default function PaymentReceipt() {
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  const receiptRef = useRef(null);

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const res = await axios.get(`/payments/${paymentId}`);
        setPayment(res.data);
      } catch (err) {
        console.error('Failed to load receipt', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
  }, [paymentId]);

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `StyleDecor_Receipt_${payment?.bookingRef}`,
  });

  if (loading) {
    return (
      <div className='p-6 text-center text-gray-500'>Loading receipt…</div>
    );
  }

  if (!payment) {
    return (
      <div className='p-6 text-center text-red-500'>Receipt not found.</div>
    );
  }

  return (
    <div className='p-4 sm:p-6 max-w-2xl mx-auto'>
      {/* IMPORTANT: plain div for printing */}
      <div ref={receiptRef}>
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-base-200 border border-base-300 shadow-xl shadow-base rounded-xl p-6'
        >
          {/* ===== HEADER ===== */}
          <div className='text-center mb-6'>
            {/* Logo */}
            <div className='flex justify-center mb-2'>
              <img
                src={logoImg}
                alt='StyleDecor logo'
                className='w-12 h-12 object-contain'
              />
            </div>

            {/* Brand name */}
            <h1 className='text-2xl font-extrabold tracking-tight'>
              Style<span className='text-primary'>Decor</span>
            </h1>

            {/* Tagline */}
            <p className='text-sm text-base-content/60'>
              Making every space beautiful
            </p>

            {/* Address */}
            <p className='mt-2 text-xs text-base-content/40 leading-relaxed'>
              StyleDecor Corporate Office
              <br />
              Road 12, Gulshan-2, Dhaka 1212
            </p>
          </div>

          <hr className='mb-6' />

          {/* ===== RECEIPT INFO ===== */}
          <div className='mb-4'>
            <h2 className='text-xl font-semibold text-green-600'>
              Payment Receipt
            </h2>
            <p className='text-sm text-gray-500'>
              Receipt #{payment.bookingRef}
            </p>
          </div>

          <div className='space-y-2 text-sm'>
            <Row label='Amount Paid' value={`৳${payment.amount}`} />
            <Row
              label='Paid On'
              value={new Date(payment.paidAt).toLocaleString()}
            />
            <Row label='Currency' value={payment.currency} />
            <Row label='Payment Status' value='Paid' />
          </div>

          <hr className='my-4' />

          <p className='text-xs text-gray-400'>
            Transaction ID: {payment.transactionId || '—'}
          </p>

          {/* ===== FOOTER ===== */}
          <div className='mt-6 pt-4 border-t border-base-300 text-center text-xs text-gray-500'>
            <p>Need help?</p>
            <p className='mt-1'>📞 +880 1700 123 456</p>
            <p>✉️ info@styledecor.com</p>
          </div>
        </motion.div>
      </div>

      {/* ACTIONS */}
      <div className='mt-6 flex gap-3 justify-center'>
        <button onClick={handlePrint} className='btn btn-outline'>
          Download / Print
        </button>

        <button onClick={() => navigate(-1)} className='btn btn-primary'>
          Go Back
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
