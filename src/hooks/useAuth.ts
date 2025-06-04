import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { logout } from '../features/auth/authSlice';

const useAuth = () => {
  const { user, roles } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const isAdmin = roles?.includes('ROLE_SUPER_ADMIN');

  const logoutHandler = () => {
    dispatch(logout());
  };

  return { user, isAdmin, logoutHandler };
};

export default useAuth;
