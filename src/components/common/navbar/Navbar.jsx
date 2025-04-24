// Navbar.jsx
import React, { useContext } from 'react';
import { IoNotificationsOutline } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi";
import { HiMenu } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Navbar({ toggleSidebar }) {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    // Add your logout logic here
    logout();
    navigate('/login')
    console.log('Logging out...');
  };

  return (
    <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-10">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="text-gray-700 mr-4 md:hidden focus:outline-none hover:bg-gray-100 p-2 rounded-md transition-colors"
        >
          <HiMenu size={24} />
        </button>
        <h1 className="text-lg font-medium text-gray-800 hidden sm:block">Dashboard</h1>
      </div>

      <div className="flex items-center space-x-3">
        <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-full relative transition-colors">
          <IoNotificationsOutline size={24} />
          <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center border-2 border-white">
            3
          </span>
        </button>
        
        <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block"></div>
        
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-medium text-gray-800">Admin User</span>
            <span className="text-xs text-gray-500">admin@example.com</span>
          </div>
          
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700">
            <FaUserCircle size={24} />
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 text-gray-700 hover:bg-gray-100 hover:text-red-500 p-2 rounded transition-colors"
          >
            <BiLogOut size={20} />
            <span className="hidden sm:inline font-medium">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;