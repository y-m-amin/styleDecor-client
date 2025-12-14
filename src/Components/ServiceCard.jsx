import { Link, useNavigate } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ServiceCard({ service }) {
  const navigate = useNavigate();
  const { user, role } = useContext(AuthContext);

  const handleBookNow = () => {
    if (!user) {
      return navigate("/login", {
        state: { from: `/services/${service._id}` },
      });
    }
    if (role === "user") {
      navigate(`/services/${service._id}`);
    }
  };

  return (
    <div className="bg-base-300 rounded-lg shadow-md shadow-secondary hover:shadow-secondary-content  overflow-hidden">
      <div className="h-44 bg-gray-100 flex items-center justify-center">
        <img
          src={service.image || "/placeholder-service.jpg"}
          alt={service.service_name}
          className="object-cover h-44 w-full"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg">{service.service_name}</h3>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {service.description}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-700 font-medium">
              BDT {service.cost}
            </div>
            <div className="text-xs text-gray-500">{service.unit}</div>
          </div>

          <button
            onClick={handleBookNow}
            className="text-sm px-3 py-1 border rounded-md hover:bg-gray-50"
          >
            {user && role === "user" ? "View & Book" : "View"}
          </button>
        </div>
      </div>
    </div>
  );
}
