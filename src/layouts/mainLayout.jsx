// MainLayout.jsx
import React, { useState } from 'react'
import Sidebar from '../components/common/sidebar/Sidebar'
import Navbar from '../components/common/navbar/Navbar'
import backgroundImage from '../assets/mainBackgroundImage.png'

function MainLayout({children}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = () => {
    if (window.innerWidth < 768) { // 768px is the md breakpoint in Tailwind
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={handleOverlayClick}
        ></div>
      )}
      
      <Sidebar isOpen={sidebarOpen} />
      
      <main 
        className="flex-1 flex flex-col overflow-hidden transition-all duration-300"
      >
        <Navbar toggleSidebar={toggleSidebar} />
        
        <div 
          style={{
            backgroundImage: `url(${backgroundImage})`
          }} 
          className="flex-1 overflow-y-auto bg-cover bg-center"
        >
          <div className="min-h-full bg-gray-700 bg-opacity-35 px-4 md:px-4 py-2">
            <div className="max-w-8xl mx-auto">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default MainLayout