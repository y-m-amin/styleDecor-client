import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Skeleton from 'react-loading-skeleton';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get('/admin/analytics');
      setData(res.data);
    } catch (err) {
      console.error('Error loading analytics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading || !data) return <Skeleton count={8} height={80} className='mb-4' />;

  return (
    <div className='p-6'>
      <h1 className='text-3xl font-bold mb-6'>Admin Dashboard</h1>

      {/* Stats */}
      <div className='grid md:grid-cols-3 gap-6 mb-10'>
        <div className='bg-white shadow p-5 rounded border'>
          <p className='text-gray-500'>Total Users</p>
          <p className='text-3xl font-bold'>{data.totalUsers}</p>
        </div>

        <div className='bg-white shadow p-5 rounded border'>
          <p className='text-gray-500'>Total Bookings</p>
          <p className='text-3xl font-bold'>{data.totalBookings}</p>
        </div>

        <div className='bg-white shadow p-5 rounded border'>
          <p className='text-gray-500'>Total Revenue</p>
          <p className='text-3xl font-bold'>${data.totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Graphs */}
      <div className='grid md:grid-cols-2 gap-8'>
        {/* Top Services Pie Chart */}
        <div className='bg-white shadow p-5 rounded border'>
          <h2 className='text-xl font-semibold mb-4'>Top Booked Services</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.topServices}
                dataKey="bookings"
                nameKey="name"
                outerRadius={100}
                label
              >
                {data.topServices.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Revenue Line Chart */}
        <div className='bg-white shadow p-5 rounded border'>
          <h2 className='text-xl font-semibold mb-4'>Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
