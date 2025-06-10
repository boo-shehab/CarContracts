import { useEffect, useRef, useState } from 'react';
import userImg from '../assets/userImage.png';
import { NavLink, useNavigate } from 'react-router-dom';
import { GoBellFill } from 'react-icons/go';
import DownArrow from '../assets/icons/DownArrow';
import { FiMenu } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import { useSelector } from 'react-redux';

const AdminHeader = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);

  const { user } = useSelector((state: any) => state.auth);

  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !(dropdownRef.current as any).contains(e.target)) {
        setIsDropdownOpen(false);
      }
      if (mobileDropdownRef.current && !(mobileDropdownRef.current as any).contains(e.target)) {
        setIsMobileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    console.log('User logged out');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('roles');
    navigate('/login');
    setIsDropdownOpen(false);
    setIsMobileDropdownOpen(false);
    setIsSidebarOpen(false);
  };

  const DropdownMenu = () => (
    <div className="absolute top-10 w-auto left-0 bg-white shadow-md rounded-lg z-50">
      <ul className="flex flex-col text-right">
        <li>
          <NavLink
            to="/adminDashboard/profile"
            className="block px-4 py-2 hover:bg-gray-100 whitespace-nowrap"
          >
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
    <header className="container mx-auto py-4 px-2 lg:px-2 mb-4 border-b border-neutral-100">
      <div className="flex justify-between items-center gap-6">
        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-2xl">
          <FiMenu />
        </button>

        <div className="flex items-center gap-6 relative" ref={dropdownRef}>
          <div className="hidden lg:flex items-center gap-3">
            <button>
              <GoBellFill size={30} className="text-primary-200" />
            </button>
            <img
              src={user?.imageUrl || userImg}
              alt="User"
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="text-gray-800 font-medium">{user?.username || 'مدير الادارة'}</span>
            <div
              className="text-gray-600 text-xl relative cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {isDropdownOpen ? (
                <IoClose size={24} onClick={() => setIsDropdownOpen(false)} />
              ) : (
                <DownArrow />
              )}
              {isDropdownOpen && <DropdownMenu />}
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold">عقود السيارة</h2>
      </div>

      {/* Sidebar for mobile view */}
      <div
        className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="bg-white h-full p-4 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">القائمة</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="left-0">
              <IoClose size={24} />
            </button>
          </div>

          <div className="flex items-center gap-3 border-b pb-4 relative" ref={mobileDropdownRef}>
            <button>
              <GoBellFill size={24} className="text-primary-200" />
            </button>

            <img
              src={user?.imageUrl || userImg}
              alt="User"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-gray-800 font-medium text-lg">
              {user?.username || 'مدير الادارة'}
            </span>
            <div
              className="text-gray-600 text-xl relative cursor-pointer"
              onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
            >
              {isMobileDropdownOpen ? (
                <IoClose size={24} onClick={() => setIsMobileDropdownOpen(false)} />
              ) : (
                <DownArrow />
              )}
              {isMobileDropdownOpen && <DropdownMenu />}
            </div>
          </div>

          <nav className="flex flex-col gap-3 text-right">
            <NavLink
              to="/adminDashboard"
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `inline text-xl font-normal ${isActive ? 'text-primary-500 border-b' : ''}`
              }
            >
              الصفحة الرئيسية
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
