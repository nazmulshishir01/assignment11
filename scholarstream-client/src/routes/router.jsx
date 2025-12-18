import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import Home from '../pages/Home';
import AllScholarships from '../pages/AllScholarships';
import ScholarshipDetails from '../pages/ScholarshipDetails';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Checkout from '../pages/Checkout';
import PaymentSuccess from '../pages/PaymentSuccess';
import PaymentFailed from '../pages/PaymentFailed';
import ErrorPage from '../pages/ErrorPage';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';
import ModeratorRoute from './ModeratorRoute';

// Dashboard pages
import MyProfile from '../pages/dashboard/MyProfile';
import MyApplications from '../pages/dashboard/student/MyApplications';
import MyReviews from '../pages/dashboard/student/MyReviews';
import AddScholarship from '../pages/dashboard/admin/AddScholarship';
import ManageScholarships from '../pages/dashboard/admin/ManageScholarships';
import ManageUsers from '../pages/dashboard/admin/ManageUsers';
import Analytics from '../pages/dashboard/admin/Analytics';
import ManageApplications from '../pages/dashboard/moderator/ManageApplications';
import AllReviews from '../pages/dashboard/moderator/AllReviews';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/scholarships',
        element: <AllScholarships />
      },
      {
        path: '/scholarship/:id',
        element: <ScholarshipDetails />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/register',
        element: <Register />
      },
      {
        path: '/checkout/:id',
        element: (
          <PrivateRoute>
            <Checkout />
          </PrivateRoute>
        )
      },
      {
        path: '/payment-success',
        element: (
          <PrivateRoute>
            <PaymentSuccess />
          </PrivateRoute>
        )
      },
      {
        path: '/payment-failed',
        element: (
          <PrivateRoute>
            <PaymentFailed />
          </PrivateRoute>
        )
      }
    ]
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/dashboard',
        element: <MyProfile />
      },
      {
        path: '/dashboard/my-profile',
        element: <MyProfile />
      },
      // Student Routes
      {
        path: '/dashboard/my-applications',
        element: <MyApplications />
      },
      {
        path: '/dashboard/my-reviews',
        element: <MyReviews />
      },
      // Admin Routes
      {
        path: '/dashboard/add-scholarship',
        element: (
          <AdminRoute>
            <AddScholarship />
          </AdminRoute>
        )
      },
      {
        path: '/dashboard/manage-scholarships',
        element: (
          <AdminRoute>
            <ManageScholarships />
          </AdminRoute>
        )
      },
      {
        path: '/dashboard/manage-users',
        element: (
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        )
      },
      {
        path: '/dashboard/analytics',
        element: (
          <AdminRoute>
            <Analytics />
          </AdminRoute>
        )
      },
      // Moderator Routes
      {
        path: '/dashboard/manage-applications',
        element: (
          <ModeratorRoute>
            <ManageApplications />
          </ModeratorRoute>
        )
      },
      {
        path: '/dashboard/all-reviews',
        element: (
          <ModeratorRoute>
            <AllReviews />
          </ModeratorRoute>
        )
      }
    ]
  }
]);

export default router;
