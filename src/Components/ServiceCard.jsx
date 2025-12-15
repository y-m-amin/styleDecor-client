import { Link, useNavigate } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// export default function ServiceCard({ service }) {
//   const navigate = useNavigate();
//   const { user, role } = useContext(AuthContext);

//   const handleBookNow = () => {
//     if (!user) {
//       return navigate("/login", {
//         state: { from: `/services/${service._id}` },
//       });
//     }
//     if (role === "user") {
//       navigate(`/services/${service._id}`);
//     }
//   };

//   return (
//     <div className="bg-base-300 rounded-lg shadow-md shadow-secondary hover:shadow-secondary-content  overflow-hidden">
//       <div className="h-44 bg-gray-100 flex items-center justify-center">
//         <img
//           src={service.image || "/placeholder-service.jpg"}
//           alt={service.service_name}
//           className="object-cover h-44 w-full"
//         />
//       </div>
//       <div className="p-4">
//         <h3 className="font-semibold text-lg">{service.service_name}</h3>
//         <p className="text-sm text-gray-600 mt-1 line-clamp-2">
//           {service.description}
//         </p>

//         <div className="mt-3 flex items-center justify-between">
//           <div>
//             <div className="text-sm text-gray-700 font-medium">
//               BDT {service.cost}
//             </div>
//             <div className="text-xs text-gray-500">{service.unit}</div>
//           </div>

//           <button
//             onClick={handleBookNow}
//             className="text-sm px-3 py-1 border rounded-md hover:bg-gray-50"
//           >
//             {user && role === "user" ? "View & Book" : "View"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
export default function ServiceCard({ service }) {
  const navigate = useNavigate();
  const { user, role } = useContext(AuthContext);

  const handleBookNow = () => {
    if (!user) {
      return navigate("/login", {
        state: { from: `/services/${service._id}` },
      });
    }
    navigate(`/services/${service._id}`);
  };

  return (
    <div className="bg-base-300 rounded-xl shadow hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col">
      <div className="h-48 overflow-hidden">
        <img
          src={service.image || "/placeholder-service.jpg"}
          alt={service.service_name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 flex flex-col grow">
        <h3 className="text-lg font-semibold text-accent">
          {service.service_name}
        </h3>
        <p className="text-sm text-emerald-100 mt-1 line-clamp-2">
          {service.description}
        </p>

        <div className="mt-auto flex items-center justify-between pt-4">
          <div>
            <div className="text-sm font-medium text-gray-300">
              BDT {service.cost}
            </div>
            <div className="text-xs text-gray-500">{service.unit} units</div>
          </div>

          <button
            onClick={handleBookNow}
            className="text-sm px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {user && role === "user" ? "View & Book" : "View"}
          </button>
        </div>
      </div>
    </div>
  );
}

