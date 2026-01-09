import React, { useState } from 'react'
import Modal from '../../components/common/Modal'
import Button from '../../components/common/Button'
import { FiSearch, FiEye } from 'react-icons/fi'

const Earnings = () => {
  const [earnings, setEarnings] = useState([
    { id: 1, jobNumber: 'JOB-001', date: '2024-01-15', amount: 5000, status: 'Paid' },
    { id: 2, jobNumber: 'JOB-002', date: '2024-01-16', amount: 4500, status: 'Paid' },
    { id: 3, jobNumber: 'JOB-003', date: '2024-01-17', amount: 6000, status: 'Pending' },
    { id: 4, jobNumber: 'JOB-004', date: '2024-01-18', amount: 5500, status: 'Paid' },
    { id: 5, jobNumber: 'JOB-005', date: '2024-01-19', amount: 4800, status: 'Pending' },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedEarning, setSelectedEarning] = useState(null)

  const filteredEarnings = earnings.filter(earning =>
    earning.jobNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    earning.amount.toString().includes(searchTerm) ||
    earning.status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredEarnings.length / itemsPerPage)
  const paginatedEarnings = filteredEarnings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleView = (earning) => {
    setSelectedEarning(earning)
    setIsViewModalOpen(true)
  }

  const totalEarnings = earnings.reduce((sum, e) => sum + e.amount, 0)
  const pendingEarnings = earnings.filter(e => e.status === 'Pending').reduce((sum, e) => sum + e.amount, 0)

  const getStatusBadge = (status) => {
    return status === 'Paid'
      ? 'bg-green-100 text-green-800'
      : 'bg-yellow-100 text-yellow-800'
  }

  return (
    <div className="space-y-6" >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" style={{ marginTop: '5.25rem' }}>
        <h1 className="text-2xl font-bold text-gray-800">My Earnings</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
          <p className="text-sm text-gray-600">Total Earnings</p>
          <p className="text-2xl font-bold text-gray-800 mt-2">J${totalEarnings.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-600 mt-2">J${pendingEarnings.toLocaleString()}</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by job number, amount, or status..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedEarnings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No earnings found
                  </td>
                </tr>
              ) : (
                paginatedEarnings.map((earning) => (
                  <tr key={earning.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{earning.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{earning.jobNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{earning.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">J${earning.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(earning.status)}`}>
                        {earning.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleView(earning)}
                        className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded hover:bg-blue-50"
                        title="View"
                      >
                        <FiEye size={18} />
                      </button>
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
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredEarnings.length)} of {filteredEarnings.length} results
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

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Earning Details"
        footer={<Button variant="secondary" onClick={() => setIsViewModalOpen(false)}>Close</Button>}
      >
        {selectedEarning && (
          <div className="space-y-3">
            <div><span className="text-sm font-medium text-gray-500">ID:</span> <p className="text-gray-900">{selectedEarning.id}</p></div>
            <div><span className="text-sm font-medium text-gray-500">Job Number:</span> <p className="text-gray-900">{selectedEarning.jobNumber}</p></div>
            <div><span className="text-sm font-medium text-gray-500">Date:</span> <p className="text-gray-900">{selectedEarning.date}</p></div>
            <div><span className="text-sm font-medium text-gray-500">Amount:</span> <p className="text-gray-900">J${selectedEarning.amount.toLocaleString()}</p></div>
            <div><span className="text-sm font-medium text-gray-500">Status:</span> <p className="text-gray-900">{selectedEarning.status}</p></div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Earnings
