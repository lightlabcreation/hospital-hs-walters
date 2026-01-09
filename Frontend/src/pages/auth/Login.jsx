import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import { FiActivity, FiMail, FiLock, FiUser } from 'react-icons/fi'

const roleCredentials = {
  super_admin: { email: 'admin@clinic.com', password: 'password' },
  doctor: { email: 'doctor@clinic.com', password: 'password' },
  receptionist: { email: 'receptionist@clinic.com', password: 'password' },
  billing_staff: { email: 'billing@clinic.com', password: 'password' },
  patient: { email: 'patient@clinic.com', password: 'password' },
}

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState('super_admin')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showCredentials, setShowCredentials] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const lastEmail = localStorage.getItem('lastLoginEmail')
    const lastRole = localStorage.getItem('lastLoginRole')

    if (lastEmail && lastRole) {
      setEmail(lastEmail)
      setSelectedRole(lastRole)
      if (roleCredentials[lastRole]) {
        setPassword(roleCredentials[lastRole].password)
      }
    } else {
      if (roleCredentials[selectedRole]) {
        setPassword(roleCredentials[selectedRole].password)
        setEmail(roleCredentials[selectedRole].email)
      }
    }
  }, [])

  useEffect(() => {
    if (roleCredentials[selectedRole]) {
      setPassword(roleCredentials[selectedRole].password)
      setEmail(roleCredentials[selectedRole].email)
    }
  }, [selectedRole])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    setTimeout(() => {
      const result = login(email, password, selectedRole)
      if (result.success) {
        localStorage.setItem('lastLoginEmail', email)
        localStorage.setItem('lastLoginRole', selectedRole)
        navigate('/dashboard')
      } else {
        setError(result.error || 'Invalid credentials')
      }
      setLoading(false)
    }, 500)
  }

  return (
    <Card className="w-full max-w-md" hover={false}>
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-[#90e0ef] rounded-2xl flex items-center justify-center shadow-md border border-blue-200">
            <FiActivity className="text-[#1d627d]" size={36} />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">HS Walters EMR</h1>
        <p className="text-gray-600">Sign in to your medical platform</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2 flex items-center gap-2">
            <FiMail size={16} />
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1d627d] focus:ring-4 focus:ring-[#90e0ef]/40 transition-all"
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2 flex items-center gap-2">
            <FiLock size={16} />
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1d627d] focus:ring-4 focus:ring-[#90e0ef]/40 transition-all"
            placeholder="Enter your password"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2 flex items-center gap-2">
            <FiUser size={16} />
            Role (for testing)
          </label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 focus:outline-none focus:border-[#1d627d] focus:ring-4 focus:ring-[#90e0ef]/40 transition-all"
          >
            <option value="super_admin">Super Admin</option>
            <option value="doctor">Doctor</option>
            <option value="receptionist">Receptionist</option>
            <option value="billing_staff">Billing Staff</option>
            <option value="patient">Patient</option>
          </select>
        </div>

        <Button type="submit" className="w-full" loading={loading}>
          Sign In
        </Button>
      </form>

      <div className="mt-6 space-y-3">
        <button
          type="button"
          onClick={() => setShowCredentials(!showCredentials)}
          className="w-full text-sm text-[#1d627d] hover:underline font-medium"
        >
          {showCredentials ? 'Hide' : 'Show'} Demo Credentials
        </button>

        {showCredentials && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
            <p className="text-xs font-semibold text-gray-700 mb-2">Demo Credentials:</p>
            {Object.entries(roleCredentials).map(([role, creds]) => (
              <div key={role} className="text-xs text-gray-600">
                <span className="font-medium">{role}:</span> {creds.email} / {creds.password}
              </div>
            ))}
          </div>
        )}

        <div className="text-center space-y-2">
          <Link
            to="/forgot-password"
            className="text-sm text-[#1d627d] hover:underline font-medium block"
          >
            Forgot password?
          </Link>

          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#1d627d] hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </Card>
  )
}

export default Login
