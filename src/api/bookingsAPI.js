import axios from './axios';

export const getMyBookings = async (params = {}) => {
  const res = await axios.get('/bookings', { params });
  return res.data;
};

export const createBooking = async (bookingData) => {
  const res = await axios.post('/bookings', bookingData);
  return res.data;
};

export const cancelBooking = async (id) => {
  const res = await axios.patch(`/bookings/${id}/cancel`);
  return res.data;
};
