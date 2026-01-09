import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI, userAPI } from '../api/services'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token')
      const savedRole = localStorage.getItem('hospital_role')

      if (token && savedRole) {
        try {
          // Verify token by fetching user profile
          const response = await userAPI.getProfile()
          const userData = response.data
          setUser(userData)
          setRole(userData.role)
          localStorage.setItem('hospital_role', userData.role)
        } catch (error) {
          // Token is invalid, clear storage
          console.error('Session validation failed:', error)
          localStorage.removeItem('token')
          localStorage.removeItem('hospital_user')
          localStorage.removeItem('hospital_role')
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email, password) => {
    try {
      // Call login API
      const response = await authAPI.login(email, password)
      const { token, role: userRole } = response.data

      // Store token
      localStorage.setItem('token', token)
      localStorage.setItem('hospital_role', userRole)

      // Fetch user profile
      const profileResponse = await userAPI.getProfile()
      const userData = profileResponse.data

      // Update state
      setUser(userData)
      setRole(userRole)
      localStorage.setItem('hospital_user', JSON.stringify(userData))

      return { success: true, user: userData }
    } catch (error) {
      console.error('Login error:', error)
      const message = error.response?.data?.message || 'Login failed. Please try again.'
      return { success: false, error: message }
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear local state and storage
      setUser(null)
      setRole(null)
      localStorage.removeItem('token')
      localStorage.removeItem('hospital_user')
      localStorage.removeItem('hospital_role')
    }
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
    loading,
    isAuthenticated: !!user && !!localStorage.getItem('token'),
  }

  // Show nothing while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1d627d]"></div>
      </div>
    )
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
