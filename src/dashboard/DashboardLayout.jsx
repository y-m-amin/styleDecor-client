import { useContext, useMemo, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router';
import Navbar from '../Components/NavBar';
import { AuthContext } from '../context/AuthContext';

export default function DashboardLayout() {
  const { role, decoratorStatus } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

  /**
   *  dashboard navigation
   */
  const navConfig = useMemo(() => {
    if (role === 'admin') {
      return {
        title: 'Admin Menu',
        links: [
          { label: 'Dashboard', to: '/dashboard/admin/analytics' },
          { label: 'Manage Services', to: '/dashboard/admin/manage-services' },
          { label: 'Manage Bookings', to: '/dashboard/admin/manage-bookings' },
          {
            label: 'Manage Decorators',
            to: '/dashboard/admin/manage-decorators',
          },
        ],
      };
    }

    if (role === 'decorator' && decoratorStatus === 'active') {
      return {
        title: 'Decorator Menu',
        links: [
          { label: 'My Projects', to: '/dashboard/decorator/projects' },
          { label: 'My Profile', to: '/dashboard/decorator/my-profile' },
          { label: 'Schedule', to: '/dashboard/decorator/schedule' },
          { label: 'Earning Summary', to: '/dashboard/decorator/earnings' },
        ],
      };
    }

    // default: user
    const links = [
      { label: 'My Profile', to: '/dashboard' },
      { label: 'My Bookings', to: '/dashboard/my-bookings' },
      { label: 'Payments', to: '/dashboard/payment-history' },
    ];

    if (decoratorStatus === 'inactive' || decoratorStatus === 'none') {
      links.push({
        label: 'Apply as Decorator',
        to: '/dashboard/apply-decorator',
        className: 'text-yellow-500',
      });
    }

    if (decoratorStatus === 'pending') {
      links.push({
        label: 'Decorator application pending',
        to: null,
        className: 'text-yellow-500 cursor-default',
      });
    }

    return {
      title: 'User Menu',
      links,
    };
  }, [role, decoratorStatus]);

  const renderLinks = (isMobile = false) =>
    navConfig.links.map((link) =>
      link.to ? (
        <Link
          key={link.label}
          to={link.to}
          className={[
            'hover:text-primary',
            link.className || '',
            location.pathname === link.to ? 'text-primary font-medium' : '',
            isMobile ? 'px-2 py-1' : '',
          ].join(' ')}
        >
          {link.label}
        </Link>
      ) : (
        <span
          key={link.label}
          className={['text-sm', link.className || ''].join(' ')}
        >
          {link.label}
        </span>
      )
    );

  return (
    <div>
      {/* Top Navbar */}
      <div className='sticky top-0 z-50 bg-base-100 shadow-sm'>
        <Navbar />
      </div>

      {/* Mobile dropdown navigation */}
      <div className='md:hidden flex mx-auto px-4 py-3 border-b bg-base-200'>
        <div className='w-1/3  mx-auto dropdown  dropdown-center'>
          <div tabIndex={0} role='button' className='btn btn-sm w-full'>
            {navConfig.title}
          </div>
          <ul
            tabIndex={0}
            className='dropdown-content menu bg-base-100 rounded-box z-10 w-full p-2 shadow'
          >
            {renderLinks(true).map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className='flex'>
        {/* Desktop Sidebar */}
        <aside className='hidden md:block w-64 bg-gray-900 text-white min-h-screen p-6 space-y-4'>
          <h3 className='text-sm uppercase text-gray-400'>{navConfig.title}</h3>
          <div className='flex flex-col gap-2'>{renderLinks()}</div>
        </aside>

        {/* Content */}
        <main className='flex-1 p-4 sm:p-6 min-h-screen'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
