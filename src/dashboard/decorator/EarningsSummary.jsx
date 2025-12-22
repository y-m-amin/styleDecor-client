import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import axios from '../../api/axios';

export default function EarningsSummary() {
  const [summary, setSummary] = useState(null);
  const [earnings, setEarnings] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingList, setLoadingList] = useState(true);

  const [filters, setFilters] = useState({
    from: '',
    to: '',
  });

  /* ---------------- FETCH SUMMARY ---------------- */
  useEffect(() => {
    axios
      .get('/decorator/earnings/summary')
      .then((res) => setSummary(res.data))
      .finally(() => setLoadingSummary(false));
  }, []);

  /* ---------------- FETCH LIST ---------------- */
  const fetchEarnings = () => {
    setLoadingList(true);
    axios
      .get('/decorator/earnings', { params: filters })
      .then((res) => setEarnings(res.data.earnings || []))
      .finally(() => setLoadingList(false));
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  const clearFilters = () => {
    setFilters({ from: '', to: '' });
    fetchEarnings();
  };

  return (
    <div className='p-4 sm:p-5'>
      <h2 className='text-xl sm:text-2xl font-bold mb-4'>Earnings Summary</h2>

      {/* SUMMARY CARDS */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6'>
        <SummaryCard
          title='Total Earnings'
          value={summary?.totalEarnings}
          loading={loadingSummary}
        />
        <SummaryCard
          title='This Month'
          value={summary?.thisMonth}
          loading={loadingSummary}
        />
        <SummaryCard
          title='Today'
          value={summary?.today}
          loading={loadingSummary}
        />
      </div>

      {/* FILTER BAR */}
      <div className='bg-base-200 rounded-lg p-3 mb-4 shadow-sm'>
        <div className='flex flex-col sm:flex-row gap-3'>
          <input
            type='date'
            className='input input-sm input-bordered'
            value={filters.from}
            onChange={(e) =>
              setFilters((f) => ({ ...f, from: e.target.value }))
            }
          />
          <input
            type='date'
            className='input input-sm input-bordered'
            value={filters.to}
            onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))}
          />
          <button className='btn btn-sm btn-primary' onClick={fetchEarnings}>
            Apply
          </button>
          <button className='btn btn-sm btn-outline' onClick={clearFilters}>
            Clear
          </button>
        </div>
      </div>

      {/* EMPTY STATE */}
      {!loadingList && earnings.length === 0 && (
        <div className='text-gray-500 text-center py-8'>
          No earnings found for this period
        </div>
      )}

      {/* EARNINGS LIST */}
      <div className='space-y-3'>
        <AnimatePresence>
          {loadingList &&
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} height={60} />
            ))}

          {!loadingList &&
            earnings.map((e) => (
              <motion.div
                key={e._id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className='bg-base-200 rounded-lg p-4 shadow flex justify-between items-center'
              >
                <div>
                  <p className='font-semibold'>{e.service}</p>
                  <p className='text-sm text-gray-500'>
                    #{e.bookingRef} • {new Date(e.paidAt).toLocaleDateString()}
                  </p>
                </div>

                <div className='font-bold text-green-600'>
                  ৳{e.amount.toLocaleString()}
                </div>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------------- REUSABLE CARD ---------------- */

function SummaryCard({ title, value, loading }) {
  return (
    <div className='bg-base-200 p-4 rounded-lg shadow'>
      <p className='text-sm text-gray-500'>{title}</p>
      <p className='text-2xl font-bold mt-1'>
        {loading ? (
          <Skeleton width={80} />
        ) : (
          `৳${(value || 0).toLocaleString()}`
        )}
      </p>
    </div>
  );
}
