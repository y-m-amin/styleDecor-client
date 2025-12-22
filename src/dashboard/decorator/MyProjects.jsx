import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
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
    <div className='bg-base-200 p-4 rounded-lg shadow'>
      <Skeleton height={20} width='70%' />
      <Skeleton height={14} width='40%' className='mt-2' />
      <div className='mt-3 space-y-2'>
        <Skeleton height={14} width='60%' />
        <Skeleton height={14} width='80%' />
      </div>
      <Skeleton height={36} className='mt-4 rounded-md' />
    </div>
  );
}

const normalizeText = (v) =>
  String(v || '')
    .toLowerCase()
    .trim();

const getLocationText = (loc) => {
  if (!loc) return '';
  if (typeof loc === 'string') return loc;
  if (typeof loc === 'object') {
    const parts = [
      loc.address,
      loc.area,
      loc.city,
      loc.state,
      loc.country,
    ].filter(Boolean);
    return parts.join(', ');
  }
  return '';
};

const dateOnly = (d) => {
  if (!d) return null;
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return null;
  // normalize to date-only
  return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
};

export default function MyProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [savingId, setSavingId] = useState(null);

  // filters (client-side)
  const [filters, setFilters] = useState({
    status: 'active', // active | all | specific:<status>
    q: '',
    fromDate: '', // yyyy-mm-dd
    toDate: '', // yyyy-mm-dd
    dateOrder: 'new', // new | old
  });

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

  const filteredProjects = useMemo(() => {
    const q = normalizeText(filters.q);
    const from = filters.fromDate ? dateOnly(filters.fromDate) : null;
    const to = filters.toDate ? dateOnly(filters.toDate) : null;

    const statusMode = filters.status; // active | all | specific:<status>
    const specificStatus = statusMode?.startsWith('specific:')
      ? statusMode.split(':')[1]
      : '';

    const HIDDEN_BY_DEFAULT = new Set(['completed', 'cancelled']);

    return (projects || [])
      .filter((p) => {
        // status filter
        if (statusMode === 'active') {
          // active means: everything except completed/cancelled
          if (HIDDEN_BY_DEFAULT.has(p.status)) return false;
        } else if (statusMode === 'all') {
          // no filter
        } else if (specificStatus) {
          if (p.status !== specificStatus) return false;
        }

        // search filter
        if (q) {
          const serviceName = normalizeText(
            p.serviceSnapshot?.service_name || p.service?.name
          );
          const ref = normalizeText(p.bookingRef);
          const loc = normalizeText(getLocationText(p.location));
          const hay = `${serviceName} ${ref} ${loc}`;
          if (!hay.includes(q)) return false;
        }

        // date range filter (bookingDate)
        const bd = dateOnly(p.bookingDate);
        if (from && bd && bd < from) return false;
        if (to && bd && bd > to) return false;

        // if bookingDate missing/invalid and date filters are active: exclude
        if ((from || to) && !bd) return false;

        return true;
      })
      .sort((a, b) => {
        const da = new Date(a.bookingDate).getTime();
        const db = new Date(b.bookingDate).getTime();
        if (filters.dateOrder === 'old') return da - db;
        return db - da;
      });
  }, [projects, filters]);

  const clearFilters = () => {
    setFilters({
      status: 'active',
      q: '',
      fromDate: '',
      toDate: '',
      dateOrder: 'new',
    });
  };

  const statusSelectValue = filters.status;

  return (
    <div className='p-4 sm:p-5'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4'>
        <h2 className='text-xl sm:text-2xl font-bold'>My Assigned Projects</h2>

        <button
          className='btn btn-sm btn-outline'
          onClick={clearFilters}
          type='button'
        >
          Clear Filters
        </button>
      </div>

      {/* FILTER BAR */}
      <div className='bg-base-200 rounded-lg p-3 mb-4 shadow-sm'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3'>
          {/* Status */}
          <select
            className='select select-sm select-bordered w-full'
            value={statusSelectValue}
            onChange={(e) =>
              setFilters((f) => ({ ...f, status: e.target.value }))
            }
          >
            <option value='active'>Active Only </option>
            <option value='all'>All</option>

            <option disabled>────────</option>
            {STATUS_FLOW.map((s) => (
              <option key={s} value={`specific:${s}`}>
                {s.replace(/_/g, ' ')}
              </option>
            ))}
            <option value='specific:cancelled'>cancelled</option>
          </select>

          {/* Search */}
          <input
            className='input input-sm input-bordered w-full'
            placeholder='Search service / ref / location…'
            value={filters.q}
            onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
          />

          {/* From date */}
          <input
            type='date'
            className='input input-sm input-bordered w-full'
            value={filters.fromDate}
            onChange={(e) =>
              setFilters((f) => ({ ...f, fromDate: e.target.value }))
            }
          />

          {/* To date */}
          <input
            type='date'
            className='input input-sm input-bordered w-full'
            value={filters.toDate}
            onChange={(e) =>
              setFilters((f) => ({ ...f, toDate: e.target.value }))
            }
          />

          {/* Date order + toggle */}
          <div className='flex gap-2'>
            <select
              className='select select-sm select-bordered w-full'
              value={filters.dateOrder}
              onChange={(e) =>
                setFilters((f) => ({ ...f, dateOrder: e.target.value }))
              }
            >
              <option value='new'>Newest</option>
              <option value='old'>Oldest</option>
            </select>
          </div>
        </div>

        <div className='text-xs opacity-70 mt-2'>
          Showing <b>{filteredProjects.length}</b> of <b>{projects.length}</b>{' '}
          projects
        </div>
      </div>

      {/* EMPTY STATE */}
      {!loading && projects.length === 0 && (
        <div className='text-center text-gray-500 py-10'>
          No project assigned yet
        </div>
      )}

      {!loading && projects.length > 0 && filteredProjects.length === 0 && (
        <div className='text-center text-gray-500 py-10'>
          No projects match your filters
        </div>
      )}

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        <AnimatePresence>
          {showSkeleton &&
            loading &&
            Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={`skeleton-${i}`}
                variants={skeletonVariants}
                initial='hidden'
                animate='visible'
                exit='exit'
              >
                <ProjectSkeletonCard />
              </motion.div>
            ))}
        </AnimatePresence>

        <AnimatePresence>
          {!loading &&
            filteredProjects.map((p) => (
              <motion.div
                key={p._id}
                variants={cardVariants}
                initial='hidden'
                animate='visible'
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className='bg-base-200 p-4 rounded-lg shadow flex flex-col'
              >
                <h3 className='text-lg font-semibold leading-tight'>
                  {p.serviceSnapshot?.service_name || p.service?.name}
                </h3>

                <p className='text-sm text-gray-500 mt-1'>#{p.bookingRef}</p>

                <p className='mt-3 text-sm'>
                  <b>Date:</b> {new Date(p.bookingDate).toLocaleDateString()}
                </p>

                <p className='text-sm text-gray-600'>
                  {typeof p.location === 'object'
                    ? getLocationText(p.location)
                    : p.location}
                </p>

                {/* STATUS SECTION */}
                {p.status === 'cancelled' ? (
                  <div className='mt-auto text-sm text-red-500 font-medium'>
                    User cancelled this booking
                  </div>
                ) : (
                  <select
                    className='select select-sm select-bordered mt-auto w-full'
                    value={p.status}
                    disabled={savingId === p._id || p.status === 'completed'}
                    onChange={(e) => updateStatus(p._id, e.target.value)}
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
