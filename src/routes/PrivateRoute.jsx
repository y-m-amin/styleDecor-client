import { Navigate, useLocation } from 'react-router';
import { useContext } from 'react';
import Spinner from '../Components/Spinner';

import { AuthContext } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <Spinner />;

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
}
