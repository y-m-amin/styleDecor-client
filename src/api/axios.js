// src/api/axios.js
import axios from 'axios';
import { toast } from 'react-toastify';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  //baseURL: 'http://localhost:5000',
  timeout: 30000,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message;

    if (status === 403 && message?.toLowerCase().includes('demo')) {
      toast.error('Demo account: this action is disabled', {
        position: 'top-center',
      });
    }

    return Promise.reject(error);
  }
);

export default instance;
