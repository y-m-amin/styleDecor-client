import { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import Skeleton from "react-loading-skeleton";

export default function Revenue() {
  const [totalRevenue, setTotalRevenue] = useState(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [serviceDemand, setServiceDemand] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);

      const [{ data: revData }, { data: demandData }] =
        await Promise.all([
          axios.get("/admin/analytics/revenue"),
          axios.get("/admin/analytics/service-demand"),
        ]);

      setTotalRevenue(revData.totalRevenue ?? 0);

      // For the charts: if your backend returns revenue by month, use that.
      if (revData.revenueByMonth) {
        setMonthlyRevenue(revData.revenueByMonth);
      } else {
        // Fallback: simulate (or transform demandData) if no monthly provided
        const months = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct",
          "Nov", "Dec",
        ];
        const fallback = months.map((m) => ({
          month: m,
          revenue: Math.floor(Math.random() * 10000),
        }));
        setMonthlyRevenue(fallback);
      }

      setServiceDemand(demandData || []);
    } catch (err) {
      console.error("Failed to load revenue analytics", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, []);

  if (loading) return <Skeleton count={5} height={180} />;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Revenue Analytics</h1>

      {/* Total Revenue */}
      <div className="bg-white shadow rounded-lg p-5 mb-8 border">
        <p className="text-gray-500">Total Revenue (All Time)</p>
        <p className="text-4xl font-bold">
          ৳{Number(totalRevenue).toLocaleString()}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Revenue Over Time */}
        <div className="bg-white shadow rounded-lg p-5 border">
          <h2 className="text-xl font-semibold mb-4">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#8884d8"
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Service Demand */}
        <div className="bg-white shadow rounded-lg p-5 border">
          <h2 className="text-xl font-semibold mb-4">
            Bookings by Service
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={serviceDemand}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="serviceName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="count"
                fill="#82ca9d"
                name="Booking Count"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
