// routes/AdminRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { getAccessToken, isSuperAdmin } from '../utilities/token';

const AdminRoute = () => {
  const token = getAccessToken();
  const role = isSuperAdmin();

  if (!token) return <Navigate to="/login" />;

  if (!role) return <Navigate to="/" />;

  return <Outlet />;
};

export default AdminRoute;
