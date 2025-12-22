import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import Spinner from '../../Components/Spinner';

export default function Forbidden() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => {
      navigate('/', { replace: true });
    }, 3000);

    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-4xl font-bold mb-2">403</h1>
      <h2 className="text-xl font-semibold mb-3">Access Restricted</h2>

      <p className="text-gray-500 mb-6 max-w-md">
        You don’t have permission to view this page.
        You’ll be redirected shortly.
      </p>

      <Spinner />

      <button
        className="btn btn-outline mt-6"
        onClick={() => navigate('/', { replace: true })}
      >
        Go to Home
      </button>
    </div>
  );
}
