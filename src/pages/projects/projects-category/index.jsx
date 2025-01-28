import React, { useState } from 'react'

function ProjectCategoryPage() {
    const [categoryFilter,setCategoryFilter]=useState()
  return (
    <div className='bg-white p-4 w-[80%] mx-auto my-8 rounded-md'>
        <div className='flex flex-row '>
            <div className='grid grid-cols-3 '>
                <input 
                className='shadow-lg shadow-slate-300 border border-gray-200 outline-none p-1 rounded-md'
                value={categoryFilter} placeholder='Search' 
                onChange={(e)=>setCategoryFilter(e.target.value())}/>
                <h2>
                    Category Listing
                </h2>
                <button>
                    Add Category
                </button>
            </div>
        </div>
    </div>
  )
}

export default ProjectCategoryPage