import React, { useState } from 'react'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { FiSearch, FiEye, FiPlus } from 'react-icons/fi'

const Payouts = () => {
  const [payouts, setPayouts] = useState([
    { id: 1, driver: 'John Doe', amount: 15000, date: '2024-01-15', status: 'Paid' },
    { id: 2, driver: 'Jane Smith', amount: 12000, date: '2024-01-16', status: 'Pending' },
    { id: 3, driver: 'Bob Wilson', amount: 18000, date: '2024-01-17', status: 'Pending' },
    { id: 4, driver: 'Alice Brown', amount: 14000, date: '2024-01-18', status: 'Pending' },
    { id: 5, driver: 'Charlie Davis', amount: 16000, date: '2024-01-19', status: 'Paid' },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isPayDialogOpen, setIsPayDialogOpen] = useState(false)
  const [selectedPayout, setSelectedPayout] = useState(null)
  const [formData, setFormData] = useState({ driver: '', amount: '', date: '', status: 'Pending' })
  const [errors, setErrors] = useState({})

  const filteredPayouts = payouts.filter(payout =>
    payout.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payout.amount.toString().includes(searchTerm)
  )

  const totalPages = Math.ceil(filteredPayouts.length / itemsPerPage)
  const paginatedPayouts = filteredPayouts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const validateForm = () => {
    const newErrors = {}
    if (!formData.driver.trim()) {
      newErrors.driver = 'Driver name is required'
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valid amount is required'
    }
    if (!formData.date) {
      newErrors.date = 'Date is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAdd = () => {
    setFormData({ driver: '', amount: '', date: new Date().toISOString().split('T')[0], status: 'Pending' })
    setErrors({})
    setIsAddModalOpen(true)
  }

  const handleView = (payout) => {
    setSelectedPayout(payout)
    setIsViewModalOpen(true)
  }

  const handlePay = (payout) => {
    setSelectedPayout(payout)
    setIsPayDialogOpen(true)
  }

  const handleSaveAdd = () => {
    if (!validateForm()) return
    const newPayout = { id: payouts.length + 1, ...formData, amount: parseFloat(formData.amount) }
    setPayouts([...payouts, newPayout])
    setIsAddModalOpen(false)
    setFormData({ driver: '', amount: '', date: '', status: 'Pending' })
    setErrors({})
    setSearchTerm('')
    setCurrentPage(1)
  }

  const handleConfirmPay = () => {
    setPayouts(payouts.map(p => p.id === selectedPayout.id ? { ...p, status: 'Paid' } : p))
    setIsPayDialogOpen(false)
    setSelectedPayout(null)
  }

  const getStatusBadge = (status) => {
    return status === 'Paid'
      ? 'bg-green-100 text-green-800'
      : 'bg-yellow-100 text-yellow-800'
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" style={{ marginTop: '5.25rem' }}>
        <h1 className="text-2xl font-bold text-gray-800">Driver Payouts</h1>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <FiPlus size={18} />
          Add Payout
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by driver name or amount..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setCurrentPage(1)
          }}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d627d] focus:border-[#1d627d]"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedPayouts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No payouts found
                  </td>
                </tr>
              ) : (
                paginatedPayouts.map((payout) => (
                  <tr key={payout.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payout.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payout.driver}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">J${payout.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payout.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(payout.status)}`}>
                        {payout.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(payout)}
                          className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded hover:bg-blue-50"
                          title="View"
                        >
                          <FiEye size={18} />
                        </button>
                        {payout.status === 'Pending' && (
                          <button
                            onClick={() => handlePay(payout)}
                            className="text-green-600 hover:text-green-900 transition-colors px-3 py-1 rounded text-xs font-medium hover:bg-green-50"
                            title="Process Payment"
                          >
                            Pay
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredPayouts.length)} of {filteredPayouts.length} results
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="text-sm"
            >
              Previous
            </Button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 text-sm rounded-lg transition-all ${currentPage === page
                          ? 'bg-[#1d627d] text-white shadow-lg'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                      {page}
                    </button>
                  )
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="px-2 text-gray-500">...</span>
                }
                return null
              })}
            </div>
            <Button
              variant="secondary"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="text-sm"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
          setErrors({})
        }}
        title="Add Payout"
        footer={
          <>
            <Button variant="secondary" onClick={() => {
              setIsAddModalOpen(false)
              setErrors({})
            }}>Cancel</Button>
            <Button onClick={handleSaveAdd}>Add</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Driver <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={formData.driver}
              onChange={(e) => {
                setFormData({ ...formData, driver: e.target.value })
                if (errors.driver) setErrors({ ...errors, driver: '' })
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.driver ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors.driver && <p className="text-red-500 text-xs mt-1">{errors.driver}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount <span className="text-red-500">*</span></label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => {
                setFormData({ ...formData, amount: e.target.value })
                if (errors.amount) setErrors({ ...errors, amount: '' })
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.amount ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date <span className="text-red-500">*</span></label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => {
                setFormData({ ...formData, date: e.target.value })
                if (errors.date) setErrors({ ...errors, date: '' })
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Payout Details"
        footer={<Button variant="secondary" onClick={() => setIsViewModalOpen(false)}>Close</Button>}
      >
        {selectedPayout && (
          <div className="space-y-3">
            <div><span className="text-sm font-medium text-gray-500">ID:</span> <p className="text-gray-900">{selectedPayout.id}</p></div>
            <div><span className="text-sm font-medium text-gray-500">Driver:</span> <p className="text-gray-900">{selectedPayout.driver}</p></div>
            <div><span className="text-sm font-medium text-gray-500">Amount:</span> <p className="text-gray-900">J${selectedPayout.amount.toLocaleString()}</p></div>
            <div><span className="text-sm font-medium text-gray-500">Date:</span> <p className="text-gray-900">{selectedPayout.date}</p></div>
            <div><span className="text-sm font-medium text-gray-500">Status:</span> <p className="text-gray-900">{selectedPayout.status}</p></div>
          </div>
        )}
      </Modal>

      {/* Pay Confirmation */}
      <ConfirmDialog
        isOpen={isPayDialogOpen}
        onClose={() => setIsPayDialogOpen(false)}
        onConfirm={handleConfirmPay}
        title="Process Payout"
        message={`Process payment of J$${selectedPayout?.amount.toLocaleString()} to ${selectedPayout?.driver}?`}
      />
    </div>
  )
}

export default Payouts
