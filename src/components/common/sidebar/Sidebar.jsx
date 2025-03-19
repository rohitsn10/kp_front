// Sidebar.jsx
import React, { useState } from 'react'
import logoImg from '../../../assets/logo.png'
import { Link, useLocation } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import sidebarConstant from '../../../constants/sidebarRoutes.jsx';

function Sidebar({ isOpen }) {
  const location = useLocation();
  const currPath = location.pathname;  
  const [openDropdown, setOpenDropdown] = useState(null);
  
  const handleToggleDropdown = (itemName) => {
    setOpenDropdown((prev) => (prev === itemName ? null : itemName));
  };

  const SidebarItems = ({item}) => {
    const isActive = currPath === item?.links;
    const hasSubNavActive = item?.subNavs?.some(subItem => currPath === subItem.links);
    
    return(
      <div className="mb-1">
        <Link to={item?.links}>
          <div 
            onClick={() => (item.subNavs ? handleToggleDropdown(item.name) : null)}
            className={`block px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors
              ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}
              ${hasSubNavActive && !isActive ? 'bg-gray-50' : ''}`}
          >
            <div className="flex justify-between items-center">
              <div className='flex flex-row gap-3 items-center'>
                <div className={`h-[22px] w-[22px] flex items-center justify-center
                  ${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
                  {item?.icons}
                </div>
                <span className={`font-medium ${isActive ? 'text-blue-600' : ''}`}>{item?.name}</span>
              </div>  
              {item?.subNavs && (
                <span>{openDropdown === item.name ? <ArrowDropUpIcon/> : <ArrowDropDownIcon/>}</span>
              )}
            </div>
          </div>
        </Link>
        
        {openDropdown === item.name && item.subNavs && (
          <div className="pl-12 space-y-1 mt-1 mb-2">
            {item.subNavs.map((subItem) => {
              const isSubActive = currPath === subItem.links;
              return (
                <Link
                  key={subItem.links}
                  to={subItem.links}
                  className={`block px-4 py-2 rounded-lg transition-colors
                    ${isSubActive 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {subItem.subName}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <aside 
      className={`bg-white shadow-lg border-r border-gray-200 overflow-hidden transition-all duration-300
        h-screen fixed md:sticky top-0 z-30
        ${isOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full md:translate-x-0'}`}
    >
      <div className="h-full flex flex-col">
        <div className='flex flex-col py-6 items-center border-b border-gray-100'>
          <div className="px-4">
            <img className='h-[100px] w-[100px]' src={logoImg} alt="Logo"/>
          </div>
        </div>
        
        <div className="px-3 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
          Navigation
        </div>
        
        <nav className="px-3 flex-1 overflow-y-auto">
          {sidebarConstant.map((item, index) => <SidebarItems key={index} item={item}/>)}
        </nav>
        
        {/* <div className="p-4 border-t border-gray-200">
          <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-500">
            <p className="font-medium text-gray-700 mb-1">Dashboard v1.0</p>
            <p>© 2025 Your Company</p>
          </div>
        </div> */}
      </div>
    </aside>
  )
}

export default Sidebar