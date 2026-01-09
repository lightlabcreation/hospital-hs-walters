import React, { createContext, useContext, useState } from 'react'
import { mockUsers } from '../mock/users'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('hospital_user')
    return savedUser ? JSON.parse(savedUser) : null
  })
  const [role, setRole] = useState(() => {
    return localStorage.getItem('hospital_role') || null
  })

  const login = (email, password, selectedRole = null) => {
    // Mock login logic - allow login with any email/password if role is selected
    // In real app, this would validate credentials
    if (!email || !password) {
      return { success: false, error: 'Email and password are required' }
    }

    // If role is selected, use it; otherwise try to find user
    if (selectedRole) {
      const userData = {
        id: Date.now(),
        email,
        name: email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        role: selectedRole,
      }
      setUser(userData)
      setRole(selectedRole)
      localStorage.setItem('hospital_user', JSON.stringify(userData))
      localStorage.setItem('hospital_role', selectedRole)
      return { success: true, user: userData }
    }

    // Try to find user by credentials
    const foundUser = mockUsers.find(
      (u) => u.email === email && u.password === password
    )

    if (foundUser) {
      const userData = {
        ...foundUser,
        role: foundUser.role,
      }
      setUser(userData)
      setRole(foundUser.role)
      localStorage.setItem('hospital_user', JSON.stringify(userData))
      localStorage.setItem('hospital_role', foundUser.role)
      return { success: true, user: userData }
    }

    return { success: false, error: 'Invalid credentials' }
  }

  const logout = () => {
    setUser(null)
    setRole(null)
    localStorage.removeItem('hospital_user')
    localStorage.removeItem('hospital_role')
  }

  const updateRole = (newRole) => {
    if (user) {
      const updatedUser = { ...user, role: newRole }
      setRole(newRole)
      setUser(updatedUser)
      localStorage.setItem('hospital_user', JSON.stringify(updatedUser))
      localStorage.setItem('hospital_role', newRole)
    }
  }

  const value = {
    user,
    role,
    login,
    logout,
    updateRole,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

