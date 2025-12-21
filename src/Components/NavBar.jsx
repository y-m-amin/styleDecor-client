import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthContext } from '../context/AuthContext';

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
  { name: 'Coverage', path: '/map' },
];

export default function Navbar() {
  const { user, logOut, role, loading } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logOut();
    navigate('/');
  };

  // ✅ prevents cascading renders
  useEffect(() => {
    if (open) setOpen(false);
  }, [user]);

  return (
    <div className='navbar bg-base-100 shadow-sm px-4'>
      {/* START */}
      <div className='navbar-start'>
        {/* Mobile menu */}
        <div className='dropdown'>
          <label tabIndex={0} className='btn btn-ghost lg:hidden'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M4 6h16M4 12h8m-8 6h16'
              />
            </svg>
          </label>

          <ul
            tabIndex={0}
            className='menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow z-50'
          >
            {NAV_LINKS.map((link) => (
              <li key={link.path}>
                <Link to={link.path}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Brand */}
        <Link to='/' className='btn btn-ghost text-xl'>
          StyleDecor
        </Link>
      </div>

      {/* CENTER (Desktop only) */}
      <div className='navbar-center hidden lg:flex'>
        <ul className='menu menu-horizontal px-1 gap-1'>
          {NAV_LINKS.map((link) => (
            <li key={link.path}>
              <Link to={link.path}>{link.name}</Link>
            </li>
          ))}
        </ul>
      </div>

      {/* END */}
      <div className='navbar-end'>
        {loading ? (
          <div className='w-24 h-9' />
        ) : !user ? (
          <Link to='/login' className='btn btn-sm bg-indigo-600 text-white'>
            Login
          </Link>
        ) : (
          <div className='dropdown dropdown-end'>
            <label
              tabIndex={0}
              className='flex items-center gap-2 cursor-pointer'
            >
              <img
                src={user.photoURL || '/default-avatar.png'}
                className='w-9 h-9 rounded-full border object-cover'
              />
              <span className='text-sm hidden md:block'>
                {user.displayName || user.email}
              </span>
            </label>

            <ul className='menu dropdown-content bg-base-100 rounded-box w-44 mt-3 shadow z-50'>
              {role === 'user' && (
                <li>
                  <Link to='/dashboard/my-bookings'>Dashboard</Link>
                </li>
              )}

              {role === 'admin' && (
                <li>
                  <Link to='/dashboard/admin/analytics'>Admin Panel</Link>
                </li>
              )}

              {role === 'decorator' && (
                <li>
                  <Link to='/dashboard/decorator/projects'>My Projects</Link>
                </li>
              )}

              <li>
                <button onClick={logOut}>Logout</button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
