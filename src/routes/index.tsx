import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import PublicRoute from './PublicRoute';
import Loading from '../components/Loading';
// import Profile from '../pages/Profile';

const Home = lazy(() => import('../pages/Home'));
const Profile = lazy(() => import('../pages/Profile'));
const Login = lazy(() => import('../pages/Login'));
const FormComponents = lazy(() => import('../pages/FormComponents'));
const MainLayout = lazy(() => import('../layouts/MainLayout'));
const Admin = lazy(() => import('../pages/Admin'));
const AdminDashboardLayout = lazy(() => import('../layouts/AdminDashboardLayout'));

const withSuspense = (element: React.ReactNode) => (
  <Suspense fallback={<Loading />}>{element}</Suspense>
);

const router = createBrowserRouter([
  {
    path: '/login',
    element: <PublicRoute />,
    children: [
      {
        index: true,
        element: withSuspense(<Login />),
      },
    ],
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: withSuspense(<MainLayout />),
        children: [
          {
            index: true,
            element: withSuspense(<Home />),
          },
          {
            path: 'formComponents',
            element: withSuspense(<FormComponents />),
          },
          {
            path: 'profile',
            element: <Profile />,
          },
        ],
      },
    ],
  },
  {
    path: '/adminDashboard',
    element: <AdminRoute />,
    children: [
      {
        element: withSuspense(<AdminDashboardLayout />),
        children: [
          {
            index: true,
            element: withSuspense(<Admin />),
          },
          {
            path: 'profile',
            element: <Profile />,
          },
        ],
      },
    ],
  },
]);

export default router;
