import { Outlet } from 'react-router-dom';
import AdminHeader from '../components/AdminHeader';

const AdminDashboardLayout = () => {
  return (
    <div className="bg-primary-25">
      <AdminHeader />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboardLayout;
