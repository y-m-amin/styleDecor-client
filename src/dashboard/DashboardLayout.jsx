import { useContext } from 'react';
import { Link, Outlet } from 'react-router';
import Navbar from '../Components/NavBar';
import { AuthContext } from '../context/AuthContext';

export default function DashboardLayout() {
  const { role, decoratorStatus } = useContext(AuthContext);

  return (
    <div>
      <div className='sticky top-0 z-50 bg-base-100 shadow-sm'>
        <Navbar />
      </div>

      <div className='flex'>
        {/* Sidebar */}
        <aside className='w-64 bg-gray-900 text-white min-h-screen p-6 space-y-6'>
          {/* USER MENU */}
          {role === 'user' && (
            <div className='flex flex-col gap-2'>
              <h3 className='text-sm uppercase text-gray-400'>User</h3>

              <Link to='/dashboard' className='hover:text-primary'>
                My Profile
              </Link>
              <Link to='/dashboard/my-bookings' className='hover:text-primary'>
                My Bookings
              </Link>
              <Link
                to='/dashboard/payment-history'
                className='hover:text-primary'
              >
                Payments
              </Link>

              {/* Apply as Decorator */}
              {decoratorStatus === 'none' && (
                <Link
                  to='/dashboard/apply-decorator'
                  className='mt-2 text-yellow-400 hover:text-yellow-300'
                >
                  Apply as Decorator
                </Link>
              )}

              {/* Pending state */}
              {decoratorStatus === 'pending' && (
                <span className='mt-2 text-yellow-500 text-sm'>
                  Decorator application pending
                </span>
              )}
            </div>
          )}

          {/* ADMIN MENU */}
          {role === 'admin' && (
            <div className='flex flex-col gap-2'>
              <h3 className='text-sm uppercase text-gray-400'>Admin</h3>

              <Link to='/dashboard/admin/analytics'>Dashboard</Link>
              <Link to='/dashboard/admin/manage-services'>Manage Services</Link>
              <Link to='/dashboard/admin/manage-bookings'>Manage Bookings</Link>
              <Link to='/dashboard/admin/manage-decorators'>
                Manage Decorators
              </Link>
            </div>
          )}

          {/* DECORATOR MENU */}
          {role === 'decorator' && decoratorStatus === 'active' && (
            <div className='flex flex-col gap-2'>
              <h3 className='text-sm uppercase text-gray-400'>Decorator</h3>

              <Link to='/dashboard/decorator/projects'>My Projects</Link>
              <Link to='/dashboard/decorator/project-status'>
                Project Status
              </Link>
              <Link to='/dashboard/decorator/today'>Today’s Schedule</Link>
            </div>
          )}
        </aside>

        {/* Content */}
        <div className='flex-1 p-6  min-h-screen'>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
