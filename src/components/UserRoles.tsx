import { useState } from 'react';
import { useSelector } from 'react-redux';
import RolePopup from './RolePopup';

const roles = [
  { label: 'الكل', value: 'all' },
  { label: 'حذف', value: 'delete' },
  { label: 'تعديل', value: 'edit' },
  { label: 'طباعة', value: 'print' },
  { label: 'اضافة عقد', value: 'add_contract' },
  { label: 'اضافة تخويل', value: 'add_authorization' },
  { label: 'اضافة برائة ذمة', value: 'add_clearance' },
  { label: 'اضافة بطاقة', value: 'add_card' },
];

function UserRoles({ isOtherUser = false, userId, companyUserId }: any) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState(false);

  const handleToggle = (roleValue: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleValue) ? prev.filter((r) => r !== roleValue) : [...prev, roleValue]
    );
  };

  return (
    <div className="w-full z-10 lg:min-w-1/3 h-fit bg-white p-4 rounded-lg shadow">
      <div className='flex gap-1 justify-between items-center mb-4'>
        <h2 className="text-blue-600 font-bold text-xl">دور المستخدم</h2>
        {isOtherUser && (
          <button className='text-blue-600 font-bold text-xl cursor-pointer' onClick={() => setShowPopup(true)}>تغيير الدور</button>
        )}
      </div>
      <div className="flex flex-col gap-4">
        {roles.map((role) => (
          <label
            key={role.value}
            className="flex items-center justify-between w-full cursor-pointer gap-2"
          >
            <span className="text-xl">{role.label}</span>
            <input
              type="checkbox"
              autoComplete="off"
              checked={selectedRoles.includes(role.value)}
              onChange={() => handleToggle(role.value)}
              className="form-checkbox w-5 h-5 rounded-md border-gray-300 text-blue-600"
            />
          </label>
        ))}
      </div>
      {showPopup && (
        <RolePopup
          userId={userId}
          companyUserId={companyUserId}
          onClose={() => setShowPopup(false)}
          currentRole={selectedRoles[0] ? roles.find((role) => role.value === selectedRoles[0]) : null}
        />
      )}
    </div>
  );
}

export default UserRoles;
