import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import axios from '../../api/axios';

export default function MySchedule() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming');

  useEffect(() => {
    axios
      .get('/decorator/bookings')
      .then((res) => setJobs(res.data.bookings || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Skeleton count={6} height={70} />;

  const today = new Date().toDateString();

  const todayJobs = jobs.filter(
    (j) => new Date(j.bookingDate).toDateString() === today
  );

  const filtered = jobs.filter((j) => {
    if (filter === 'completed') return j.status === 'completed';
    if (filter === 'upcoming') return j.status !== 'completed';
    return true;
  });

  return (
    <div className='p-5'>
      <h2 className='text-2xl font-bold mb-4'>My Schedule</h2>

      {todayJobs.length > 0 && (
        <>
          <h3 className='font-semibold mb-2 text-blue-600'>Today</h3>
          {todayJobs.map((j) => (
            <ScheduleItem key={j._id} job={j} highlight />
          ))}
        </>
      )}

      <div className='flex gap-3 my-4'>
        <select
          className='select select-bordered select-sm'
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value='upcoming'>Upcoming</option>
          <option value='completed'>Completed</option>
          <option value='all'>All</option>
        </select>
      </div>

      {filtered.map((j) => (
        <ScheduleItem key={j._id} job={j} />
      ))}
    </div>
  );
}

function ScheduleItem({ job, highlight }) {
  return (
    <div
      className={`p-4 mb-3 rounded border ${
        highlight ? 'bg-blue-100 border-blue-400' : 'bg-base-200'
      }`}
    >
      <h4 className='font-semibold'>{job.serviceSnapshot?.service_name}</h4>
      <p className='text-sm text-gray-600'>
        {new Date(job.bookingDate).toLocaleString()}
      </p>
      <p className='text-gray-500'>
        {typeof job.location === 'object'
          ? `${job.location.city}, ${job.location.country}`
          : job.location}
      </p>
    </div>
  );
}
