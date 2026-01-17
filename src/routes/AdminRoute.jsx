import { useContext } from 'react';
import { Navigate } from 'react-router';
import Spinner from '../Components/Spinner';
import { AuthContext } from '../context/AuthContext';

export default function AdminRoute({ children }) {
  const { user, role, loading } = useContext(AuthContext);
  if (loading)
    return (
      <div>
        <Spinner />
      </div>
    );
  if (!user || !['admin', 'admin_demo'].includes(role)) {
    return <Navigate to='/forbidden' replace />;
  }

  return children;
}
