import axios from './axios';

export const initiateStripePayment = async (bookingId) => {
  const res = await axios.post('/payment-checkout-session', { bookingId });
  return res.data;
};

export const fetchPaymentHistory = async () => {
  const res = await axios.get('/payments');
  return res.data;
};
