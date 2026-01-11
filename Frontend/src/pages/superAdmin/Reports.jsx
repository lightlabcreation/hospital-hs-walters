import React, { useState, useEffect } from 'react'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { FiSearch, FiEye, FiTrash2, FiPlus } from 'react-icons/fi'

const Reports = () => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      setLoading(true)
      // This is a placeholder since we don't have a specific getAll reports endpoint in the services.js viewed earlier.
      // Assuming we should show some aggregated data or if there's a reports endpoint I missed.
      // Based on available services, I'll use a placeholder or relevant API call if available.
      // The user asked to remove dummy data, so I will set it to empty for now and add aTODO or try to fetch if an endpoint exists.
      // Looking at services.js, there isn't a generic GET /reports endpoint that returns a list like this.
      // However, the user request is specifically "remove dummy data".
      // I will initialize it as empty and perhaps add a comment or try to use a real endpoint if one existed.
      // Since no direct list endpoint exists in the viewed services.js, I will leave it empty to comply with "remove dummy data".
      setReports([])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const [formData, setFormData] = useState({ name: '', type: 'Financial', date: '', status: 'Pending' })
  const [errors, setErrors] = useState({})

  const filteredReports = reports.filter(report =>
    report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage)
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Report name is required'
    }
    if (!formData.date) {
      newErrors.date = 'Date is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAdd = () => {
    setFormData({ name: '', type: 'Financial', date: new Date().toISOString().split('T')[0], status: 'Pending' })
    setErrors({})
    setIsAddModalOpen(true)
  }

  const handleView = (report) => {
    setSelectedReport(report)
    setIsViewModalOpen(true)
  }

  const handleDelete = (report) => {
    setSelectedReport(report)
    setIsDeleteDialogOpen(true)
  }

  const handleSaveAdd = () => {
    if (!validateForm()) return
    const newReport = {
      id: reports.length + 1,
      ...formData,
    }
    setReports([newReport, ...reports])
    setIsAddModalOpen(false)
    setFormData({ name: '', type: 'Financial', date: '', status: 'Pending' })
    setErrors({})
    setSearchTerm('')
    setCurrentPage(1)
  }

  const handleConfirmDelete = () => {
    setReports(reports.filter(r => r.id !== selectedReport.id))
    setIsDeleteDialogOpen(false)
    setSelectedReport(null)
    if (paginatedReports.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const getStatusBadge = (status) => {
    return status === 'Generated'
      ? 'bg-green-100 text-green-800'
      : 'bg-yellow-100 text-yellow-800'
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
        <Button onClick={handleAdd} className="flex items-center gap-2 shadow-lg hover:shadow-xl">
          <FiPlus size={18} />
          Generate Report
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by report name or type..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Loading reports...
                  </td>
                </tr>
              ) : paginatedReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No reports found
                  </td>
                </tr>
              ) : (
                paginatedReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(report)}
                          className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded hover:bg-blue-50"
                          title="View"
                        >
                          <FiEye size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(report)}
                          className="text-red-600 hover:text-red-900 transition-colors p-1 rounded hover:bg-red-50"
                          title="Delete"
                        >
                          <FiTrash2 size={18} />
                        </button>
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
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredReports.length)} of {filteredReports.length} results
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
        title="Generate Report"
        footer={
          <>
            <Button variant="secondary" onClick={() => {
              setIsAddModalOpen(false)
              setErrors({})
            }}>Cancel</Button>
            <Button onClick={handleSaveAdd}>Generate</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value })
                if (errors.name) setErrors({ ...errors, name: '' })
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Enter report name"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Financial">Financial</option>
              <option value="Operations">Operations</option>
              <option value="Customer">Customer</option>
            </select>
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
        </div>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Report Details"
        footer={<Button variant="secondary" onClick={() => setIsViewModalOpen(false)}>Close</Button>}
        size="lg"
      >
        {selectedReport && (
          <div className="space-y-4">
            <div><span className="text-sm font-medium text-gray-500">ID:</span> <p className="text-gray-900">{selectedReport.id}</p></div>
            <div><span className="text-sm font-medium text-gray-500">Name:</span> <p className="text-gray-900">{selectedReport.name}</p></div>
            <div><span className="text-sm font-medium text-gray-500">Type:</span> <p className="text-gray-900">{selectedReport.type}</p></div>
            <div><span className="text-sm font-medium text-gray-500">Date:</span> <p className="text-gray-900">{selectedReport.date}</p></div>
            <div><span className="text-sm font-medium text-gray-500">Status:</span> <p className="text-gray-900">{selectedReport.status}</p></div>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Report content would be displayed here...</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Report"
        message={`Are you sure you want to delete ${selectedReport?.name}?`}
      />
    </div>
  )
}

export default Reports
