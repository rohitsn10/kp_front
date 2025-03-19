import React, { useContext } from 'react'
import Sidebar from '../components/common/sidebar/Sidebar'
import Statcards from '../components/pages/home-dashboard/statcards'
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
    <div className="grid gap-8 grid-cols-12 px-4">
      <div className='col-span-12'>
        <Statcards/>
      </div>
      <div className='col-span-12  lg:col-span-4 md:max-h-[350px] flex flex-col gap-2 bg-white p-3 rounded-md'>
          <h2 className='text-2xl text-[#29346B] font-semibold'>Energy Matrix Comparison</h2>
          <p className='text-md text-gray-700 mb-2'>Project targets vs. actual energy outputs</p>
          <RevenueGraph/>
      </div>
      <div className='col-span-12 lg:col-span-4 md:max-h-[350px] flex flex-col gap-2 bg-white p-3 rounded-md'>
      <h2 className='text-2xl text-[#29346B] font-semibold'>Quarterly Turnover</h2>
          <p className='text-md text-gray-700 mb-2'> Revenue trends over time</p>
          <TurnoverGraph/>
      </div>
      <div className='col-span-12 lg:col-span-4 md:max-h-[350px]'>
        <UpcomingEvents/>
      </div>
        <div className='col-span-12 lg:col-span-6 bg-white rounded-md p-3'>
          <div className='flex flex-row justify-between py-3'>
            <h2 className='text-3xl text-[#29346B] font-semibold py-1'>Project Listing</h2>
            <button className='bg-orange-400 hover:bg-orange-500 rounded-md text-white px-3 py-1'>View all</button>
          </div>

          <ProjectListingTable  />
        </div>
          <div className='col-span-12 lg:col-span-6 bg-white rounded-md p-3'>
            <div className='flex flex-row justify-between py-3'>
              <h2 className='text-3xl text-[#29346B] font-semibold py-1'>Critical Activity Listing</h2>
              <button className='bg-orange-400 hover:bg-orange-500 rounded-md text-white px-3 py-1'>View all</button>
            </div>
            <CriticalActivityTable/>
        </div>
        
    </div>
  )
}

export default Home