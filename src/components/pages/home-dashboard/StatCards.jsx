import React from 'react'
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { GoProjectRoadmap } from "react-icons/go";
import { FaCircleCheck } from "react-icons/fa6";
import { BsClockHistory } from "react-icons/bs";

const Card = ({
    title,
    value,
    pillText,
    trend,
    period,
    cardIcon
  }) => {
    return (
    <div className="col-span-12 lg:col-span-4 my-4 p-4 rounded-md shadow bg-white border border-stone-300">
        <div className='flex flex-row justify-between items-start'>
            <div className='flex flex-col gap-2 flex-1'>
                <h2 className='text-lg sm:text-xl text-gray-700'>{title}</h2>
                <h2 className='text-2xl sm:text-3xl font-bold text-[#29346B]'>{value}</h2>
                <div className='flex flex-col sm:flex-row gap-2 sm:gap-4'>
                    <div className='flex items-center gap-1'>
                        <span className='flex items-center'>
                            {trend === 'up' ? 
                                <TrendingUpIcon style={{ color: 'green', fontSize: '18px' }}/> : 
                                <TrendingDownIcon style={{ color: 'red', fontSize: '18px' }}/>
                            }
                        </span>
                        <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            {pillText}
                        </span>
                    </div>
                    <div className='text-sm text-gray-500'>
                        {period}
                    </div>
                </div>
            </div>
            <div className='flex-shrink-0 ml-4'>
                <div className='w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex items-center justify-center bg-gray-50 rounded-lg'>
                    {cardIcon}
                </div>
            </div>
        </div>
    </div>
    );
};

function Statcards() {
  return (
    <div className='grid grid-cols-12 gap-4 sm:gap-6 lg:gap-8'>
      <Card
        title="Total Projects"
        value="50"
        pillText="5.12%"
        trend="up"
        period="Since last month"
        cardIcon={<GoProjectRoadmap className='w-8 h-8 sm:w-10 sm:h-10 text-blue-500'/>}
      />
      <Card
        title="Completed Projects"
        value="25"
        pillText="5.12%"
        trend="down"
        period="Since last month"
        cardIcon={<FaCircleCheck className='w-8 h-8 sm:w-10 sm:h-10 text-green-500'/>}
      />
      <Card
        title="Ongoing Projects"
        value="15"
        pillText="5.12%"
        trend="down"
        period="Since last month"
        cardIcon={<BsClockHistory className='w-8 h-8 sm:w-10 sm:h-10 text-yellow-500'/>}
      />
    </div>
  )
}

export default Statcards