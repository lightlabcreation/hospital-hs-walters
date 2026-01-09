import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthLayout from '../layouts/AuthLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import Login from '../pages/auth/Login'
import Signup from '../pages/auth/Signup'
import ForgotPassword from '../pages/auth/ForgotPassword'
import Dashboard from '../pages/dashboard/Dashboard'
import PlaceholderPage from '../components/common/PlaceholderPage'
import Patients from '../pages/clinic/Patients'
import Appointments from '../pages/clinic/Appointments'
import DoctorsStaff from '../pages/clinic/DoctorsStaff'
import Billing from '../pages/clinic/Billing'
import Prescriptions from '../pages/clinic/Prescriptions'
import Reports from '../pages/clinic/Reports'
import Settings from '../pages/clinic/Settings'
import Support from '../pages/clinic/Support'
import LabResults from '../pages/clinic/LabResults'
import MedicalNotes from '../pages/clinic/MedicalNotes'
import DoctorSchedule from '../pages/clinic/DoctorSchedule'
import Payments from '../pages/clinic/Payments'
import BillingHistory from '../pages/clinic/BillingHistory'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Protected Dashboard Routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Super Admin Routes */}
        <Route path="/patients" element={<Patients />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/staff" element={<DoctorsStaff />} />
        <Route path="/prescriptions" element={<Prescriptions />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/support" element={<Support />} />

        {/* Doctor Routes */}
        <Route path="/my-patients" element={<Patients />} />
        <Route path="/my-appointments" element={<Appointments />} />
        <Route path="/lab-results" element={<LabResults />} />
        <Route path="/medical-notes" element={<MedicalNotes />} />

        {/* Receptionist Routes */}
        <Route path="/doctor-schedule" element={<DoctorSchedule />} />

        {/* Billing Staff Routes */}
        <Route path="/invoices" element={<Billing />} />
        <Route path="/payments" element={<Payments />} />

        {/* Patient Routes */}
        <Route path="/my-prescriptions" element={<Prescriptions />} />
        <Route path="/my-lab-reports" element={<LabResults />} />
        <Route path="/billing-history" element={<BillingHistory />} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
