import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../../api/axios';

function ScheduleSkeleton() {
  return (
    <div className="p-4 mb-3 rounded bg-base-200">
      <Skeleton height={16} width="60%" />
      <Skeleton height={13} width="40%" className="mt-2" />
      <Skeleton height={13} width="70%" className="mt-1" />
    </div>
  );
}

export default function MySchedule() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [filter, setFilter] = useState('upcoming');

  useEffect(() => {
    const t = setTimeout(() => loading && setShowSkeleton(true), 300);
    return () => clearTimeout(t);
  }, [loading]);

  useEffect(() => {
    axios
      .get('/decorator/bookings')
      .then((res) => {
        // remove cancelled jobs at source
        const clean = (res.data.bookings || []).filter(
          (b) => b.status !== 'cancelled'
        );
        setJobs(clean);
      })
      .finally(() => setLoading(false));
  }, []);

  const todayStr = new Date().toDateString();

  const todayJobs = jobs.filter(
    (j) => new Date(j.bookingDate).toDateString() === todayStr
  );

  const filteredJobs = jobs.filter((j) => {
    if (filter === 'completed') return j.status === 'completed';
    if (filter === 'upcoming') return j.status !== 'completed';
    return true;
  });

  return (
    <div className="p-4 sm:p-5">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">
        My Schedule
      </h2>

      {/* TODAY SECTION */}
      {!loading && todayJobs.length > 0 && (
        <>
          <h3 className="font-semibold mb-2 text-blue-600">
            Today
          </h3>
          {todayJobs.map((job) => (
            <ScheduleItem key={`today-${job._id}`} job={job} />
          ))}
        </>
      )}

      {/* FILTER */}
      <div className="flex gap-3 my-4">
        <select
          className="select select-bordered select-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
          <option value="all">All</option>
        </select>
      </div>

      {/* EMPTY STATE */}
      {!loading && filteredJobs.length === 0 && (
        <div className="text-gray-500 py-6">
          No jobs found for this filter
        </div>
      )}

      {/* LIST */}
      <AnimatePresence>
        {showSkeleton &&
          loading &&
          Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={`sk-${i}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ScheduleSkeleton />
            </motion.div>
          ))}

        {!loading &&
          filteredJobs.map((job) => (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <ScheduleItem job={job} />
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
}

function ScheduleItem({ job }) {
  const isCompleted = job.status === 'completed';

  return (
    <div className="p-4 mb-3 rounded bg-base-200 border flex flex-col gap-1">
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-semibold leading-tight">
          {job.serviceSnapshot?.service_name}
        </h4>

        <span
          className={`badge badge-sm ${
            isCompleted ? 'badge-success' : 'badge-outline'
          }`}
        >
          {isCompleted ? 'Completed' : 'Upcoming'}
        </span>
      </div>

      <p className="text-sm text-gray-600">
        {new Date(job.bookingDate).toLocaleString()}
      </p>

      <p className="text-sm text-gray-500">
        {typeof job.location === 'object'
          ? `${job.location.city}, ${job.location.country}`
          : job.location}
      </p>
    </div>
  );
}
