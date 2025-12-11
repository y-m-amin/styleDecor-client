import { useContext } from 'react';
import { Navigate } from 'react-router';
import { AuthContext } from '../context/AuthContext';

export default function AdminRoute({ children }) {
  const { user, role, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user || role !== 'admin') return <Navigate to='/' replace />;
  return children;
}
