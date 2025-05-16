import { RouterProvider } from 'react-router-dom';
import router from './routes';

function App() {
  return (
    <div className="px-4 bg-primary-25 overflow-hidden">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
