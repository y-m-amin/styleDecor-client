import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import axios from '../../api/axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function ProfileSkeleton() {
  return (
    <div className="container mx-auto px-6 py-8 max-w-3xl">
      <div className="bg-base-300 shadow p-6 rounded-lg">
        <div className="flex flex-col items-center">
          <Skeleton circle width={128} height={128} />
          <Skeleton width={180} height={24} className="mt-4" />
          <Skeleton width={220} height={14} className="mt-2" />
          <Skeleton width={100} height={24} className="mt-3" />
        </div>

        <div className="mt-6 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height={14} />
          ))}
        </div>

        <div className="mt-6">
          <Skeleton width={160} height={18} />
          <div className="space-y-2 mt-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} height={14} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DecoratorProfilePub() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [decorator, setDecorator] = useState(null);
  const [completedJobs, setCompletedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const fetchData = async () => {
      try {
        const [decoratorRes, completedRes] = await Promise.all([
  axios.get(`/decorators/${id}`),
  axios.get(`/decorators/${id}/completed-bookings`),
]);

setDecorator(decoratorRes.data);
setCompletedJobs(completedRes.data);


        
      } catch (err) {
        console.error('Failed to load decorator profile', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <ProfileSkeleton />;

  if (!decorator) {
    return (
      <div className="p-6 text-center text-gray-600">
        Decorator not found.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-3xl">
      <button
        className="btn btn-ghost mb-6"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="bg-base-300 shadow p-6 rounded-lg">
        {/* HEADER */}
        <div className="flex flex-col items-center text-center">
          <img
            src={decorator.photoURL}
            alt={decorator.displayName}
            className="w-32 h-32 rounded-full object-cover"
          />

          <h1 className="text-2xl font-bold mt-4">
            {decorator.displayName}
          </h1>

          <p className="text-sm text-gray-600">{decorator.email}</p>

          <div className="flex items-center gap-2 mt-2">
            <span className="badge badge-primary">
              ⭐ {decorator.rating ?? 'N/A'}
            </span>
            <span className="text-sm text-gray-500">
              ({decorator.ratingCount || 0} reviews)
            </span>
          </div>
        </div>

        {/* INFO */}
        <div className="mt-6 grid sm:grid-cols-2 gap-4 text-sm">
          <p>
            <span className="font-semibold">Phone:</span>{' '}
            {decorator.phone || '—'}
          </p>
          <p>
            <span className="font-semibold">Address:</span>{' '}
            {decorator.address || '—'}
          </p>
          <p>
            <span className="font-semibold">Completed Projects:</span>{' '}
            {completedJobs.length}
          </p>
        </div>

        {/* SPECIALTIES */}
        <div className="mt-6">
          <h2 className="font-semibold mb-2">Specialties</h2>
          {decorator.specialties?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {decorator.specialties.map((spec, i) => (
                <span key={i} className="badge badge-outline">
                  {spec}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              No specialties listed.
            </p>
          )}
        </div>

        {/* COMPLETED PROJECTS */}
        <div className="mt-8">
          <h2 className="font-semibold mb-3">
            Recent Completed Projects
          </h2>

          {completedJobs.length === 0 ? (
            <p className="text-sm text-gray-500">
              No completed projects yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {completedJobs.slice(0, 5).map((job) => (
                <li
                  key={job._id}
                  className="p-3 bg-base-100 rounded border text-sm"
                >
                  <p className="font-medium">
                    {job.serviceSnapshot?.service_name}
                  </p>
                  <p className="text-gray-500">
                    {new Date(job.bookingDate).toLocaleDateString()} •{' '}
                    {job.location}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
