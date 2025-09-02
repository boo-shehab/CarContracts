// src/pages/RolesPage.tsx
import { useEffect, useState } from 'react';
import axios from '../services/axios';
import { RootState } from '../app/store';
import { useSelector } from 'react-redux';
import { Disclosure, Switch } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import InputField from '../components/Form/InputField';

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
  const [rolePermissions, setRolePermissions] = useState<Permission[]>([]);
  const [formData, setFormData] = useState({
    displayName: '',
    displayNameAr: '',
    description: '',
  });

  const { user } = useSelector((state: RootState) => state.auth);
  const companyId = user?.companyUserId;

  // Fetch roles
  const fetchRoles = async () => {
    const res = await axios.get(`/roles/company/${companyId}`);
    setRoles(res.data.data);
  };

  // Fetch all permissions
  const fetchPermissions = async () => {
    const res = await axios.get(`/permissions`);
    setPermissions(res.data.data);
  };

  // Fetch role permissions
  const fetchRolePermissions = async (roleId: number) => {
    const res = await axios.get(`/permissions/${roleId}/role`);
    setRolePermissions(res.data.data.permissions);
  };

  // Create new role
  const createRole = async () => {
    await axios.post(`/roles/company/${companyId}`, formData);
    setFormData({ displayName: '', displayNameAr: '', description: '' });
    fetchRoles();
  };

  // Link permission
  const linkPermission = async (roleId: number, permissionId: number) => {
    await axios.post(`/permissions/link-to-role/${roleId}`, { permissionIds: [permissionId] });
    fetchRolePermissions(roleId);
  };

  // Unlink permission
  const unlinkPermission = async (roleId: number, permissionId: number) => {
    await axios.delete(`/permissions/unlink-from-role/${roleId}`, {
      data: { permissionIds: [permissionId] },
    });
    fetchRolePermissions(roleId);
  };

  // Toggle all permissions
  const toggleAllPermissions = async (roleId: number, enableAll: boolean) => {
    await axios.post(`/permissions/${roleId}/toggle-all?enableAll=${enableAll}`);
    fetchRolePermissions(roleId);
  };

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  return (
    <div className="p-8 space-y-8 bg-primary-25 min-h-screen">
      <h2 className="text-3xl font-bold text-primary-700 mb-4">إدارة الأدوار والصلاحيات</h2>

      {/* إضافة دور جديد */}
      <div className="bg-white shadow-lg p-6 rounded-xl">
        <h3 className="font-semibold mb-4 text-lg text-primary-700">إضافة دور جديد</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <InputField
            name="displayName"
            label=""
            placeholder="الاسم (انكليزي)"
            type="text"
            value={formData.displayName}
            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
            className="w-full"
          />
          <InputField
            name="displayNameAr"
            label=""
            placeholder="الاسم (عربي)"
            type="text"
            value={formData.displayNameAr}
            onChange={(e) => setFormData({ ...formData, displayNameAr: e.target.value })}
            className="w-full"
          />
          <InputField
            name="description"
            label=""
            placeholder="الوصف"
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full"
          />
        </div>
        <button
          onClick={createRole}
          className="rounded-lg px-6 py-2 w-full md:w-fit text-white text-lg bg-primary-500 hover:bg-primary-600 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed"
        >
          إضافة
        </button>
      </div>

      {/* قائمة الأدوار مع Accordion */}
      <div className="bg-white shadow-lg p-6 rounded-xl">
        <h3 className="font-semibold mb-4 text-lg text-primary-700">الأدوار</h3>
        <div className="space-y-4">
          {roles.map((role) => (
            <Disclosure key={role.id}>
              {({ open }) => (
                <>
                  <Disclosure.Button
                    className={`flex justify-between items-center w-full border border-primary-200 p-4 rounded-lg cursor-pointer bg-primary-50 hover:bg-primary-100 transition-colors`}
                    onClick={() => {
                      fetchRolePermissions(role.id);
                    }}
                  >
                    <span className="flex gap-1 text-lg font-medium text-primary-700">
                      {role.displayNameAr || role.displayName}
                      <span className="text-gray-500 text-base ml-2"> - {role.description}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">#{role.id}</span>
                      <ChevronDownIcon
                        className={`h-6 w-6 text-primary-500 transition-transform ${
                          open ? 'rotate-180' : ''
                        }`}
                      />
                    </span>
                  </Disclosure.Button>
                  <Disclosure.Panel>
                    {({ open }) => (
                      <div
                        className={`pt-4 pb-6 transition-all duration-300 ease-in-out overflow-hidden ${
                          open ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="mb-6 flex items-center gap-4">
                          <Switch
                            checked={
                              rolePermissions.length > 0 && rolePermissions.every((p) => p.granted)
                            }
                            onChange={(checked) => toggleAllPermissions(role.id, checked)}
                            className={`${
                              rolePermissions.length > 0 && rolePermissions.every((p) => p.granted)
                                ? 'bg-primary-500'
                                : 'bg-gray-300'
                            } relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none`}
                          >
                            <span
                              className={`${
                                rolePermissions.length > 0 &&
                                rolePermissions.every((p) => p.granted)
                                  ? '-translate-x-8'
                                  : '-translate-x-1'
                              } inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform`}
                            />
                          </Switch>
                          <span
                            className={`font-semibold text-lg ${
                              rolePermissions.length > 0 && rolePermissions.every((p) => p.granted)
                                ? 'text-primary-700'
                                : 'text-red-600'
                            }`}
                          >
                            {rolePermissions.length > 0 && rolePermissions.every((p) => p.granted)
                              ? 'تفعيل الكل'
                              : 'إلغاء الكل'}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {permissions.map((perm) => {
                            const granted = rolePermissions.some(
                              (p) => p.id === perm.id && p.granted
                            );
                            return (
                              <div
                                key={perm.id}
                                className={`flex items-center justify-between border p-3 rounded-lg shadow-sm ${
                                  granted
                                    ? 'bg-green-50 border-green-200'
                                    : 'bg-gray-50 border-gray-200'
                                }`}
                              >
                                <span className="font-medium text-gray-700">
                                  {perm.displayNameAr}
                                </span>
                                {granted ? (
                                  <button
                                    onClick={() => unlinkPermission(role.id, perm.id)}
                                    className="text-red-600 font-semibold px-3 py-1 rounded hover:bg-red-100 transition"
                                  >
                                    إزالة
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => linkPermission(role.id, perm.id)}
                                    className="text-primary-600 font-semibold px-3 py-1 rounded hover:bg-primary-100 transition"
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
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))}
        </div>
      </div>
    </div>
  );
}
