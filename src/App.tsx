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
    console.log('App component mounted, fetching user data...');

    const fetchUser = async () => {
      try {
        if (accessToken) {
          const { data } = await getMe(accessToken);
          const roles = JSON.parse(localStorage.getItem('roles') || '[]');
          const refreshToken = localStorage.getItem('refreshToken');

          dispatch(setUser({ user: data, accessToken, refreshToken, roles }));
        } else {
          logout();
          console.warn('No access token found, logging out...');
          dispatch(setUser({ user: null, accessToken: null, refreshToken: null, roles: [] }));
        }
      } catch (error) {
        logout();
        console.error('Error fetching user data:', error);
        dispatch(setUser({ user: null, accessToken: null, refreshToken: null, roles: [] }));
      }
    };

    fetchUser();
  }, []);

  if (isLoading) return <Loading />;
  return (
    <div className="px-4 bg-primary-25">
      <RouterProvider router={router} />
      <ToastContainer />
    </div>
  );
}

export default App;
