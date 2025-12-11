import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import Skeleton from 'react-loading-skeleton';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const res = await axios.get('/payments');
      setPayments(res.data);
    } catch (err) {
      console.error('Error fetching payments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  if (loading) return <Skeleton count={4} height={50} />;

  return (
    <div className='p-5'>
      <h2 className='text-2xl font-bold mb-4'>Payment History</h2>

      {payments.length === 0 ? (
        <p className='text-gray-600'>No payments made yet.</p>
      ) : (
        <ul className='space-y-4'>
          {payments.map((p) => (
            <li key={p._id} className=' shadow p-4 rounded-lg'>
              <p>
                <strong>Amount:</strong> ৳{p.amount}
              </p>
              <p className='text-sm text-gray-600'>
                Paid on {new Date(p.paidAt).toLocaleDateString()}
              </p>
              <p className='text-sm'>Ref: {p.bookingRef}</p>
              <p className='text-sm'>Transaction ID: {p.transactionId}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PaymentHistory;
