import { RouterProvider } from 'react-router-dom';
import router from './routes';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <div className="px-4 bg-primary-25">
      <RouterProvider router={router} />
      <ToastContainer />
    </div>
  );
}

export default App;
