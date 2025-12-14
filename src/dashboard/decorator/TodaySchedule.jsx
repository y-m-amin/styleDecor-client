import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import axios from "../../api/axios";

const TodaySchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchToday = async () => {
    try {
      const res = await axios.get("/decorator/bookings");
      const allBookings = res.data.bookings || [];

      // Filter for today
      const today = new Date();
      const filtered = allBookings.filter((b) => {
        const d = new Date(b.bookingDate);
        return (
          d.getFullYear() === today.getFullYear() &&
          d.getMonth() === today.getMonth() &&
          d.getDate() === today.getDate()
        );
      });

      setSchedule(filtered);
    } catch (err) {
      console.log("Failed fetching schedule:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToday();
  }, []);

  if (loading) return <Skeleton count={5} height={70} />;

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Today's Schedule</h2>

      <div className="border-l-4 border-blue-500 pl-4 space-y-6">
        {schedule.length === 0 && (
          <p className="text-gray-500">No events scheduled for today.</p>
        )}

        {schedule.map((task) => (
          <div key={task._id} className="relative">
            <div className="absolute -left-2 top-1 w-3 h-3 bg-blue-500 rounded-full"></div>

            <h3 className="font-semibold">
              {task.serviceSnapshot?.service_name}
            </h3>
            <p className="text-sm text-gray-600">
              {/* If you have start/end time, include here */}
              {new Date(task.bookingDate).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p className="text-gray-500">
              {typeof task.location === "object"
                ? `${task.location.city || ""}, ${task.location.country || ""}`
                : task.location || "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodaySchedule;
