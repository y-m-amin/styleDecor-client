import { useNavigate } from 'react-router';

export default function GlobalError() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-4xl font-bold mb-2">Oops!</h1>
      <h2 className="text-xl font-semibold text-accent mb-3">
        Page not found
      </h2>

      <p className="text-gray-500 max-w-md mb-6">
        An unexpected error occurred while loading this page.
        Please try again or return to the homepage.
      </p>

      <button
        className="btn btn-outline"
        onClick={() => navigate('/', { replace: true })}
      >
        Go to Home
      </button>
    </div>
  );
}
