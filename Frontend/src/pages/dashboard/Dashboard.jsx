import React from 'react'
import { useAuth } from '../../context/AuthContext'
import SuperAdminDashboard from './SuperAdminDashboard'
import DoctorDashboard from './DoctorDashboard'
import ReceptionistDashboard from './ReceptionistDashboard'
import BillingDashboard from './BillingDashboard'
import PatientDashboard from './PatientDashboard'

const Dashboard = () => {
  const { role, user } = useAuth()

  const renderDashboard = () => {
    switch (role) {
      case 'super_admin':
        return <SuperAdminDashboard />
      case 'doctor':
        return <DoctorDashboard />
      case 'receptionist':
        return <ReceptionistDashboard />
      case 'billing_staff':
        return <BillingDashboard />
      case 'patient':
        return <PatientDashboard />
      default:
        // Fallback or default view
        return <SuperAdminDashboard />
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user?.firstName || user?.name || 'User'}</h1>
          <p className="text-gray-500">Here's what's happening at HS Walters today.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-1.5 rounded-lg border shadow-sm">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          System Operational
        </div>
      </div>

      {renderDashboard()}
    </div>
  )
}

export default Dashboard
