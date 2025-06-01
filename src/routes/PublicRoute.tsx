import { Navigate, Outlet } from 'react-router-dom';
import { getAccessToken } from '../utilities/token';

const PublicRoute = () => {
  const token = getAccessToken();
  return token ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoute;
