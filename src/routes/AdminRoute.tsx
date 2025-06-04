import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const AdminRoute = () => {
  const { user, isAdmin } = useAuth();

  if (!user) return <Navigate to="/login" />;

  if (!isAdmin) return <Navigate to="/" />;

  return <Outlet />;
};

export default AdminRoute;
