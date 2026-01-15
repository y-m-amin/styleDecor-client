import { createBrowserRouter } from 'react-router';

import Analytics from '../dashboard/admin/Analytics';
import ManageBookings from '../dashboard/admin/ManageBookings';
import ManageDecorators from '../dashboard/admin/ManageDecorators';
import ManageServices from '../dashboard/admin/ManageServices';
import Revenue from '../dashboard/admin/Revenue';
import DashboardLayout from '../dashboard/DashboardLayout';
import DecoratorProfile from '../dashboard/decorator/DecoratorProfile';
import EarningsSummary from '../dashboard/decorator/EarningsSummary';
import MyProjects from '../dashboard/decorator/MyProjects';
import MySchedule from '../dashboard/decorator/MySchedule';
import ApplyDecorator from '../dashboard/user/ApplyDecorator';
import MyBookings from '../dashboard/user/MyBookings';
import MyProfile from '../dashboard/user/MyProfile';
import PaymentHistory from '../dashboard/user/PaymentHistory';
import MainLayout from '../layouts/MainLayout';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import DecoratorProfilePub from '../pages/Decorator/DecoratorProfilePub';
import Forbidden from '../pages/Error/Forbidden';
import GlobalError from '../pages/Error/GlobalError';
import Home from '../pages/Home/Home';
import ServiceCoverageMap from '../pages/Map/ServiceCoverageMap';
import About from '../pages/Misc/About';
import Contact from '../pages/Misc/Contact';
import PaymentCancelled from '../pages/Payment/PaymentCancelled';
import PaymentReceipt from '../pages/Payment/PaymentReceipt';
import PaymentSuccess from '../pages/Payment/PaymentSuccess';
import ServiceDetails from '../pages/Services/ServiceDetails';
import ServicesList from '../pages/Services/ServiceList';
import AdminRoute from './AdminRoute';
import DecoratorRoute from './DecoratorRoute';
import PrivateRoute from './PrivateRoute';
import Blogs from '../pages/Blogs/Blogs';
import BlogDetails from '../pages/Blogs/BlogDetails';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <GlobalError />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/services', element: <ServicesList /> },

      {
        path: '/services/:id',
        element: (
          
            <ServiceDetails />
          
        ),
      },
      {path:"/blogs" ,element:<Blogs />},
      {path:"/blogs/:id", element:<BlogDetails /> },
      { path: '/forbidden', element: <Forbidden /> },

      { path: '/map', element: <ServiceCoverageMap /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/decorators/:id', element: <DecoratorProfilePub /> },
      { path: '/about', element: <About /> },
      { path: '/contact', element: <Contact /> },
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
      { path: 'payment-history', element: <PaymentHistory /> },
      {
        path: '/dashboard/apply-decorator',
        element: (
          <PrivateRoute>
            <ApplyDecorator />
          </PrivateRoute>
        ),
      },
      {
        path: '/dashboard/payment-success',
        element: <PaymentSuccess />,
      },
      {
        path: '/dashboard/payment-cancelled',
        element: <PaymentCancelled />,
      },
      {
        path: '/dashboard/payment-receipt/:paymentId',
        element: <PaymentReceipt />,
      },

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
        path: 'admin/analytics',
        element: (
          <AdminRoute>
            <Analytics />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/revenue',
        element: (
          <AdminRoute>
            <Revenue />
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
        path: 'decorator/My-profile',
        element: (
          <DecoratorRoute>
            <DecoratorProfile />
          </DecoratorRoute>
        ),
      },
      {
        path: 'decorator/schedule',
        element: (
          <DecoratorRoute>
            <MySchedule />
          </DecoratorRoute>
        ),
      },
      {
        path: 'decorator/earnings',
        element: (
          <DecoratorRoute>
            <EarningsSummary />
          </DecoratorRoute>
        ),
      },
    ],
  },
]);

export default router;
