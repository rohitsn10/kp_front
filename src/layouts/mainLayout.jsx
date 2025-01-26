import React from 'react'
import Sidebar from '../components/common/sidebar/Sidebar'
import backgroundImage from '../assets/mainBackgroundImage.png'
function MainLayout({children}) {
  return (
    <div className="flex h-screen">
    <Sidebar/>
    <main style={{
        backgroundImage:`url(${backgroundImage})`
      }} className="flex-1 ml-60 overflow-y-auto h-[calc(100vh)] bg-cover bg-center">
        <div className='min-w-[100%] min-h-[100%] border bg-gray-700 bg-opacity-35'>
      {/* <div  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> */}
      <div  className="">
        {children}
      </div>
      </div>
    </main>
</div>
  )
}

export default MainLayout