// Sidebar.jsx
import React, { useContext, useState, useMemo } from 'react'
import logoImg from '../../../assets/logo.png'
import { Link, useLocation } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import sidebarConstant from '../../../constants/sidebarRoutes.jsx';
import { AuthContext } from '../../../context/AuthContext.jsx';

// ============================================
// PERMISSION CONFIGURATION
// ============================================
const TEAM_PERMISSIONS = {
  ADMIN: ['Home', 'Land Bank', 'SFA', 'Document Management', 'User', 'Project', 
          'Quality Assurance', 'Hoto', 'HSE', 'Design & Documents', 'Reports', 
          'General', 'Material Management'],
  
  LAND_TEAM: ['Home', 'Land Bank', 'SFA', 'Reports'],
  
  PROJECT_TEAM: ['Land Bank', 'SFA', 'Project', 'Reports'],
  
  HOTO_TEAM: ['Home', 'Hoto', 'Reports']
};

// Group mappings
const GROUP_MAPPINGS = {
  // Admin
  'ADMIN': 'ADMIN',
  
  // Land Team Groups
  'LAND_HOD_FULL': 'LAND_TEAM',
  'LAND_EXECUTIVE_FULL': 'LAND_TEAM',
  'LAND_MANAGER_FULL': 'LAND_TEAM',
  
  // Project Team Groups
  'PROJECT_HOD_FULL': 'PROJECT_TEAM',
  'PROJECT_ENGINEER_FULL': 'PROJECT_TEAM',
  'PROJECT_ENGINEER': 'PROJECT_TEAM',
  'PROJECT_MANAGER_FULL': 'PROJECT_TEAM',
  
  // HOTO Team Groups
  'HOD_TEAM': 'HOTO_TEAM',
  'O&M_TEAM': 'HOTO_TEAM'
};

function Sidebar({ isOpen }) {
  const location = useLocation();
  const currPath = location.pathname;  
  const [openDropdown, setOpenDropdown] = useState(null);
  const { user, token, permissions } = useContext(AuthContext);
  
  console.log("Permissions>>", permissions);
  console.log("Group from permissions>>", permissions?.groups);

  // Determine user's teams and allowed menu items (handles multiple groups)
  const { userTeams, allowedMenuItems } = useMemo(() => {
    const userGroups = permissions?.groups || [];
    
    // If no groups, show only home
    if (userGroups.length === 0) {
      return { 
        userTeams: ['NONE'], 
        allowedMenuItems: ['Home'] 
      };
    }

    // Extract group names from user's groups array
    const userGroupNames = userGroups.map(group => group.name.toUpperCase());
    
    console.log("User Group Names>>", userGroupNames);

    // Collect all teams the user belongs to
    const teamsSet = new Set();
    
    // Check if user is ADMIN first (if admin, show everything)
    if (userGroupNames.includes('ADMIN')) {
      teamsSet.add('ADMIN');
    } else {
      // Check all group memberships and collect teams
      userGroupNames.forEach(groupName => {
        if (GROUP_MAPPINGS[groupName]) {
          teamsSet.add(GROUP_MAPPINGS[groupName]);
        }
      });
    }

    const teams = Array.from(teamsSet);
    console.log("User belongs to teams>>", teams);

    // If user is ADMIN, they get all permissions
    if (teams.includes('ADMIN')) {
      return {
        userTeams: teams,
        allowedMenuItems: TEAM_PERMISSIONS.ADMIN
      };
    }

    // Combine permissions from all teams (union of all allowed items)
    const combinedMenuItems = new Set();
    
    teams.forEach(team => {
      const teamPermissions = TEAM_PERMISSIONS[team] || [];
      teamPermissions.forEach(item => combinedMenuItems.add(item));
    });

    const allowedItems = Array.from(combinedMenuItems);
    console.log("Combined allowed menu items>>", allowedItems);
    
    return { 
      userTeams: teams.length > 0 ? teams : ['NONE'], 
      allowedMenuItems: allowedItems.length > 0 ? allowedItems : ['Home']
    };
  }, [permissions]);

  // Filter sidebar items based on allowed menu items
  const filteredSidebarItems = useMemo(() => {
    return sidebarConstant.filter(item => 
      allowedMenuItems.includes(item.name)
    );
  }, [allowedMenuItems]);

  const handleToggleDropdown = (itemName) => {
    setOpenDropdown((prev) => (prev === itemName ? null : itemName));
  };

  const SidebarItems = ({ item }) => {
    const isActive = currPath === item?.links;
    const hasSubNavActive = item?.subNavs?.some(subItem => currPath === subItem.links);
    
    return (
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
          Navigation {userTeams[0] !== 'NONE' && `(${userTeams.join(', ')})`}
        </div>
        
        <nav className="px-3 flex-1 overflow-y-auto">
          {filteredSidebarItems.map((item, index) => (
            <SidebarItems key={index} item={item}/>
          ))}
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar