import { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import Spinner from "../../Components/Spinner";

export default function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, role } = useContext(AuthContext);

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  const [bookingDate, setBookingDate] = useState("");
  const [serviceMode, setServiceMode] = useState("offline");
  const [location, setLocation] = useState("");


   const fetchService = async () => {
      try {
        const res = await axios.get(`/services/${id}`);
        setService(res.data);
      } catch (err) {
        toast.error("Failed to load service");
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
   

    fetchService();
  }, [id]);

  const handleBook = async () => {
    if (!user) return navigate("/login", { state: { from: `/services/${id}` } });
    if (role !== "user") return toast.error("Only customers can book services");
    if (!bookingDate) return toast.error("Please choose a booking date");

    try {
      await axios.post("/bookings", {
        serviceId: id,
        bookingDate,
        serviceMode,
        location,
      });
      toast.success("Booking created! Check your My Bookings");
      navigate("/dashboard/my-bookings");
    } catch (err) {
      toast.error("Failed to book service");
    }
  };

  if (loading) return <Spinner />;
  if (!service) return <p className="text-center text-gray-500">Service not found</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="bg-base-300 shadow-md rounded-lg overflow-hidden">
        <img
          src={service.image || "/placeholder-service.jpg"}
          alt={service.service_name}
          className="w-full h-64 object-cover"
        />
        <div className="p-6 space-y-4">
          <h1 className="text-2xl font-bold text-gray-800">{service.service_name}</h1>
          <div className="flex items-center gap-4">
            <span className="text-lg text-blue-600 font-semibold">BDT {service.cost}</span>
            <span className="text-sm text-gray-500 uppercase">{service.unit} units</span>
          </div>
          <p className="text-gray-600 leading-relaxed">{service.description}</p>
        </div>
      </div>

      {/* Booking Form */}
      {role === "user" ? (
        <div className="bg-base-300 shadow-inner rounded-lg p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-700">Book This Service</h2>

          <div>
            <label className="block text-sm font-medium mb-1">Booking Date</label>
            <input
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Service Mode</label>
            <select
              value={serviceMode}
              onChange={(e) => setServiceMode(e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="offline">Offline</option>
              <option value="online">Online</option>
            </select>
          </div>

          {serviceMode === "offline" && (
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>
          )}

          <button
            onClick={handleBook}
            className="btn btn-primary w-full"
          >
            Book Now
          </button>
        </div>
      ) : user ? (
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded">
          <p>Only customers can book services.</p>
        </div>
      ) : (
        <div className="bg-blue-100 text-blue-700 p-4 rounded">
          <p>
            Please{" "}
            <Link to="/login" className="underline font-medium text-blue-900">
              login
            </Link>{" "}
            to book this service.
          </p>
        </div>
      )}
    </div>
  );
}
