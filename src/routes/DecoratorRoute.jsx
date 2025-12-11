import { useContext } from 'react';
import { Navigate } from 'react-router';
import { AuthContext } from '../context/AuthContext';

export default function DecoratorRoute({ children }) {
  const { user, role, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to='/login' replace />;

  if (role !== 'decorator') return <Navigate to='/' replace />;

  return children;
}
