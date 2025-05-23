import React, { useContext } from 'react'
import Sidebar from '../components/common/sidebar/Sidebar'
import Statcards from '../components/pages/home-dashboard/StatCards'
import RevenueGraph from '../components/pages/home-dashboard/RevenueGraph'
import TurnoverGraph from '../components/pages/home-dashboard/TurnoverGraph'
import UpcomingEvents from '../components/pages/home-dashboard/UpcomingEvents'
import ProjectListingTable from '../components/pages/home-dashboard/ProjectListingTable'
import CriticalActivityTable from '../components/pages/home-dashboard/CriticalActivityTable'
import { AuthContext } from '../context/AuthContext'

function Home() {
  // console.log(import.meta.env.VITE_API_KEY);
  // const {user,token,permissions} = useContext(AuthContext);
  // console.log("Users",user,"Token",token,"Permissions",permissions)
  
  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      {/* Main container with proper padding and max-width */}
      <div className="max-w-7xl mx-auto  sm:px-6 lg:px-2 py-6">
        <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-12">
          
          {/* Stats Cards - Full width */}
          <div className="lg:col-span-12">
            <Statcards />
          </div>

          {/* Three column section for graphs and events */}
          <div className="lg:col-span-4 col-span-1">
            <div className="h-full max-h-[400px] sm:max-h-[350px] flex flex-col gap-2 bg-white p-3 sm:p-4 rounded-md shadow-sm">
              <h2 className="text-xl sm:text-2xl text-[#29346B] font-semibold">
                Energy Matrix Comparison
              </h2>
              <p className="text-sm sm:text-md text-gray-700 mb-2">
                Project targets vs. actual energy outputs
              </p>
              <div className="flex-1 overflow-hidden">
                <RevenueGraph />
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 col-span-1">
            <div className="h-full max-h-[400px] sm:max-h-[350px] flex flex-col gap-2 bg-white p-3 sm:p-4 rounded-md shadow-sm">
              <h2 className="text-xl sm:text-2xl text-[#29346B] font-semibold">
                Quarterly Turnover
              </h2>
              <p className="text-sm sm:text-md text-gray-700 mb-2">
                Revenue trends over time
              </p>
              <div className="flex-1 overflow-hidden">
                <TurnoverGraph />
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 col-span-1">
            <div className="h-full max-h-[400px] sm:max-h-[350px]">
              <UpcomingEvents />
            </div>
          </div>

          {/* Two column section for tables */}
          <div className="lg:col-span-6 col-span-1">
            <div className="bg-white rounded-md p-3 sm:p-4 shadow-sm h-full">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 py-3">
                <h2 className="text-2xl sm:text-3xl text-[#29346B] font-semibold">
                  Project Listing
                </h2>
                <button className="bg-orange-400 hover:bg-orange-500 rounded-md text-white px-3 py-2 text-sm sm:text-base whitespace-nowrap transition-colors">
                  View all
                </button>
              </div>
              <div className="overflow-x-auto">
                <ProjectListingTable />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 col-span-1">
            <div className="bg-white rounded-md p-3 sm:p-4 shadow-sm h-full">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 py-3">
                <h2 className="text-2xl sm:text-3xl text-[#29346B] font-semibold">
                  Critical Activity Listing
                </h2>
                <button className="bg-orange-400 hover:bg-orange-500 rounded-md text-white px-3 py-2 text-sm sm:text-base whitespace-nowrap transition-colors">
                  View all
                </button>
              </div>
              <div className="overflow-x-auto">
                <CriticalActivityTable />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home