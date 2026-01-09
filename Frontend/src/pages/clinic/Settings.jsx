import React, { useState } from 'react'
import { FiUser, FiLock, FiCheck, FiRefreshCw } from 'react-icons/fi'
import Card from '../../components/common/Card'

const Settings = () => {
  const [isSaving, setIsSaving] = useState(false)

  const [personalDetails, setPersonalDetails] = useState({
    name: 'John Walters',
    email: 'admin@hswalters.com',
    phone: '+91 99999 88888'
  })

  const [passwords, setPasswords] = useState({
    old: '',
    new: '',
    confirm: ''
  })

  const handleSavePersonal = (e) => {
    e.preventDefault()
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      alert('Personal details updated!')
    }, 1000)
  }

  const handleUpdatePassword = (e) => {
    e.preventDefault()
    alert('Password updated successfully!')
    setPasswords({ old: '', new: '', confirm: '' })
  }

  const handleResetPassword = () => {
    const confirmReset = window.confirm('Are you sure you want to trigger a password reset? An email will be sent to your registered address.')
    if (confirmReset) {
      alert('Reset email sent to ' + personalDetails.email)
    }
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-800 tracking-tight">Account Settings</h1>
        <p className="text-gray-500 font-medium">Manage your personal credentials and security preferences</p>
      </div>

      <div className="space-y-6">
        {/* Section: Personal Details */}
        <Card className="border-gray-100 shadow-sm overflow-hidden">
          <div className="section-header flex items-center gap-2 mb-6">
            <FiUser size={16} /> <span>Personal Details</span>
          </div>
          <form onSubmit={handleSavePersonal} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <input
                  type="text"
                  value={personalDetails.name}
                  onChange={(e) => setPersonalDetails({ ...personalDetails, name: e.target.value })}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-[#90e0ef]/30 outline-none font-bold text-gray-800 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <input
                  type="email"
                  value={personalDetails.email}
                  onChange={(e) => setPersonalDetails({ ...personalDetails, email: e.target.value })}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-[#90e0ef]/30 outline-none font-bold text-gray-800 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                <input
                  type="text"
                  value={personalDetails.phone}
                  onChange={(e) => setPersonalDetails({ ...personalDetails, phone: e.target.value })}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-[#90e0ef]/30 outline-none font-bold text-gray-800 transition-all"
                />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isSaving}
                className="btn-primary flex items-center gap-2 px-8 py-3 uppercase text-xs tracking-widest"
              >
                {isSaving ? 'Saving...' : <><FiCheck size={16} /> Save Details</>}
              </button>
            </div>
          </form>
        </Card>

        {/* Section: Update Password */}
        <Card className="border-gray-100 shadow-sm overflow-hidden">
          <div className="section-header flex items-center gap-2 mb-6">
            <FiLock size={16} /> <span>Update Password</span>
          </div>
          <form onSubmit={handleUpdatePassword} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Old Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwords.old}
                  onChange={(e) => setPasswords({ ...passwords, old: e.target.value })}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-[#90e0ef]/30 outline-none font-bold text-gray-800 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-[#90e0ef]/30 outline-none font-bold text-gray-800 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-[#90e0ef]/30 outline-none font-bold text-gray-800 transition-all"
                />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="btn-primary flex items-center gap-2 px-8 py-3 uppercase text-xs tracking-widest"
              >
                <FiCheck size={16} /> Update Password
              </button>
            </div>
          </form>
        </Card>

        {/* Section: Reset Password */}
        <Card className="border-gray-100 shadow-sm overflow-hidden bg-red-50/10">
          <div className="section-header flex items-center gap-2 mb-6 bg-red-100/50 text-red-700">
            <FiRefreshCw size={16} /> <span>Security Controls</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-4">
            <div>
              <h4 className="font-bold text-gray-800">Forgot your password?</h4>
              <p className="text-sm text-gray-500">Trigger a reset link to be sent to your registered email address.</p>
            </div>
            <button
              onClick={handleResetPassword}
              className="bg-white text-red-600 border border-red-200 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-red-50 transition-all active:scale-95 shadow-sm whitespace-nowrap"
            >
              Reset Password
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Settings
