import { useEffect, useState } from 'react';
import axios from '../services/axios';
import { Dialog } from '@headlessui/react';
import SelectField from './Form/SelectField';

function RolePopup({ userId, companyUserId, onClose, currentRole }: any) {
  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(
    currentRole ? currentRole.id : null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/roles/company/${companyUserId}`)
      .then((res) => setRoles(res.data?.data || []))
      .catch(() => setRoles([]))
      .finally(() => setLoading(false));
  }, [companyUserId]);

  const handleSave = async () => {
    setLoading(true);
    try {
      if (!selectedRoleId) {
        // Remove role
        await axios.delete(`/roles/${userId}/roles`);
      } else if (!currentRole) {
        // Add role
        await axios.post(`/roles/${userId}/roles/${selectedRoleId}`);
      } else if (currentRole.id !== selectedRoleId) {
        // Update role
        await axios.put(`/roles/${userId}/roles/${selectedRoleId}`);
      }
      onClose();
    } catch {
      alert('فشل تعديل الدور');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="fixed inset-0 bg-black opacity-30" />
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full z-50 text-center shadow-lg">
        <h3 className="text-xl font-semibold mb-4">اختر دور لإضافته أو تعديله</h3>
        {loading ? (
          <div>جاري التحميل...</div>
        ) : (
          <div className="mb-4">
            <SelectField
              options={roles.map((role) => ({
                value: role.id,
                label: role.displayNameAr || role.displayName,
              }))}
              onChange={(e) => setSelectedRoleId(e.target.value ? Number(e.target.value) : null)}
              name="role"
              value={selectedRoleId}
              placeholder="اختر دور"
              clearable={true}
            />
          </div>
        )}
        <div className="flex gap-2 justify-end">
          <button className="px-4 py-2 rounded bg-gray-200" onClick={onClose} disabled={loading}>
            إلغاء
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white"
            onClick={handleSave}
            disabled={loading || selectedRoleId === currentRole?.id}
          >
            حفظ
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export default RolePopup;
