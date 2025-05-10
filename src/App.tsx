import { RouterProvider } from 'react-router-dom';
import router from './routes';

function App() {
  return (
    <div className='px-4'>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
