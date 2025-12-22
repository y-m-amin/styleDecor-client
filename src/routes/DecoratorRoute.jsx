import { useContext } from 'react';
import { Navigate } from 'react-router';
import { AuthContext } from '../context/AuthContext';
import Spinner from '../Components/Spinner';

export default function DecoratorRoute({ children }) {
  const { user, role, decoratorStatus, loading } = useContext(AuthContext);

  if (loading) return <> <Spinner /> </>;

  if (!user) return <Navigate to='/login' replace />;

  if (role !== 'decorator' || decoratorStatus !== 'active') {
  return <Navigate to="/forbidden" replace />;
}


  return children;
}
