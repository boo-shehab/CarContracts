import { RouterProvider } from 'react-router-dom';
import router from './routes';
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMe, logout } from './services/authService';
import { setUser } from './features/auth/authSlice';
import Loading from './components/Loading';

import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { app } from './firebase'; // <-- import your initialized app

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

  useEffect(() => {
    Notification.requestPermission()
      .then((permission) => {
        if (permission === 'granted') {
          const messaging = getMessaging(app); // <-- pass the app instance
          getToken(messaging, {
            vapidKey:
              'BOJEhMwYAch4UmfKjkqDW0Qu1GGpsIlcxN1tdbTfxYwv6AeRFVZEmdHLJ_hlWDeDCIK6x7JdOk5xi6uU0zmvz9c',
          }).then((currentToken) => {
            if (currentToken) {
              // Send the token to your server and update the UI if necessary
              
            } else {
              console.log('No registration token available. Request permission to generate one.');
            }
          });
          onMessage(messaging, (payload) => {
            console.log('Message received. ', payload);
            new Notification(payload.notification?.title || 'Notification', {
              body: payload.notification?.body,
              icon: payload.notification?.icon,
            });
          });
        }
      })
      .catch((err) => {
        console.error('Error requesting notification permission:', err);
      });
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
