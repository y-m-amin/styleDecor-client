import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import logoImg from '../assets/styledecor.png';
import { AuthContext } from '../context/AuthContext';

import { useLocation } from 'react-router';

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
  { name: 'Coverage', path: '/map' },
];

export default function Navbar() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  const { user, logOut, role, loading } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const avatarBase = user?.photoURL || '/default-avatar.png';
  const avatarVersion = user?.updatedAt
    ? new Date(user.updatedAt).getTime()
    : '0';

  const avatarSrc = avatarBase.includes('?')
    ? `${avatarBase}&v=${avatarVersion}`
    : `${avatarBase}?v=${avatarVersion}`;

  const handleLogout = async () => {
    await logOut();
    navigate('/');
  };

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
        <Link to='/' className='btn btn-ghost px-2'>
          <div className='flex items-center gap-2'>
            <img
              src={logoImg}
              alt='StyleDecor logo'
              className='w-10 h-10 object-contain'
            />
            <span className='text-xl font-extrabold tracking-tight'>
              Style<span className='text-primary'>Decor</span>
            </span>
          </div>
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
          <Link
            to={isLoginPage ? '/register' : '/login'}
            className='btn btn-sm btn-primary'
          >
            {isLoginPage ? 'Register' : 'Login'}
          </Link>
        ) : (
          <div className='dropdown dropdown-end'>
            <label
              tabIndex={0}
              className='flex items-center gap-2 cursor-pointer'
            >
              <img
                key={avatarSrc}
                src={avatarSrc}
                onError={(e) => {
                  e.currentTarget.src = '/default-avatar.png';
                }}
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
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
