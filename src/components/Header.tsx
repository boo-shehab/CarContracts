import { useEffect, useRef, useState } from 'react';
import userImg from '../assets/userImage.png';
import { NavLink, useNavigate } from 'react-router-dom';
import { GoBellFill } from 'react-icons/go';
import DownArrow from '../assets/icons/DownArrow';
import { FiMenu } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    console.log('User logged out');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('roles');
    navigate('/login');
  };

  const DropdownMenu = () => (
    <div className="absolute top-10 w-auto left-0 bg-white shadow-md rounded-lg z-50">
      <ul className="flex flex-col text-right">
        <li>
          <NavLink to="/profile" className="block px-4 py-2 hover:bg-gray-100 whitespace-nowrap">
            الملف الشخصي
          </NavLink>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="block w-full text-right px-4 py-2 hover:bg-gray-100 whitespace-nowrap"
          >
            تسجيل الخروج
          </button>
        </li>
      </ul>
    </div>
  );

  return (
    <header className="container mx-auto py-4 px-2 xl:px-2 mb-4 border-b">
      <div className="flex justify-between items-center gap-6 relative">
        <button onClick={() => setIsSidebarOpen(true)} className="xl:hidden text-2xl">
          <FiMenu />
        </button>

        {/* Desktop Section */}
        <div className="hidden xl:flex items-center gap-3 relative" ref={dropdownRef}>
          <button>
            <GoBellFill size={30} className="text-primary-200" />
          </button>
          <img src={userImg} alt="User" className="w-10 h-10 rounded-full object-cover" />
          <span className="text-gray-800 font-medium">محمد علي</span>
          <div
            className="cursor-pointer text-gray-600 text-xl relative"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {showDropdown ? (
              <IoClose size={24} onClick={() => setShowDropdown(false)} />
            ) : (
              <DownArrow />
            )}
            {showDropdown && <DropdownMenu />}
          </div>
        </div>

        <nav>
          <ul className="hidden xl:flex gap-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-lg font-normal ${isActive ? 'text-primary-500 border-b' : ''}`
              }
            >
              الصفحة الرئيسية
            </NavLink>
            <NavLink
              to="/contracts"
              className={({ isActive }) =>
                `text-lg font-normal ${isActive ? 'text-primary-500 border-b' : ''}`
              }
            >
              العقود
            </NavLink>
            <NavLink
              to="/authorizations"
              className={({ isActive }) =>
                `text-lg font-normal ${isActive ? 'text-primary-500 border-b' : ''}`
              }
            >
              التخاويل
            </NavLink>
            <NavLink
              to="/clearance"
              className={({ isActive }) =>
                `text-lg font-normal ${isActive ? 'text-primary-500 border-b' : ''}`
              }
            >
              براءة الذمة
            </NavLink>
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `text-lg font-normal ${isActive ? 'text-primary-500 border-b' : ''}`
              }
            >
              المستخدمين
            </NavLink>
            <NavLink
              to="/payments"
              className={({ isActive }) =>
                `text-lg font-normal ${isActive ? 'text-primary-500 border-b' : ''}`
              }
            >
              مستحقات الدفع
            </NavLink>
            <NavLink
              to="/account-cards"
              className={({ isActive }) =>
                `text-lg font-normal ${isActive ? 'text-primary-500 border-b' : ''}`
              }
            >
              بطاقات الحساب
            </NavLink>
          </ul>
        </nav>

        <h2 className="text-xl font-bold">عقود السيارة</h2>
      </div>

      {/* Sidebar for mobile view */}
      <div
        className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="bg-white h-full p-4 flex flex-col gap-6 relative">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">القائمة</h2>
            <button onClick={() => setIsSidebarOpen(false)}>
              <IoClose size={24} />
            </button>
          </div>

          <div className="flex items-center gap-3 border-b pb-4 relative" ref={dropdownRef}>
            <button>
              <GoBellFill size={24} className="text-primary-200" />
            </button>
            <img src={userImg} alt="User" className="w-8 h-8 rounded-full object-cover" />
            <span className="text-gray-800 font-medium text-lg">محمد علي</span>
            <div
              className="cursor-pointer text-gray-600 text-xl relative"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {showDropdown ? (
                <IoClose size={24} onClick={() => setShowDropdown(false)} />
              ) : (
                <DownArrow />
              )}
              {showDropdown && <DropdownMenu />}
            </div>
          </div>

          <nav className="flex flex-col gap-3 text-right">
            <NavLink
              to="/"
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `text-xl font-normal ${isActive ? 'text-primary-500 border-b' : ''}`
              }
            >
              الصفحة الرئيسية
            </NavLink>
            <NavLink
              to="/contracts"
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `text-xl font-normal ${isActive ? 'text-primary-500 border-b' : ''}`
              }
            >
              العقود
            </NavLink>
            <NavLink
              to="/authorizations"
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `text-xl font-normal ${isActive ? 'text-primary-500 border-b' : ''}`
              }
            >
              التخاويل
            </NavLink>
            <NavLink
              to="/clearance"
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `text-xl font-normal ${isActive ? 'text-primary-500 border-b' : ''}`
              }
            >
              براءة الذمة
            </NavLink>
            <NavLink
              to="/users"
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `text-xl font-normal ${isActive ? 'text-primary-500 border-b' : ''}`
              }
            >
              المستخدمين
            </NavLink>
            <NavLink
              to="/Payments"
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `text-xl font-normal ${isActive ? 'text-primary-500 border-b' : ''}`
              }
            >
              مستحقات الدفع
            </NavLink>
            <NavLink
              to="/account-cards"
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `text-xl font-normal ${isActive ? 'text-primary-500 border-b' : ''}`
              }
            >
              بطاقات الحساب
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
