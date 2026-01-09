import React, { createContext, useContext, useState } from 'react'

const SidebarContext = createContext(null)

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider')
  }
  return context
}

export const SidebarProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const toggleMobile = () => {
    setIsMobileOpen(prev => !prev)
  }

  const closeMobile = () => {
    setIsMobileOpen(false)
  }

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        isMobileOpen,
        toggleSidebar,
        toggleMobile,
        closeMobile,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

