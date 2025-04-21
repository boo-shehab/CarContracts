import React from 'react'
import userImg from '../assets/userImage.png'
import { NavLink } from 'react-router-dom'
import { GoBellFill } from 'react-icons/go'
import DownArrow from '../assets/icons/DownArrow'
import { FiMenu } from 'react-icons/fi'
import { IoClose } from 'react-icons/io5'

const Header = () => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)
  return (
    <header className='container mx-auto py-4 px-2 lg:px-2'>
        <div className='flex justify-between items-center gap-6'>
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-2xl">
                <FiMenu />
            </button>
            <div className='hidden lg:flex items-center gap-6'>
                <div className="flex items-center gap-3">
                    <button>
                        <GoBellFill size={42} className="text-blue-200" />
                    </button>
                    <img src={userImg} alt="User" className="w-10 h-10 rounded-full object-cover" />
                    <span className="text-gray-800 font-medium">محمد علي</span>
                    <div className="cursor-pointer text-gray-600 text-xl"><DownArrow /></div>
                </div>
                <nav>
                <ul className='flex gap-6'>
                    <NavLink to="/" className={({ isActive }) => (`text-xl font-normal ${isActive ? 'text-primary-500 border-b' : ''}`)}>الصفحة الرئيسية</NavLink>
                    <NavLink to="/contracts" className={({ isActive }) => (`text-xl font-normal ${isActive ? 'text-primary-500 border-b' : ''}`)}>العقود</NavLink>
                    <NavLink to="/authorizations" className={({ isActive }) => (`text-xl font-normal ${isActive ? 'text-primary-500 border-b' : ''}`)}>التخاويل</NavLink>
                    <NavLink to="/clearance" className={({ isActive }) => (`text-xl font-normal ${isActive ? 'text-primary-500 border-b' : ''}`)}>براءة الذمة</NavLink>
                    <NavLink to="/users" className={({ isActive }) => (`text-xl font-normal ${isActive ? 'text-primary-500 border-b' : ''}`)}>المستخدمين</NavLink>
                    <NavLink to="/Payments" className={({ isActive }) => (`text-xl font-normal ${isActive ? 'text-primary-500 border-b' : ''}`)}>مستحقات الدفع</NavLink>
                    <NavLink to="/account-cards" className={({ isActive }) => (`text-xl font-normal ${isActive ? 'text-primary-500 border-b' : ''}`)}>بطاقات الحساب</NavLink>
                </ul>
                </nav>
            </div>
            <h2 className='text-2xl font-bold'>عقود السيارة</h2>
        </div>
        {/* Sidebar for mobile view */}
        <div className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${isSidebarOpen? 'translate-x-0' : 'translate-x-full'}`}>
            <div className=" bg-white h-full p-4 flex flex-col gap-6">
                <div className="flex justify-between items-center">
                    <h2 className='text-xl font-bold'>القائمة</h2>
                    <button onClick={() => setIsSidebarOpen(false)} className='left-0'><IoClose size={24} /></button>
                </div>

                <div className="flex items-center gap-3 border-b pb-4">
                    <button>
                        <GoBellFill size={24} className="text-blue-200" />
                    </button>
                    <img src={userImg} alt="User" className="w-8 h-8 rounded-full object-cover" />
                    <span className="text-gray-800 font-medium text-lg">محمد علي</span>
                    <div className="cursor-pointer text-gray-600 text-xl"><DownArrow /></div>
                </div>

                {/* Sidebar Nav */}
                <nav className='flex flex-col gap-3 text-right'>
                    <NavLink to="/" onClick={() => setIsSidebarOpen(false)} className={({ isActive }) => (`inline text-xl font-normal ${isActive ? 'text-primary-500 border-b' : ''}`)}>الصفحة الرئيسية</NavLink>
                    <NavLink to="/contracts" onClick={() => setIsSidebarOpen(false)} className={({ isActive }) => (`text-xl font-normal ${isActive ? 'text-primary-500 border-b' : ''}`)}>العقود</NavLink>
                    <NavLink to="/authorizations" onClick={() => setIsSidebarOpen(false)} className={({ isActive }) => (`text-xl font-normal ${isActive ? 'text-primary-500 border-b' : ''}`)}>التخاويل</NavLink>
                    <NavLink to="/clearance" onClick={() => setIsSidebarOpen(false)} className={({ isActive }) => (`text-xl font-normal ${isActive ? 'text-primary-500 border-b' : ''}`)}>براءة الذمة</NavLink>
                    <NavLink to="/users" onClick={() => setIsSidebarOpen(false)} className={({ isActive }) => (`text-xl font-normal ${isActive ? 'text-primary-500 border-b' : ''}`)}>المستخدمين</NavLink>
                    <NavLink to="/Payments" onClick={() => setIsSidebarOpen(false)} className={({ isActive }) => (`text-xl font-normal ${isActive ? 'text-primary-500 border-b' : ''}`)}>مستحقات الدفع</NavLink>
                    <NavLink to="/account-cards" onClick={() => setIsSidebarOpen(false)} className={({ isActive }) => (`text-xl font-normal ${isActive ? 'text-primary-500 border-b' : ''}`)}>بطاقات الحساب</NavLink>
                </nav>
            </div>
        </div>
    </header>
  )
}

export default Header
