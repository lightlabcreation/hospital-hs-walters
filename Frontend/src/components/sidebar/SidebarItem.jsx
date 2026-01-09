import React from 'react'
import { NavLink } from 'react-router-dom'

const SidebarItem = ({ item, isCollapsed, onItemClick }) => {
  const Icon = item.icon

  const handleClick = (e) => {
    if (onItemClick) {
      onItemClick(e)
    }
  }

  return (
    <NavLink
      to={item.path}
      onClick={handleClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 sm:px-4 py-3 rounded-lg sm:rounded-xl transition-all duration-200 min-h-[48px] cursor-pointer touch-manipulation ${isActive
          ? 'sidebar-active shadow-md'
          : 'text-[#1d627d]/70 hover:text-[#1d627d] hover:bg-white active:bg-white/80'
        }`
      }
    >
      {Icon && <Icon size={22} className="flex-shrink-0" />}
      {!isCollapsed && (
        <span className="truncate text-xs font-black uppercase tracking-widest leading-none">{item.label}</span>
      )}
    </NavLink>
  )
}

export default SidebarItem
