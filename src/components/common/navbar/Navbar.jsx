// Navbar.jsx
import React, { useContext, useState } from 'react';
import { IoNotificationsOutline } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi";
import { HiMenu } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Navbar({ toggleSidebar }) {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    navigate('/login');
    setShowLogoutModal(false);
    console.log('Logging out...');
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
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
              <span className="text-sm font-medium text-gray-800">
                {user?.name || 'User'}
              </span>
              <span className="text-xs text-gray-500">
                {user?.email || 'No email available'}
              </span>
            </div>
            
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700">
              <FaUserCircle size={24} />
            </div>
            
            <button 
              onClick={handleLogoutClick}
              className="flex items-center space-x-2 text-gray-700 hover:bg-gray-100 hover:text-red-500 p-2 rounded transition-colors"
            >
              <BiLogOut size={20} />
              <span className="hidden sm:inline font-medium">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <BiLogOut className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Confirm Logout
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to logout? You will need to sign in again to access your account.
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={cancelLogout}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;