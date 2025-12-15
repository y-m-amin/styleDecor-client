import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "../../api/axios";
import Skeleton from "react-loading-skeleton";

export default function DecoratorProfilePub() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [decorator, setDecorator] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    window.scrollTo({ top: 0, behavior: 'smooth' });

    const fetchDecorator = async () => {
      try {
        const res = await axios.get(`/decorators/${id}`);
        setDecorator(res.data);
      } catch (err) {
        console.error("Failed to load decorator", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDecorator();
  }, [id]);

  if (loading) return <Skeleton count={4} height={80} />;

  if (!decorator)
    return (
      <div className="p-6 text-center text-gray-600">
        Decorator not found.
      </div>
    );

  return (
    <div className="container mx-auto px-6 py-8 max-w-3xl">
      <button
        className="btn btn-ghost mb-6"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="bg-base-300 shadow p-6 rounded-lg">
        <div className="flex flex-col items-center">
          <img
            src={decorator.photoURL}
            alt={decorator.displayName}
            className="w-32 h-32 rounded-full object-cover"
          />
          <h1 className="text-2xl font-bold mt-4">
            {decorator.displayName}
          </h1>

          <p className="text-sm text-gray-600 mt-1">{decorator.email}</p>

          <div className="flex items-center gap-2 mt-2">
            <span className="font-semibold">Rating:</span>
            <span className="badge badge-primary">
              {decorator.rating ?? "N/A"}
            </span>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <div>
            <h2 className="font-semibold">Specialties</h2>
            {decorator.specialties?.length > 0 ? (
              <ul className="list-disc ml-6 text-sm text-gray-700">
                {decorator.specialties.map((spec, i) => (
                  <li key={i}>{spec}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">
                No specialties listed.
              </p>
            )}
          </div>

          {/* Add more info if desired */}
        </div>
      </div>
    </div>
  );
}
