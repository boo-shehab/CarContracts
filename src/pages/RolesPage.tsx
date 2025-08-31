// src/pages/RolesPage.tsx
import { useEffect, useState } from "react";
import axios from "../services/axios";
import { RootState } from "../app/store";
import { useSelector } from "react-redux";

interface Role {
  id: number;
  displayName: string;
  displayNameAr: string;
  description: string;
  permissions: Permission[];
}

interface Permission {
  id: number;
  name: string;
  displayNameAr: string;
  granted?: boolean;
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    displayName: "",
    displayNameAr: "",
    description: "",
  });
  
  const { user } = useSelector((state: RootState) => state.auth);
  const companyId = user?.companyUserId;


  // Fetch roles
  const fetchRoles = async () => {
    const res = await axios.get(
      `/roles/company/${companyId}`
    );
    setRoles(res.data.data);
  };

  // Fetch all permissions
  const fetchPermissions = async () => {
    const res = await axios.get(
      `/permissions`
    );
    setPermissions(res.data.data);
  };

  // Fetch role permissions
  const fetchRolePermissions = async (roleId: number) => {
    const res = await axios.get(
      `/permissions/${roleId}/role`
    );
    setSelectedRole({
      ...roles.find((r) => r.id === roleId)!,
      permissions: res.data.data.permissions,
    });
  };

  // Create new role
  const createRole = async () => {
    await axios.post(
      `/roles/company/${companyId}`,
      formData
    );
    setFormData({ displayName: "", displayNameAr: "", description: "" });
    fetchRoles();
  };

  // Link permission
  const linkPermission = async (roleId: number, permissionId: number) => {
    await axios.post(
      `/permissions/link-to-role/${roleId}`,
      { permissionIds: [permissionId] }
    );
    fetchRolePermissions(roleId);
  };

  // Unlink permission
  const unlinkPermission = async (roleId: number, permissionId: number) => {
    await axios.delete(
      `/permissions/unlink-from-role/${roleId}`,
      { data: { permissionIds: [permissionId] } }
    );
    fetchRolePermissions(roleId);
  };

  // Toggle all permissions
  const toggleAllPermissions = async (roleId: number, enableAll: boolean) => {
    const form = new FormData();
    form.append("enableAll", enableAll.toString());
    await axios.post(
      `/permissions/${roleId}/toggle-all?enableAll=${enableAll}`,
    );
    fetchRolePermissions(roleId);
  };

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">إدارة الأدوار والصلاحيات</h2>

      {/* إضافة دور جديد */}
      <div className="bg-white shadow p-4 rounded">
        <h3 className="font-semibold mb-2">إضافة دور جديد</h3>
        <div className="grid grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="الاسم (انكليزي)"
            value={formData.displayName}
            onChange={(e) =>
              setFormData({ ...formData, displayName: e.target.value })
            }
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="الاسم (عربي)"
            value={formData.displayNameAr}
            onChange={(e) =>
              setFormData({ ...formData, displayNameAr: e.target.value })
            }
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="الوصف"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="border p-2 rounded"
          />
          <button
            onClick={createRole}
            className="bg-blue-600 text-white rounded px-4 py-2"
          >
            إضافة
          </button>
        </div>
      </div>

      {/* قائمة الأدوار */}
      <div className="bg-white shadow p-4 rounded">
        <h3 className="font-semibold mb-2">الأدوار</h3>
        <ul className="space-y-2">
          {roles.map((role) => (
            <li
              key={role.id}
              className="flex justify-between items-center border p-2 rounded cursor-pointer hover:bg-gray-100"
              onClick={() => fetchRolePermissions(role.id)}
            >
              <span>
                {role.displayNameAr || role.displayName} -{" "}
                <span className="text-gray-500">{role.description}</span>
              </span>
              <span className="text-sm text-gray-400">#{role.id}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* الصلاحيات الخاصة بالدور */}
      {selectedRole && (
        <div className="bg-white shadow p-4 rounded">
          <h3 className="font-semibold mb-2">
            الصلاحيات: {selectedRole.displayNameAr || selectedRole.displayName}
          </h3>
          <div className="mb-4">
            <button
              className="bg-green-600 text-white px-4 py-1 rounded mr-2"
              onClick={() => toggleAllPermissions(selectedRole.id, true)}
            >
              تفعيل الكل
            </button>
            <button
              className="bg-red-600 text-white px-4 py-1 rounded"
              onClick={() => toggleAllPermissions(selectedRole.id, false)}
            >
              إلغاء الكل
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {permissions.map((perm) => {
              const granted = selectedRole.permissions?.some(
                (p) => p.id === perm.id && p.granted
              );
              return (
                <div
                  key={perm.id}
                  className={`flex items-center justify-between border p-2 rounded ${
                    granted ? "bg-green-50" : "bg-gray-50"
                  }`}
                >
                  <span>{perm.displayNameAr}</span>
                  {granted ? (
                    <button
                      onClick={() => unlinkPermission(selectedRole.id, perm.id)}
                      className="text-red-600"
                    >
                      إزالة
                    </button>
                  ) : (
                    <button
                      onClick={() => linkPermission(selectedRole.id, perm.id)}
                      className="text-blue-600"
                    >
                      إضافة
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
