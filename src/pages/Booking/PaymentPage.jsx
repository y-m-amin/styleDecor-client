import axios from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function PaymentPage({ bookingId }) {
  const { jwt } = useAuth();

  const handlePayment = async () => {
    const { data } = await axios.post(
      '/payment-checkout-session',
      { bookingId },
      { headers: { Authorization: `Bearer ${jwt}` } }
    );
    window.location.href = data.url;
  };

  return (
    <button
      onClick={handlePayment}
      className='px-6 py-3 bg-green-600 text-white rounded'
    >
      Pay with Stripe
    </button>
  );
}
