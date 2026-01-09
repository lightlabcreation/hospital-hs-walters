import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { menuConfig } from '../../mock/menu'
import SidebarItem from './SidebarItem'
import { useSidebar } from '../../context/SidebarContext'
import { FiMenu, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const Sidebar = () => {
  const { role } = useAuth()
  const { isCollapsed, isMobileOpen, toggleSidebar, toggleMobile, closeMobile } = useSidebar()

  const menuItems = role ? menuConfig[role] || [] : []

  return (
    <>
      {/* Mobile Overlay - Must be outside sidebar for proper z-index */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-[#90e0ef] border-r border-[#00b4d8]/20 transition-all duration-300 z-50 shadow-lg ${isCollapsed && !isMobileOpen ? 'w-20' : 'w-64'
          } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        <div className="flex flex-col h-full relative z-50">
          {/* Logo/Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#00b4d8]/10 flex-shrink-0">
            {(!isCollapsed || isMobileOpen) && (
              <h2 className="text-[#1d627d] text-2xl font-black italic tracking-tighter uppercase">HS Walters</h2>
            )}
            <div className="flex items-center gap-2">
              {/* Mobile Close Button */}
              {isMobileOpen && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    closeMobile()
                  }}
                  className="lg:hidden flex items-center justify-center w-10 h-10 text-gray-500 hover:text-gray-800 hover:bg-white rounded-lg transition-all duration-200 active:scale-95"
                  aria-label="Close menu"
                >
                  <FiX size={24} />
                </button>
              )}
              {/* Desktop Collapse Button */}
              <button
                onClick={toggleSidebar}
                className="hidden lg:flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-800 hover:bg-white rounded-lg transition-all duration-200"
                title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {isCollapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1 sm:space-y-2">
            {menuItems.length > 0 ? (
              menuItems.map((item, index) => (
                <SidebarItem
                  key={`${item.path}-${index}`}
                  item={item}
                  isCollapsed={isCollapsed && !isMobileOpen}
                  onItemClick={closeMobile}
                />
              ))
            ) : (
              <div className="text-gray-400 text-sm p-4">
                No menu items available
              </div>
            )}
          </nav>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
