import { RouterProvider } from 'react-router-dom';
import router from './routes';
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMe, logout } from './services/authService';
import { setUser } from './features/auth/authSlice';
import Loading from './components/Loading';

function App() {
  const dispatch = useDispatch();
  const { accessToken, isLoading } = useSelector((state: any) => state.auth);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (accessToken) {
          const { data } = await getMe(accessToken);
          const roles = JSON.parse(localStorage.getItem('roles') || '[]');
          const refreshToken = localStorage.getItem('refreshToken');
          dispatch(setUser({ user: data, accessToken, refreshToken, roles }));
        } else {
          dispatch(setUser({ user: null, accessToken: null, refreshToken: null, roles: [] }));
        }
      } catch (error: any) {
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            try {
              // Assume you have a refreshToken API function
              const { data } = await import('./services/authService').then(m => m.refreshToken(refreshToken));
              localStorage.setItem('accessToken', data.accessToken);
              dispatch(setUser({
                user: data.user,
                accessToken: data.accessToken,
                refreshToken,
                roles: data.roles || [],
              }));
            } catch (refreshError: any) {
              logout();
              dispatch(setUser({ user: null, accessToken: null, refreshToken: null, roles: [] }));
              console.error('Error refreshing token:', refreshError);
            }
          } else {
            logout();
            dispatch(setUser({ user: null, accessToken: null, refreshToken: null, roles: [] }));
          }
        } else {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) return <Loading />;
  return (
    <div className="px-4 bg-primary-25 min-h-screen">
      <RouterProvider router={router} />
      <ToastContainer />
    </div>
  );
}

export default App;
