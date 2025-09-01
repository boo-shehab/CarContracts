import { useEffect, useState } from 'react';
import axios from '../services/axios';

function RolePopup({ userId, companyUserId, onClose }: any) {
  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
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
    if (!selectedRoleId) return;
    setLoading(true);
    try {
      await axios.post(`/roles/${userId}/roles/${selectedRoleId}`);
      onClose();
    } catch {
      alert('فشل إضافة الدور');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 min-w-[300px]">
        <h3 className="text-xl font-bold mb-4">اختر دور لإضافته</h3>
        {loading ? (
          <div>جاري التحميل...</div>
        ) : (
          <ul className="mb-4">
            {roles.map((role) => (
              <li key={role.id} className="mb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value={role.id}
                    checked={selectedRoleId === role.id}
                    onChange={() => setSelectedRoleId(role.id)}
                  />
                  <span>{role.displayNameAr || role.displayName}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
        <div className="flex gap-2 justify-end">
          <button
            className="px-4 py-2 rounded bg-gray-200"
            onClick={onClose}
            disabled={loading}
          >
            إلغاء
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white"
            onClick={handleSave}
            disabled={!selectedRoleId || loading}
          >
            حفظ
          </button>
        </div>
      </div>
    </div>
  );
}

export default RolePopup;