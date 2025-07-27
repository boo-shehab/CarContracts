import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import PublicRoute from './PublicRoute';
import Loading from '../components/Loading';

// Lazy load all pages
const Home = lazy(() => import('../pages/Home'));
const Profile = lazy(() => import('../pages/Profile'));
const Login = lazy(() => import('../pages/Login'));
const MainLayout = lazy(() => import('../layouts/MainLayout'));
const Admin = lazy(() => import('../pages/Admin'));
const AdminDashboardLayout = lazy(() => import('../layouts/AdminDashboardLayout'));
const Contracts = lazy(() => import('../pages/Contracts'));
const Authorizations = lazy(() => import('../pages/Authorizations'));
const Clearance = lazy(() => import('../pages/Clearance'));
const Users = lazy(() => import('../pages/Users'));
const Payments = lazy(() => import('../pages/Payments'));
const AccountCards = lazy(() => import('../pages/AccountCards'));
const AddNewCar = lazy(() => import('../pages/AddNewCar'));
const AddNewAccount = lazy(() => import('../pages/AddNewAccount'));
const AddNewContract = lazy(() => import('../pages/AddNewContract'));
const AddNewAuthorization = lazy(() => import('../pages/AddNewAuthorization'));
const ViewPerson = lazy(() => import('../pages/ViewPerson'));

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
            path: 'profile',
            element: <Profile />,
          },
          {
            path: 'contracts',
            element: withSuspense(<Contracts />),
          },
          {
            path: 'authorizations',
            element: withSuspense(<Authorizations />),
          },
          {
            path: 'clearance',
            element: withSuspense(<Clearance />),
          },
          {
            path: 'users',
            element: withSuspense(<Users />),
          },
          {
            path: 'payments',
            element: withSuspense(<Payments />),
          },
          {
            path: 'account-cards',
            element: withSuspense(<AccountCards />),
          },
          {
            path: `account-cards/:id`,
            element: withSuspense(<ViewPerson />),
          },
          {
            path: 'new-car',
            element: withSuspense(<AddNewCar />),
          },
          {
            path: 'new-account',
            element: withSuspense(<AddNewAccount />),
          },
          {
            path: 'new-contract',
            element: withSuspense(<AddNewContract />),
          },
          {
            path: 'new-authorization',
            element: withSuspense(<AddNewAuthorization />),
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
