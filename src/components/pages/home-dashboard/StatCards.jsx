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
    <div className="col-span-12 lg:col-span-4 my-4 p-2 rounded-md shadow bg-white border  border-stone-300">
        <div className='flex flex-row justify-between'>
            <div className='flex flex-col gap-1'>
                <h2 className='text-xl text-gray-700'>{title}</h2>
                <h2 className='text-2xl font-bold text-[#29346B]'>{value}</h2>
                <div className='flex flex-row gap-2'>
                    <div className='flex'>
                        <p>{trend ==='up'? <TrendingUpIcon style={{ color: 'green' }}/>:<TrendingDownIcon style={{ color: 'red' }}/>}</p>
                        <p className='mx-2'>{pillText}</p>
                    </div>
                    <div>
                        {period}
                    </div>
                </div>
            </div>
            <div className=''>
                <div className='w-24 h-24 flex items-center justify-center'>
                {cardIcon}
                </div>
            </div>
        </div>
        <div>   
            
        </div>
    </div>

    );
  };

function Statcards() {
  return (
    <div className='grid grid-cols-12 gap-8'>
      <Card
        title="Total Projects"
        value="50"
        pillText="5.12 %"
        trend="up"
        period="Since last month"
        cardIcon=<GoProjectRoadmap className='w-[40px] h-[40px] text-blue-400'/>
      />
      <Card
        title="Completed Projects"
        value="25"
        pillText="5.12 %"
        trend="down"
        period="Since last month"
        cardIcon={<FaCircleCheck className='w-[40px] h-[40px] text-green-400'/>}
      />
      <Card
        title="Ongoing Projects"
        value="15"
        pillText="5.12 %"
        trend="down"
        period="Since last month"
        cardIcon={<BsClockHistory className='w-[40px] h-[40px] text-yellow-400'/>}
      />
      </div>
  )
}




export default Statcards