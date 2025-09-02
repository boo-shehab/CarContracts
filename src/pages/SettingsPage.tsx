import { use, useEffect, useState } from 'react';
import RolesPage from './RolesPage';
import { hasPermission } from '../utilities/permissions';
import { useNavigate } from 'react-router-dom';

const settingsItems = [
  {
    key: 'roles',
    label: 'إدارة الأدوار والصلاحيات',
    icon: (
      <svg
        className="w-6 h-6 text-primary-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14v7m-7-7a7 7 0 0114 0v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1z"
        />
      </svg>
    ),
  },
  // Add more items here later
];

export default function SettingsPage() {
  const [selected, setSelected] = useState(settingsItems[0].key);
  const navigate = useNavigate();

  useEffect(() => {
    if(!hasPermission('')) {
      navigate(-1);
    }
  }, [])

  return (
    <div className="h-full flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-l-1 border-primary-300 p-6 flex-shrink-0">
        <h2 className="text-2xl font-bold text-primary-700 mb-6">الإعدادات</h2>
        <nav className="space-y-2">
          {settingsItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setSelected(item.key)}
              className={`flex items-center gap-3 w-full text-right px-4 py-3 rounded-lg transition
                ${
                  selected === item.key
                    ? 'bg-primary-100 text-primary-700 font-semibold shadow'
                    : 'hover:bg-primary-50 text-gray-700'
                }`}
            >
              {item.icon}
              <span className="flex-1">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 h-full overflow-y-auto">
        {selected === 'roles' && <RolesPage />}
        {/* Add more content sections here as you add more settings */}
      </main>
    </div>
  );
}
