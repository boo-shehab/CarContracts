import { useState } from 'react';
import RolePopup from './RolePopup';

function UserRoles({ isOtherUser = false, companyUserId, userInfo, refresh }: any) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="w-full z-10 lg:min-w-1/3 h-fit bg-white p-4 rounded-lg shadow">
      <div className='flex gap-1 justify-between items-center mb-4'>
        <h2 className="text-blue-600 font-bold text-xl">دور المستخدم</h2>
        {isOtherUser && (
          <button className='text-blue-600 font-bold text-xl cursor-pointer' onClick={() => setShowPopup(true)}>تغيير الدور</button>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <div
          className="flex justify-between items-center overflow-hidden w-full border border-primary-200 p-4 rounded-lg bg-primary-50"
        >
          <span className="flex gap-1 text-lg font-medium text-primary-700">
            {userInfo?.roles}
          </span>
        </div>
        <div className="pt-4 pb-6 transition-all duration-300 ease-in-out overflow-hidden max-h-[1000px] opacity-100">
          <div className="grid grid-cols-1 gap-3">
            {userInfo?.permissions.map((perm: any) => (
              <div
                key={perm.id}
                className="flex items-center justify-between border p-3 rounded-lg shadow-sm"
              >
                <span className="font-medium text-gray-700">
                  {perm.displayNameAr}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showPopup && (
        <RolePopup
          userId={userInfo?.id}
          companyUserId={companyUserId}
          userInfo={userInfo}
          onClose={() => {
            refresh()
            setShowPopup(false)
          }}
          currentRole={userInfo?.roles[0] ? userInfo.roles[0] : null}
        />
      )}
    </div>
  );
}

export default UserRoles;
