// routes/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { getAccessToken, isSuperAdmin } from '../utilities/token';

const ProtectedRoute = () => {
  const token = getAccessToken();
  const role = isSuperAdmin();

  if (!token) return <Navigate to="/login" />;

  if (role) return <Navigate to="/adminDashboard" />;

  return <Outlet />;
};

export default ProtectedRoute;
