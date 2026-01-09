import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    // Mock password reset delay
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
    }, 1000)
  }

  if (success) {
    return (
      <Card className="w-full" hover={false}>
        <div className="text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Check Your Email
          </h2>
          <p className="text-gray-600 mb-6">
            We've sent a password reset link to {email}
          </p>
          <Link to="/login">
            <Button variant="secondary">Back to Login</Button>
          </Link>
        </div>
      </Card>
    )
  }

  return (
    <Card className="w-full" hover={false}>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Forgot Password</h1>
        <p className="text-gray-600">
          Enter your email to reset your password
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-600 text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1d627d] focus:ring-2 focus:ring-[#1d627d]"
            placeholder="your@email.com"
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          loading={loading}
        >
          Send Reset Link
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link
          to="/login"
          className="text-sm text-[#1d627d] hover:underline font-medium"
        >
          Back to Login
        </Link>
      </div>
    </Card>
  )
}

export default ForgotPassword

