import { useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logOut, loading, role } = useContext(AuthContext) || {};
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <nav className=' shadow-md'>
      <div className='container mx-auto px-4 py-3 flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Link to='/' className='flex items-center gap-2'>
            <div className='w-10 h-10 rounded-md bg-linear-to-r from-pink-500 to-yellow-400 flex items-center justify-center text-white font-bold'>
              SD
            </div>
            <span className='font-semibold text-lg'>StyleDecor</span>
          </Link>

          <div className='hidden md:flex items-center gap-4 ml-6 text-sm'>
            <Link to='/' className='hover:text-indigo-600'>
              Home
            </Link>
            <Link to='/services' className='hover:text-indigo-600'>
              Services
            </Link>
            <Link to='/about' className='hover:text-indigo-600'>
              About
            </Link>
            <Link to='/contact' className='hover:text-indigo-600'>
              Contact
            </Link>
            <Link to='/map' className='hover:text-indigo-600'>
              Coverage
            </Link>
          </div>
        </div>

        <div className='flex items-center gap-3'>
          {!loading && !user && (
            <Link
              to='/login'
              className='px-4 py-2 border rounded-md text-sm bg-indigo-600 text-white'
            >
              Login
            </Link>
          )}

          {!loading && user && (
            <div className='flex items-center gap-3'>
              <Link
                to='/dashboard'
                className='px-3 py-2 text-sm border rounded-md hover:bg-gray-100'
              >
                Dashboard
              </Link>

              <div className='relative'>
                <button className='flex items-center gap-2'>
                  <img
                    src={user.photoURL || '/default-avatar.png'}
                    alt='avatar'
                    className='w-9 h-9 rounded-full object-cover'
                  />
                  <span className='hidden sm:inline-block text-sm'>
                    {user.displayName || user.email}
                  </span>
                </button>

                <div className='absolute right-0 mt-2 w-40  shadow rounded-md py-1 z-40'>
                  <Link
                    to='/dashboard'
                    className='block px-4 py-2 text-sm hover:bg-gray-50'
                  >
                    My Dashboard
                  </Link>
                  {role === 'admin' && (
                    <Link
                      to='/dashboard/manage-services'
                      className='block px-4 py-2 text-sm hover:bg-gray-50'
                    >
                      Admin
                    </Link>
                  )}
                  {role === 'decorator' && (
                    <>
                      <Link
                        to='/dashboard/decorator/projects'
                        className='nav-link'
                      >
                        My Projects
                      </Link>
                      <Link
                        to='/dashboard/decorator/today'
                        className='nav-link'
                      >
                        Today’s Schedule
                      </Link>
                      <Link
                        to='/dashboard/decorator/project-status'
                        className='nav-link'
                      >
                        Project Status
                      </Link>
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    className='w-full text-left px-4 py-2 text-sm hover:bg-gray-50'
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
