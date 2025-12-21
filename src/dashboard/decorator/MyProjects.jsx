import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../../api/axios';

const STATUS_FLOW = [
  'assigned',
  'planning_phase',
  'materials_prepared',
  'on_the_way',
  'setup_in_progress',
  'completed',
];

const skeletonVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const cardVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

function ProjectSkeletonCard() {
  return (
    <div className="bg-base-200 p-4 rounded-lg shadow">
      <Skeleton height={20} width="70%" />
      <Skeleton height={14} width="40%" className="mt-2" />
      <div className="mt-3 space-y-2">
        <Skeleton height={14} width="60%" />
        <Skeleton height={14} width="80%" />
      </div>
      <Skeleton height={36} className="mt-4 rounded-md" />
    </div>
  );
}

export default function MyProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [savingId, setSavingId] = useState(null);

  // Prevent skeleton flash
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) setShowSkeleton(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [loading]);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('/decorator/bookings');
      setProjects(res.data.bookings || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const updateStatus = async (id, status) => {
    setSavingId(id);
    try {
      await axios.patch(`/decorator/bookings/${id}/status`, { status });
      setProjects((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status } : p))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="p-4 sm:p-5">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">
        My Assigned Projects
      </h2>

      {/* EMPTY STATE */}
      {!loading && projects.length === 0 && (
        <div className="text-center text-gray-500 py-10">
          No project assigned yet
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {showSkeleton &&
            loading &&
            Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={`skeleton-${i}`}
                variants={skeletonVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <ProjectSkeletonCard />
              </motion.div>
            ))}
        </AnimatePresence>

        <AnimatePresence>
          {!loading &&
            projects.map((p) => (
              <motion.div
                key={p._id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="bg-base-200 p-4 rounded-lg shadow flex flex-col"
              >
                <h3 className="text-lg font-semibold leading-tight">
                  {p.serviceSnapshot?.service_name || p.service?.name}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  #{p.bookingRef}
                </p>

                <p className="mt-3 text-sm">
                  <b>Date:</b>{' '}
                  {new Date(p.bookingDate).toLocaleDateString()}
                </p>

                <p className="text-sm text-gray-600">
                  {typeof p.location === 'object'
                    ? `${p.location.city}, ${p.location.country}`
                    : p.location}
                </p>

                {/* STATUS SECTION */}
                {p.status === 'cancelled' ? (
                  <div className="mt-auto text-sm text-red-500 font-medium">
                    User cancelled this booking
                  </div>
                ) : (
                  <select
                    className="select select-sm select-bordered mt-auto w-full"
                    value={p.status}
                    disabled={
                      savingId === p._id || p.status === 'completed'
                    }
                    onChange={(e) =>
                      updateStatus(p._id, e.target.value)
                    }
                  >
                    {STATUS_FLOW.map((s) => (
                      <option key={s} value={s}>
                        {s.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                )}
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
