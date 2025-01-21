import React from 'react'

function Home() {
  return (
    <div className="flex h-screen pt-10">
        <aside className="w-64 bg-white shadow-lg fixed h-full">
          <nav className="p-4 space-y-2">
            <a href="#" className="block px-4 py-2 rounded hover:bg-gray-100 text-gray-700">
              Dashboard
            </a>
            <a href="#" className="block px-4 py-2 rounded hover:bg-gray-100 text-gray-700">
              Analytics
            </a>
            <a href="#" className="block px-4 py-2 rounded hover:bg-gray-100 text-gray-700">
              Reports
            </a>
            <a href="#" className="block px-4 py-2 rounded hover:bg-gray-100 text-gray-700">
              Settings
            </a>
          </nav>
        </aside>
        <main className="flex-1 ml-64 p-8 overflow-y-auto h-[calc(100vh-64px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          </div>
        </main>
    </div>
  )
}

export default Home