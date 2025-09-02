import { Navigate, Outlet } from 'react-router-dom';
import { getAccessToken } from '../utilities/token';
import { hasPermission } from '../utilities/permissions';
import { ALL_PERMISSIONS } from '../utilities/allPermissions';

const PublicRoute = () => {
  const token = getAccessToken();
  return token ? hasPermission(ALL_PERMISSIONS.GET_DASHBOARD) ? <Navigate to="/" /> : <Navigate to="/profile" /> : <Outlet />;
};

export default PublicRoute;
