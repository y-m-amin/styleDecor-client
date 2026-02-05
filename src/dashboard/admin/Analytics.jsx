import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import axios from '../../api/axios';

const COLORS = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff8042',
  '#8dd1e1',
  '#d0ed57',
];

function AnalyticsSkeleton() {
  return (
    <div className='p-6 space-y-8'>
      <Skeleton height={32} width='40%' />

      <div className='grid md:grid-cols-3 gap-6'>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className='bg-base-300 p-5 rounded shadow'>
            <Skeleton height={14} width='50%' />
            <Skeleton height={32} width='60%' className='mt-3' />
          </div>
        ))}
      </div>

      <div className='grid md:grid-cols-2 gap-8'>
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className='bg-base-300 p-5 rounded shadow'>
            <Skeleton height={20} width='50%' />
            <Skeleton height={260} className='mt-4' />
          </div>
        ))}
      </div>

      <div className='bg-base-300 p-5 rounded shadow'>
        <Skeleton height={20} width='40%' />
        <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className='flex items-center gap-4'>
              <Skeleton circle width={48} height={48} />
              <div className='flex-1'>
                <Skeleton height={14} width='70%' />
                <Skeleton height={12} width='40%' className='mt-1' />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [timeframe, setTimeframe] = useState('month'); // week | month | year

  useEffect(() => {
    const t = setTimeout(() => loading && setShowSkeleton(true), 300);
    return () => clearTimeout(t);
  }, [loading]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const [
        usersRes,
        bookingsRes,
        revenueRes,
        revenueByPeriodRes,
        demandRes,
        topDecoratorsRes,
      ] = await Promise.all([
        axios.get('/admin/users/count'),
        axios.get('/admin/analytics/total-bookings'),
        axios.get('/admin/analytics/revenue', { params: { timeframe } }),
        axios.get('/admin/analytics/revenue-by-period', {
          params: { timeframe },
        }),

        axios.get('/admin/analytics/service-demand', { params: { timeframe } }),
        axios.get('/decorators/top?limit=6'),
      ]);

      setStats({
        totalUsers: usersRes.data.count,
        totalBookings: bookingsRes.data.totalBookings,
        totalRevenue: revenueRes.data.totalRevenue,
        revenueByMonth: revenueByPeriodRes.data,
        serviceDemand: demandRes.data,
        topDecorators: topDecoratorsRes.data.decorators,
      });
    } catch (err) {
      console.error('Error loading analytics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe]);

  if (loading && showSkeleton) return <AnalyticsSkeleton />;
  if (!stats) return null;

  const pieData = stats.serviceDemand.map((item) => ({
    name: item.serviceName,
    value: item.count,
  }));

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1 } }),
  };

  return (
    <motion.div
      className='p-4 md:p-6 space-y-8'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className='text-3xl font-bold'>Admin Analytics</h1>

      {/* Timeframe selector */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4'>
        <h2 className='text-xl font-semibold'>Overview</h2>
        <select
          className='select select-bordered w-full sm:w-auto'
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
        >
          <option value='week'>Last Week</option>
          <option value='month'>Last Month</option>
          <option value='year'>Last Year</option>
        </select>
      </div>

      {/* Summary */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
        {[
          ['Total Users', stats.totalUsers],
          ['Total Bookings', stats.totalBookings],
          ['Total Revenue', stats.totalRevenue.toLocaleString()],
        ].map(([label, value], idx) => (
          <motion.div
            key={label}
            className='bg-base-300 shadow p-5 rounded'
            custom={idx}
            initial='hidden'
            animate='visible'
            variants={cardVariants}
          >
            <p className='text-gray-500'>{label}</p>
            <p className='text-3xl font-bold'>{value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Revenue Line Chart */}
        <motion.div
          className='bg-base-300 p-5 rounded shadow'
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className='flex justify-between items-center mb-3'>
            <h2 className='text-xl font-semibold'>Revenue ({timeframe})</h2>
          </div>

          <ResponsiveContainer
            width='100%'
            height={window.innerWidth < 768 ? 250 : 300}
          >
            <LineChart data={stats.revenueByMonth} key={timeframe}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='label' />
              <YAxis />
              <Tooltip />
              <Line
                type='monotone'
                dataKey='revenue'
                stroke='#8884d8'
                strokeWidth={2}
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Service Demand Pie Chart */}
        <motion.div
          className='bg-base-300 p-5 rounded shadow'
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className='text-xl font-semibold mb-3'>
            Service Demand ({timeframe})
          </h2>
          <ResponsiveContainer
            width='100%'
            height={window.innerWidth < 768 ? 250 : 300}
          >
            <PieChart>
              <Pie
                data={pieData}
                dataKey='value'
                nameKey='name'
                label
                isAnimationActive={true}
                animationDuration={800}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Top Decorators */}
      <motion.div
        className='bg-base-300 p-5 rounded shadow'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className='text-xl font-semibold mb-4'>Top Rated Decorators</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {stats.topDecorators.map((d) => (
            <div
              key={d._id}
              className='border p-4 rounded flex items-center gap-4'
            >
              <img
                src={d.photoURL}
                alt={d.displayName}
                className='w-12 h-12 rounded-full'
              />
              <div>
                <p className='font-semibold'>{d.displayName}</p>
                <p className='text-sm text-gray-500'>
                  Rating: {d.rating ?? 'N/A'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Analytics;
