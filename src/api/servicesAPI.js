import axios from './axios';

export const fetchServices = async (params = {}) => {
  const res = await axios.get('/services', { params });
  return res.data;
};

export const fetchServiceById = async (id) => {
  const res = await axios.get(`/services/${id}`);
  return res.data;
};
