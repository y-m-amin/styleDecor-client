import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logOut, role } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logOut();
    navigate("/");
  };

  useEffect(() => {
  setOpen(false);
}, [user]);


  return (
    <nav className="shadow-md ">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-linear-to-r from-indigo-500 to-pink-400 text-white rounded-md flex items-center justify-center font-bold">
            SD
          </div>
          <span className="font-semibold text-lg">StyleDecor</span>
        </Link>

        {/* Menu */}
        <div className="hidden md:flex gap-6 text-sm">
          <Link to="/">Home</Link>
          <Link to="/services">Services</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/map">Coverage</Link>
        </div>

        {/* Auth */}
        {!user ? (
          <Link
            to="/login"
            className="btn btn-sm bg-indigo-600 text-white px-4"
          >
            Login
          </Link>
        ) : (
          <div className="relative">
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex items-center gap-2"
            >
              <img
                src={user.photoURL || "/default-avatar.png"}
                alt="avatar"
                className="w-9 h-9 rounded-full object-cover border"
              />
              <span className="text-sm">{user.displayName || user.email}</span>
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-44  border rounded shadow z-50">
                <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100">
                  Dashboard
                </Link>

                {role === "admin" && (
                  <Link
                    to="/dashboard/admin/manage-services"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Admin Panel
                  </Link>
                )}

                {role === "decorator" && (
                  <Link
                    to="/dashboard/decorator/projects"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    My Projects
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
