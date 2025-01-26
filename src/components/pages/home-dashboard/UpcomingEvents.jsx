import React from 'react'

function UpcomingEvents() {
    const events = [
        {
            date:'04/March/24',
            eventName:'Event 1',
            link:'/'
        },
        {
            date:'01/May/24',
            eventName:'Event 2',
            link:'/'
        },
        {
            date:'02/August/24',
            eventName:'Event 3',
            link:'/'
        }
    ]
    const colorPallete=['#FEE5B8','#F9D2E2','#FADAC3','#FEE5B8','#F9D2E2','#FADAC3']
  return (
    <div className='bg-white rounded-md p-3 '>
        <h2 className='text-2xl text-[#29346B] font-semibold'>Upcoming Events</h2>
        {events?.map((item,index)=>
        <div key={index} className={`rounded-md flex flex-col gap-1 shadow-md m-2 p-3 cursor-pointer`}>
            <h2 className='text-xl text-[#29346B] font-semibold'>{item.date}</h2>
            <p className='text-lg text-gray-800'>{item.eventName}</p>
        </div>)}
    </div>
  )
}

export default UpcomingEvents