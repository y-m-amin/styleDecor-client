import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

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
    <div className="p-6 space-y-8">
      <Skeleton height={32} width="40%" />

      <div className="grid md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-base-300 p-5 rounded shadow">
            <Skeleton height={14} width="50%" />
            <Skeleton height={32} width="60%" className="mt-3" />
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-base-300 p-5 rounded shadow">
            <Skeleton height={20} width="50%" />
            <Skeleton height={260} className="mt-4" />
          </div>
        ))}
      </div>

      <div className="bg-base-300 p-5 rounded shadow">
        <Skeleton height={20} width="40%" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton circle width={48} height={48} />
              <div className="flex-1">
                <Skeleton height={14} width="70%" />
                <Skeleton height={12} width="40%" className="mt-1" />
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

  useEffect(() => {
    const t = setTimeout(() => loading && setShowSkeleton(true), 300);
    return () => clearTimeout(t);
  }, [loading]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [
          usersRes,
          bookingsRes,
          revenueRes,
          revenueByMonthRes,
          demandRes,
          topDecoratorsRes,
        ] = await Promise.all([
          axios.get('/admin/users/count'),
          axios.get('/admin/analytics/total-bookings'),
          axios.get('/admin/analytics/revenue'),
          axios.get('/admin/analytics/revenue-by-month'),
          axios.get('/admin/analytics/service-demand'),
          axios.get('/decorators/top?limit=6'),
        ]);

        setStats({
          totalUsers: usersRes.data.count,
          totalBookings: bookingsRes.data.totalBookings,
          totalRevenue: revenueRes.data.totalRevenue,
          revenueByMonth: revenueByMonthRes.data,
          serviceDemand: demandRes.data,
          topDecorators: topDecoratorsRes.data.decorators,
        });
      } catch (err) {
        console.error('Error loading analytics', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading && showSkeleton) return <AnalyticsSkeleton />;
  if (!stats) return null;

  const pieData = stats.serviceDemand.map((item) => ({
    name: item.serviceName,
    value: item.count,
  }));

  return (
    <motion.div
      className="p-6 space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-bold">Admin Analytics</h1>

      {/* Summary */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          ['Total Users', stats.totalUsers],
          ['Total Bookings', stats.totalBookings],
          ['Total Revenue', stats.totalRevenue.toLocaleString()],
        ].map(([label, value]) => (
          <div key={label} className="bg-base-300 shadow p-5 rounded">
            <p className="text-gray-500">{label}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-base-300 p-5 rounded shadow">
          <h2 className="text-xl font-semibold mb-3">
            Revenue (Last 6 Months)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Line dataKey="revenue" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-base-300 p-5 rounded shadow">
          <h2 className="text-xl font-semibold mb-3">
            Service Demand (Bookings)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" label>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Decorators */}
      <div className="bg-base-300 p-5 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">
          Top Rated Decorators
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.topDecorators.map((d) => (
            <div
              key={d._id}
              className="border p-4 rounded flex items-center gap-4"
            >
              <img
                src={d.photoURL}
                alt={d.displayName}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-semibold">{d.displayName}</p>
                <p className="text-sm text-gray-500">
                  Rating: {d.rating ?? 'N/A'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Analytics;
