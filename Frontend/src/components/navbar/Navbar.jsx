import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useSidebar } from '../../context/SidebarContext'
import { FiBell, FiLogOut, FiUser, FiMenu, FiX } from 'react-icons/fi'

const Navbar = () => {
  const { user, role, logout } = useAuth()
  const navigate = useNavigate()
  const { isCollapsed, isMobileOpen, toggleMobile } = useSidebar()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav
      className={`bg-[#fff] shadow-md h-16 flex items-center justify-between px-4 lg:px-6 fixed top-0 right-0 z-30 transition-all duration-300 ${isCollapsed ? 'lg:left-20' : 'lg:left-64'
        } left-0`}
    >
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Mobile Menu Button in Navbar */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            toggleMobile()
          }}
          className="lg:hidden bg-white text-gray-800 p-2.5 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-all duration-200 active:scale-95 touch-manipulation z-50 relative"
          aria-label="Toggle menu"
          aria-expanded={isMobileOpen}
          type="button"
        >
          {isMobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
        {/* <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 truncate text-[#1d627d]">HS Walters</h1> */}
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notifications */}
        <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-all duration-200 hover:scale-110 active:scale-95 rounded-lg hover:bg-white/50">
          <FiBell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* User Info */}
        <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-gray-300">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white border border-blue-200 rounded-full flex items-center justify-center shadow-sm">
              <FiUser className="text-[#1d627d]" size={18} />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-bold text-gray-800 tracking-tight">{user?.name || 'User'}</p>
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{role?.toLowerCase().replace('_', ' ') || 'Role'}</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="p-2 text-gray-500 hover:text-red-500 transition-all duration-200 hover:scale-110 active:scale-95 rounded-lg hover:bg-white/50"
            title="Logout"
          >
            <FiLogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

