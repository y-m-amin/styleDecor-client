import { useEffect, useState } from "react";
import axios from "../../api/axios";
import Skeleton from "react-loading-skeleton";
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
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#d0ed57"];

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [
        totalUsersRes,
        totalBookingsRes,
        totalRevenueRes,
        revenueByMonthRes,
        demandRes,
        topDecoratorsRes,
      ] = await Promise.all([
        axios.get("/admin/users/count"), 
        axios.get("/admin/analytics/total-bookings"),
        axios.get("/admin/analytics/revenue"),
        axios.get("/admin/analytics/revenue-by-month"),
        axios.get("/admin/analytics/service-demand"),
        axios.get("/decorators/top?limit=6"),
      ]);

      setStats({
        totalUsers: totalUsersRes.data.count,
        totalBookings: totalBookingsRes.data.totalBookings,
        totalRevenue: totalRevenueRes.data.totalRevenue,
        revenueByMonth: revenueByMonthRes.data,
        serviceDemand: demandRes.data,
        topDecorators: topDecoratorsRes.data.decorators,
      });
    } catch (err) {
      console.error("Error loading analytics", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading || !stats)
    return <Skeleton count={6} height={100} className="mb-4" />;

  const pieData = stats.serviceDemand.map((item) => ({
    name: item.serviceName,
    value: item.count,
  }));

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Admin Analytics</h1>

      {/* Summary Tiles */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gray-300 shadow p-5 rounded">
          <p className="text-gray-500">Total Users</p>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </div>

        <div className="bg-gray-300 shadow p-5 rounded">
          <p className="text-gray-500">Total Bookings</p>
          <p className="text-3xl font-bold">{stats.totalBookings}</p>
        </div>

        <div className="bg-gray-300 shadow p-5 rounded">
          <p className="text-gray-500">Total Revenue</p>
          <p className="text-3xl font-bold">
            {stats.totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Revenue by Month */}
        <div className="bg-gray-300 p-5 rounded shadow">
          <h2 className="text-xl font-semibold mb-3">Revenue by Month</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Service Demand Pie */}
        <div className="bg-gray-300 p-5 rounded shadow">
          <h2 className="text-xl font-semibold mb-3">Service Demand</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Decorators */}
      <div className="bg-gray-300 p-5 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Top Rated Decorators</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.topDecorators.map((decorator) => (
            <div
              key={decorator._id}
              className="border p-4 rounded flex items-center gap-4"
            >
              <img
                src={decorator.photoURL}
                alt={decorator.displayName}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-semibold">{decorator.displayName}</p>
                <p className="text-sm text-gray-500">
                  Rating: {decorator.rating || "N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
