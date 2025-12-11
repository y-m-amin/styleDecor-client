import { Link, Outlet } from 'react-router';
export default function DashboardLayout() {
  return (
    <div className='flex'>
      <aside className='w-64 bg-gray-900 text-white h-screen p-6'>
        <Link to='/dashboard'>My Profile</Link>
        <Link to='/dashboard/my-bookings'>My Bookings</Link>
        <Link to='/dashboard/payment-history'>Payments</Link>
      </aside>

      <div className='flex-1 p-6'>
        <Outlet />
      </div>
    </div>
  );
}
