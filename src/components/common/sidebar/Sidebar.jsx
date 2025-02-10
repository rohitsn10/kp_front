import React, { useState } from 'react'
import logoImg from '../../../assets/logo.png'
import { Link, useLocation, useNavigation } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
function Sidebar() {
  const location = useLocation();
  const currPath = location.pathname;
  const sidebarConstant=[
    {
      name:'Home',
      icons:<svg width="24" height="24" viewBox="0 0 26 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 21H17M9 21V15.4444M9 21H1.8C1.58783 21 1.38434 20.9298 1.23431 20.8047C1.08429 20.6797 1 20.5101 1 20.3333V16.1111C1 15.9343 1.08429 15.7647 1.23431 15.6397C1.38434 15.5147 1.58783 15.4444 1.8 15.4444H9M17 21V7.66667M17 21H24.2C24.4122 21 24.6157 20.9298 24.7657 20.8047C24.9157 20.6797 25 20.5101 25 20.3333V1.66667C25 1.48986 24.9157 1.32029 24.7657 1.19526C24.6157 1.07024 24.4122 1 24.2 1H17.8C17.5878 1 17.3843 1.07024 17.2343 1.19526C17.0843 1.32029 17 1.48986 17 1.66667V7.66667M9 15.4444V8.33333C9 8.15652 9.08429 7.98695 9.23431 7.86193C9.38434 7.7369 9.58783 7.66667 9.8 7.66667H17" stroke="#7220B0" stroke-width="1.5"/>
    </svg>,
      links:"/"
    },
    {
      name:'Land Bank',
      icons:<svg width="24" height="24" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.16666 2.58337H25.8333C27.2542 2.58337 28.4167 3.74587 28.4167 5.16671V12.9167H12.9167V25.8334H18.7937C19.0262 26.2209 19.2587 26.5825 19.4912 26.9184C19.8658 27.4738 20.2275 27.9775 20.5633 28.4167H5.16666C3.74583 28.4167 2.58333 27.2542 2.58333 25.8334V5.16671C2.58333 3.74587 3.74583 2.58337 5.16666 2.58337ZM10.3333 5.16671H5.16666V18.0834H10.3333V5.16671ZM5.16666 20.6667V25.8334H10.3333V20.6667H5.16666ZM12.9167 10.3334H25.8333V5.16671H12.9167V10.3334ZM23.8958 28.4167C23.8958 28.4167 23.1467 27.5771 22.2554 26.363C22.1392 26.195 22.01 26.0142 21.8808 25.8334C20.6667 24.1025 19.375 21.8163 19.375 20.0209C19.375 17.5667 21.4417 15.5 23.8958 15.5C24.5804 15.5 25.2392 15.668 25.8333 15.9521C27.3446 16.6884 28.4167 18.2513 28.4167 20.0209C28.4167 22.01 26.8279 24.5934 25.5362 26.363C24.645 27.5771 23.8958 28.4167 23.8958 28.4167ZM22.3458 20.15C22.3458 20.925 22.9917 21.7 23.8958 21.7C24.8 21.7 25.575 20.925 25.4458 20.15C25.4458 19.375 24.6708 18.6 23.8958 18.6C23.1208 18.6 22.3458 19.2459 22.3458 20.15Z" fill="#14AE5C"/>
      </svg>
      ,
      links:"/landbank"
    },
    {
      name: 'SFA',
      icons: <img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-map-icon.png" alt="Location" width="40" height="40" />,
      links: "/sfa-page"
    },  
    {
      name: 'Document Management',
      icons: <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTS08KOBuqfP4UnLQ6StvxJnp-qJ5w-Y9zC3Q&s" alt="Document" width="40" height="40" />,
      links: "/documents"
    },   
    {
      name:'User',
      icons:<svg width="24" height="24" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 0C14.7239 0 16.3772 0.684819 17.5962 1.90381C18.8152 3.12279 19.5 4.77609 19.5 6.5C19.5 8.22391 18.8152 9.87721 17.5962 11.0962C16.3772 12.3152 14.7239 13 13 13C11.2761 13 9.62279 12.3152 8.40381 11.0962C7.18482 9.87721 6.5 8.22391 6.5 6.5C6.5 4.77609 7.18482 3.12279 8.40381 1.90381C9.62279 0.684819 11.2761 0 13 0ZM13 3.25C12.138 3.25 11.3114 3.59241 10.7019 4.2019C10.0924 4.8114 9.75 5.63805 9.75 6.5C9.75 7.36195 10.0924 8.1886 10.7019 8.7981C11.3114 9.40759 12.138 9.75 13 9.75C13.862 9.75 14.6886 9.40759 15.2981 8.7981C15.9076 8.1886 16.25 7.36195 16.25 6.5C16.25 5.63805 15.9076 4.8114 15.2981 4.2019C14.6886 3.59241 13.862 3.25 13 3.25ZM13 14.625C17.3388 14.625 26 16.7862 26 21.125V26H0V21.125C0 16.7862 8.66125 14.625 13 14.625ZM13 17.7125C8.17375 17.7125 3.0875 20.085 3.0875 21.125V22.9125H22.9125V21.125C22.9125 20.085 17.8263 17.7125 13 17.7125Z" fill="#F88141"/>
      </svg>
      ,
      links:"/user"
    },
    {
      name:'Project',
      icons:<svg width="24" height="24" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 13V5M6.33333 15.6667V5M19.6667 18.3333V5M4.2 1H21.8C22.6487 1 23.4626 1.33714 24.0627 1.93726C24.6629 2.53737 25 3.35131 25 4.2V21.8C25 22.6487 24.6629 23.4626 24.0627 24.0627C23.4626 24.6629 22.6487 25 21.8 25H4.2C3.35131 25 2.53737 24.6629 1.93726 24.0627C1.33714 23.4626 1 22.6487 1 21.8V4.2C1 3.77977 1.08277 3.36365 1.24359 2.97541C1.4044 2.58717 1.64011 2.23441 1.93726 1.93726C2.53737 1.33714 3.35131 1 4.2 1Z" stroke="#C12463" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>          
      ,
      links:"/project",
      subNavs:[{
        subName:'Category',
        links:'/project/categories'
      },
      {
        subName:'Main activities',
        links:'/project/main-activities'
      },
      {
        subName:'Sub-activities',
        links:'/project/sub-activities'
      },
      {
        subName:'Multiple activities',
        links:'/project/multiple-activities'
      }
      ]
    },
    {
      name: 'Material Management',
      icons: <img src="https://cdn.iconscout.com/icon/premium/png-256-thumb/raw-material-4186345-3472642.png" alt="material" width="100" height="100" />,
      links: "/material-management"
    },     
    {
      name:'Tracking',
      icons:<svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M25.6667 2.33337H2.33333V25.6667H25.6667V2.33337ZM23.3333 4.66671V12.8334H20.3537L17.9958 16.6052L11.1533 7.48187L6.47033 12.8334H4.66666V4.66671H23.3333ZM4.66666 15.1667H7.52966L11.0133 11.1849L18.1708 20.7282L21.6475 15.1667H23.3333V23.3334H4.66666V15.1667Z" fill="#FB3B42"/>
      </svg>
      ,
      links:"/tracking"
    },
    {
      name:'Reports',
      icons:<svg width="24" height="24" viewBox="0 0 26 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 21H17M9 21V15.4444M9 21H1.8C1.58783 21 1.38434 20.9298 1.23431 20.8047C1.08429 20.6797 1 20.5101 1 20.3333V16.1111C1 15.9343 1.08429 15.7647 1.23431 15.6397C1.38434 15.5147 1.58783 15.4444 1.8 15.4444H9M17 21V7.66667M17 21H24.2C24.4122 21 24.6157 20.9298 24.7657 20.8047C24.9157 20.6797 25 20.5101 25 20.3333V1.66667C25 1.48986 24.9157 1.32029 24.7657 1.19526C24.6157 1.07024 24.4122 1 24.2 1H17.8C17.5878 1 17.3843 1.07024 17.2343 1.19526C17.0843 1.32029 17 1.48986 17 1.66667V7.66667M9 15.4444V8.33333C9 8.15652 9.08429 7.98695 9.23431 7.86193C9.38434 7.7369 9.58783 7.66667 9.8 7.66667H17" stroke="#7220B0" stroke-width="1.5"/>
      </svg>      
      ,
      links:"/reports"
    },
    {
      name:'Master',
      icons:<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 20H21V22H3V20ZM21 19H3L2.147 7.81C1.82313 7.65728 1.5462 7.42042 1.34513 7.12414C1.14405 6.82787 1.0262 6.48304 1.00389 6.12567C0.981573 5.7683 1.05561 5.41149 1.21827 5.0925C1.38092 4.77351 1.62623 4.50404 1.92859 4.31222C2.23094 4.1204 2.57925 4.01327 2.93714 4.00201C3.29503 3.99076 3.64937 4.07579 3.96318 4.24823C4.27699 4.42068 4.53875 4.6742 4.72113 4.98234C4.90351 5.29048 4.99982 5.64193 5 6C4.99955 6.10046 4.99152 6.20075 4.976 6.3L7.713 8.489L10.275 4.003C10.0942 3.69973 9.99918 3.35306 10 3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3C14.0007 3.3535 13.9053 3.70054 13.724 4.004L16.282 8.489L19.023 6.299C19.0079 6.20005 19.0002 6.1001 19 6C19.0002 5.64193 19.0965 5.29048 19.2789 4.98234C19.4613 4.6742 19.723 4.42068 20.0368 4.24823C20.3506 4.07579 20.705 3.99076 21.0629 4.00201C21.4208 4.01327 21.7691 4.1204 22.0714 4.31222C22.3738 4.50404 22.6191 4.77351 22.7817 5.0925C22.9444 5.41149 23.0184 5.7683 22.9961 6.12567C22.9738 6.48304 22.8559 6.82787 22.6549 7.12414C22.4538 7.42042 22.1769 7.65728 21.853 7.81L21 19ZM4.92 17H19.08L19.81 8.23L15.704 11.511L12 5.017L8.29 11.511L4.19 8.231L4.92 17Z" fill="#FFCD29"/>
      </svg>
      ,
      links:"/master"
    },

  ]
  const [openDropdown, setOpenDropdown] = useState(null);
  const handleToggleDropdown = (itemName) => {
    setOpenDropdown((prev) => (prev === itemName ? null : itemName));
  };

const SidebarItems= ({item})=>{
  return(
    <Link to={item?.links}>
      <div 
        onClick={() => (item.subNavs ? handleToggleDropdown(item.name) : null)}
       className={`block px-4 py-3 rounded cursor-pointer hover:bg-gray-200 text-gray-700 ${currPath==item?.links? 'bg-gray-200':''}`}>
      <div className="flex justify-between items-center">
        <div className='flex flex-row gap-4'>
          <div className="h-[20px] w-[20px]">{item?.icons}</div>
          <span>{item?.name}</span>
        </div>  
          {item?.subNavs && (
                <span>{openDropdown === item.name ? <ArrowDropUpIcon/> : <ArrowDropDownIcon/>}</span>
              )}
        </div>
      </div>
      {/* {openDropdown === item.name && item.subNavs && ( */}
      {openDropdown === item.name && item.subNavs && (
          <div className="pl-8 space-y-1">
            {item.subNavs.map((subItem) => (
              <Link
                key={subItem.links}
                to={subItem.links}
                className={`block px-4 py-2 rounded hover:bg-gray-200 text-gray-600 ${
                  currPath === subItem.links ? 'bg-gray-200' : ''
                }`}
              >
                {subItem.subName}
              </Link>
            ))}
          </div>
        )}
    </Link>
  ) 
}

  return (
    <aside className="w-60 bg-white shadow-lg fixed h-full border-r border-gray-300  overflow-y-auto">
      <div className='flex flex-col mt-4 items-center gap-1'>
        <div>
          <img className='h-[120px] w-[120px]' src={logoImg}/>
        </div>
      </div>
      <nav className="p-4 space-y-2">
        {sidebarConstant.map((item,index)=><SidebarItems key={index} item={item}/>)}
      </nav>
  </aside>
  )
}

export default Sidebar