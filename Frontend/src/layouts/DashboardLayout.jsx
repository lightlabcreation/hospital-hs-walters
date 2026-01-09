import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/sidebar/Sidebar'
import Navbar from '../components/navbar/Navbar'
import { useSidebar } from '../context/SidebarContext'

const DashboardLayout = () => {
  const { isCollapsed } = useSidebar()

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <div
        className={`transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'
          } ml-0`}
      >
        <Navbar />
        <main className="pt-28 px-4 pb-4 sm:px-6 sm:pb-6 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout

