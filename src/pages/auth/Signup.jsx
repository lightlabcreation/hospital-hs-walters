import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      navigate('/login')
    }, 800)
  }

  return (
    <Card className="w-full max-w-md" hover={false}>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Create Account
        </h1>
        <p className="text-gray-600">Sign up to get started</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-500 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {['name', 'email', 'password', 'confirmPassword'].map((field, i) => (
          <div key={i}>
            <label className="block text-gray-600 text-sm font-medium mb-1 capitalize">
              {field === 'confirmPassword'
                ? 'Confirm Password'
                : field === 'name'
                  ? 'Full Name'
                  : field}
            </label>
            <input
              type={field.includes('password') ? 'password' : field === 'email' ? 'email' : 'text'}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1d627d] focus:ring-4 focus:ring-[#90e0ef]/40 transition-all shadow-sm"
              placeholder={
                field === 'name' ? 'John Doe' :
                  field === 'email' ? 'john@example.com' :
                    field === 'password' ? 'At least 6 characters' :
                      'Confirm your password'
              }
              required
            />
          </div>
        ))}

        <Button type="submit" className="w-full" loading={loading}>
          Sign Up
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-[#1d627d] hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </Card>
  )
}

export default Signup
