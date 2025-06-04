import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = () => {
  const { user, isAdmin } = useAuth();

  if (!user) return <Navigate to="/login" />;

  if (isAdmin) return <Navigate to="/adminDashboard" />;

  return <Outlet />;
};

export default ProtectedRoute;
