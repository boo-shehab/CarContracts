import { Outlet } from "react-router-dom"
import AdminHeader from "../components/AdminHeader"

const AdminDashboardLayout = () => {
    return (
        <div>
          <AdminHeader />
          <main>
            <Outlet />
          </main>
        </div>
      )
}

export default AdminDashboardLayout