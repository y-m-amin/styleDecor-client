import { useContext } from 'react';
import { Navigate } from 'react-router';
import Spinner from '../Components/Spinner';
import { AuthContext } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading)
    return (
      <div>
        <Spinner />
      </div>
    );
  if (!user) return <Navigate to='/login' replace />;
  return children;
}
