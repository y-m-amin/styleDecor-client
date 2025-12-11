import axiosInstance from './axios';

// For creating user in DB
export const saveUserToDB = async (user) => {
  const res = await axiosInstance.post('/users', user);
  return res.data;
};

// Verify JWT token
export const verifyUser = async () => {
  const res = await axiosInstance.get('/auth/verify');
  return res.data;
};
