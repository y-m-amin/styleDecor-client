import { createBrowserRouter } from 'react-router';

import ManageBookings from '../dashboard/admin/ManageBookings';
import ManageDecorators from '../dashboard/admin/ManageDecorators';
import ManageServices from '../dashboard/admin/ManageServices';
import DashboardLayout from '../dashboard/DashboardLayout';
import MyProjects from '../dashboard/decorator/MyProjects';
import ProjectStatus from '../dashboard/decorator/ProjectStatus';
import TodaySchedule from '../dashboard/decorator/TodaySchedule';
import MyBookings from '../dashboard/user/MyBookings';
import MyProfile from '../dashboard/user/MyProfile';
import MainLayout from '../layouts/MainLayout';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import Home from '../pages/Home/Home';
import ServiceCoverageMap from '../pages/Map/ServiceCoverageMap';
import ServiceDetails from '../pages/Services/ServiceDetails';
import ServicesList from '../pages/Services/ServiceList';
import AdminRoute from './AdminRoute';
import DecoratorRoute from './DecoratorRoute';
import PrivateRoute from './PrivateRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <div>Global Error</div>,
    children: [
      { path: '/', element: <Home /> },
      { path: '/services', element: <ServicesList /> },
      { path: '/services/:id', element: <ServiceDetails /> },
      { path: '/map', element: <ServiceCoverageMap /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
    ],
  },

  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <MyProfile /> },

      // user
      { path: 'my-bookings', element: <MyBookings /> },

      // ───────────────────────────────
      // ADMIN ROUTES
      // ───────────────────────────────
      {
        path: 'admin/manage-services',
        element: (
          <AdminRoute>
            <ManageServices />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/manage-bookings',
        element: (
          <AdminRoute>
            <ManageBookings />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/manage-decorators',
        element: (
          <AdminRoute>
            <ManageDecorators />
          </AdminRoute>
        ),
      },
      // ───────────────────────────────
      // DECORATOR ROUTES
      // ───────────────────────────────
      {
        path: 'decorator/projects',
        element: (
          <DecoratorRoute>
            <MyProjects />
          </DecoratorRoute>
        ),
      },
      {
        path: 'decorator/project-status',
        element: (
          <DecoratorRoute>
            <ProjectStatus />
          </DecoratorRoute>
        ),
      },
      {
        path: 'decorator/today',
        element: (
          <DecoratorRoute>
            <TodaySchedule />
          </DecoratorRoute>
        ),
      },
    ],
  },
]);

export default router;
