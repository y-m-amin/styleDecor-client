import { useEffect, useState } from "react";
import axios from "../../api/axios";

export default function ManageDecorators() {
  const [decorators, setDecorators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchDecorators = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/admin/decorators");
      setDecorators(res.data);
    } catch (err) {
      console.error("Failed to load decorators", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecorators();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`/admin/decorators/${id}/status`, {
        decoratorStatus: newStatus,
      });
      fetchDecorators();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const filtered = decorators.filter((d) =>
    d.displayName?.toLowerCase().includes(search.toLowerCase()) ||
    d.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Decorators</h1>

      <input
        type="text"
        placeholder="Search by name or email..."
        className="input input-bordered w-full mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p>Loading decorators...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Name</th>
                <th>Email</th>
                <th>Specialties</th>
                <th>Status</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d._id}>
                  <td>
                    <img
                      src={d.photoURL}
                      alt="avatar"
                      className="w-10 h-10 rounded-full"
                    />
                  </td>
                  <td>{d.displayName || "N/A"}</td>
                  <td>{d.email}</td>
                  <td>{d.specialties?.join(", ") || "—"}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        d.decoratorStatus === "active"
                          ? "bg-green-200 text-green-800"
                          : d.decoratorStatus === "disabled"
                          ? "bg-red-200 text-red-800"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {d.decoratorStatus}
                    </span>
                  </td>
                  <td>{d.rating?.toFixed(1) || "0.0"}</td>
                  <td className="space-x-2">
                    {d.decoratorStatus !== "active" && (
                      <button
                        className="btn btn-sm btn-success text-white"
                        onClick={() => handleStatusChange(d._id, "active")}
                      >
                        Activate
                      </button>
                    )}
                    {d.decoratorStatus === "active" && (
                      <button
                        className="btn btn-sm btn-warning text-white"
                        onClick={() => handleStatusChange(d._id, "disabled")}
                      >
                        Disable
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
