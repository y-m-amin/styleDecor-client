import { Link, Outlet } from 'react-router';
import Navbar from '../Components/NavBar';

import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function DashboardLayout() {
  const { role } = useContext(AuthContext); 

  return (
    <div>
      <div className='sticky top-0 z-50 bg-base-100 shadow-sm'>
        <Navbar />
      </div>

      <div className='flex'>
        <aside className='w-64 bg-gray-900 text-white h-screen p-6 space-y-2'>
          {role === 'user' && (
            <>
              <Link to='/dashboard'>My Profile</Link>
              <Link to='/dashboard/my-bookings'>My Bookings</Link>
              <Link to='/dashboard/payment-history'>Payments</Link>
            </>
          )}

          {role === 'admin' && (
            <>
              <Link to='/dashboard/admin/analytics'>Dashboard</Link>
              <Link to='/dashboard/admin/manage-services'>Manage Services</Link>
              <Link to='/dashboard/admin/manage-bookings'>Manage Bookings</Link>
              <Link to='/dashboard/admin/manage-decorators'>Manage Decorators</Link>
            </>
          )}

          {role === 'decorator' && (
            <>
              <Link to='/dashboard/decorator/projects'>My Projects</Link>
              <Link to='/dashboard/decorator/project-status'>Project Status</Link>
              <Link to='/dashboard/decorator/today'>Today’s Schedule</Link>
            </>
          )}
        </aside>

        <div className='flex-1 p-6'>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
