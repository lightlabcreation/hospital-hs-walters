import React, { useState } from 'react'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import { FiPlus } from 'react-icons/fi'

const Settings = () => {
  const [settings, setSettings] = useState({
    companyName: 'SmartLM',
    email: 'admin@smartlm.com',
    phone: '+91 9876543210',
    timezone: 'Asia/Kolkata',
    currency: 'JMD',
    notifications: true,
  })

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [formData, setFormData] = useState({ ...settings })

  const handleEdit = () => {
    setFormData({ ...settings })
    setIsEditModalOpen(true)
  }

  const handleSave = () => {
    setSettings({ ...formData })
    setIsEditModalOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6" style={{ marginTop: '5.25rem' }}>
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <Button onClick={handleEdit} className="flex items-center gap-2 shadow-lg hover:shadow-xl">
          <FiPlus size={18} />
          Edit Settings
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm font-medium text-gray-500">Company Name</span>
            <p className="text-gray-900 mt-1">{settings.companyName}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Email</span>
            <p className="text-gray-900 mt-1">{settings.email}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Phone</span>
            <p className="text-gray-900 mt-1">{settings.phone}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Timezone</span>
            <p className="text-gray-900 mt-1">{settings.timezone}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Currency</span>
            <p className="text-gray-900 mt-1">{settings.currency}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Notifications</span>
            <p className="text-gray-900 mt-1">{settings.notifications ? 'Enabled' : 'Disabled'}</p>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Settings"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
            <select
              value={formData.timezone}
              onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Asia/Kolkata">Asia/Kolkata</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">America/New_York</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="JMD">JMD</option>
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.notifications}
                onChange={(e) => setFormData({ ...formData, notifications: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">Enable Notifications</span>
            </label>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Settings

