import React from 'react'
import Sidebar from '../components/common/sidebar/Sidebar'
import Statcards from '../components/pages/home-dashboard/statcards'
import RevenueGraph from '../components/pages/home-dashboard/RevenueGraph'
import TurnoverGraph from '../components/pages/home-dashboard/TurnoverGraph'
import UpcomingEvents from '../components/pages/home-dashboard/UpcomingEvents'

function Home() {
  return (
    <div className="grid gap-8 grid-cols-12 px-4 border-2">
      <div className='col-span-12'>
        <Statcards/>
      </div>
      <div className='col-span-12 md:col-span-6 lg:col-span-4 md:max-h-[350px] flex flex-col gap-2 bg-white p-3 rounded-md'>
          <h2 className='text-2xl text-[#29346B] font-semibold'>Energy Matrix Comparison</h2>
          <p className='text-md text-gray-700 mb-2'>Project targets vs. actual energy outputs</p>
          <RevenueGraph/>
      </div>
      <div className='col-span-12 md:col-span-6 lg:col-span-4 md:max-h-[350px] flex flex-col gap-2 bg-white p-3 rounded-md'>
      <h2 className='text-2xl text-[#29346B] font-semibold'>Quarterly Turnover</h2>
          <p className='text-md text-gray-700 mb-2'> Revenue trends over time</p>
          <TurnoverGraph/>
      </div>
      <div className='col-span-12 lg:col-span-4'>
        <UpcomingEvents/>
      </div>
      {/* <div className='col-span-2'>
            <RevenueGraph/>
      </div> */}
    </div>
  )
}

export default Home