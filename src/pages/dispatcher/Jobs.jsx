import React, { useState } from 'react'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { FiSearch, FiEye, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi'

const Jobs = () => {
  const [jobs, setJobs] = useState([
    { id: 1, jobNumber: 'JOB-001', customer: 'ABC Corp', origin: 'Mumbai', destination: 'Delhi', status: 'Pending', driver: '' },
    { id: 2, jobNumber: 'JOB-002', customer: 'XYZ Ltd', origin: 'Pune', destination: 'Bangalore', status: 'Assigned', driver: 'John Doe' },
    { id: 3, jobNumber: 'JOB-003', customer: 'DEF Inc', origin: 'Delhi', destination: 'Mumbai', status: 'In Progress', driver: 'Jane Smith' },
    { id: 4, jobNumber: 'JOB-004', customer: 'GHI Corp', origin: 'Chennai', destination: 'Hyderabad', status: 'Pending', driver: '' },
    { id: 5, jobNumber: 'JOB-005', customer: 'JKL Ltd', origin: 'Kolkata', destination: 'Mumbai', status: 'Completed', driver: 'Bob Wilson' },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)
  const [formData, setFormData] = useState({ jobNumber: '', customer: '', origin: '', destination: '', status: 'Pending', driver: '' })
  const [errors, setErrors] = useState({})

  const filteredJobs = jobs.filter(job =>
    job.jobNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.destination.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage)
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const validateForm = () => {
    const newErrors = {}
    if (!formData.customer.trim()) {
      newErrors.customer = 'Customer is required'
    }
    if (!formData.origin.trim()) {
      newErrors.origin = 'Origin is required'
    }
    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAdd = () => {
    setFormData({ jobNumber: `JOB-${String(jobs.length + 1).padStart(3, '0')}`, customer: '', origin: '', destination: '', status: 'Pending', driver: '' })
    setErrors({})
    setIsAddModalOpen(true)
  }

  const handleView = (job) => {
    setSelectedJob(job)
    setIsViewModalOpen(true)
  }

  const handleEdit = (job) => {
    setSelectedJob(job)
    setFormData({ ...job })
    setErrors({})
    setIsEditModalOpen(true)
  }

  const handleDelete = (job) => {
    setSelectedJob(job)
    setIsDeleteDialogOpen(true)
  }

  const handleSaveAdd = () => {
    if (!validateForm()) return
    const newJob = { id: jobs.length + 1, ...formData }
    setJobs([...jobs, newJob])
    setIsAddModalOpen(false)
    setFormData({ jobNumber: '', customer: '', origin: '', destination: '', status: 'Pending', driver: '' })
    setErrors({})
    setSearchTerm('')
    setCurrentPage(1)
  }

  const handleSaveEdit = () => {
    if (!validateForm()) return
    setJobs(jobs.map(j => j.id === selectedJob.id ? { ...formData, id: selectedJob.id } : j))
    setIsEditModalOpen(false)
    setSelectedJob(null)
    setErrors({})
  }

  const handleConfirmDelete = () => {
    setJobs(jobs.filter(j => j.id !== selectedJob.id))
    setIsDeleteDialogOpen(false)
    setSelectedJob(null)
    if (paginatedJobs.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const getStatusBadge = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Assigned': 'bg-blue-100 text-blue-800',
      'In Progress': 'bg-green-100 text-green-800',
      'Completed': 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6" >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"style={{ marginTop: '5.25rem' }} >
        <h1 className="text-2xl font-bold text-gray-800">Jobs</h1>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <FiPlus size={18} />
          Add Job
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by job number, customer, origin, or destination..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedJobs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    No jobs found
                  </td>
                </tr>
              ) : (
                paginatedJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{job.jobNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.origin}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.destination}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.driver || 'Not Assigned'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(job.status)}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(job)}
                          className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded hover:bg-blue-50"
                          title="View"
                        >
                          <FiEye size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(job)}
                          className="text-green-600 hover:text-green-900 transition-colors p-1 rounded hover:bg-green-50"
                          title="Edit"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(job)}
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
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredJobs.length)} of {filteredJobs.length} results
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
                      className={`px-3 py-1 text-sm rounded-lg transition-all ${
                        currentPage === page
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
        title="Add Job"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Number</label>
            <input
              type="text"
              value={formData.jobNumber}
              onChange={(e) => setFormData({ ...formData, jobNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={formData.customer}
              onChange={(e) => {
                setFormData({ ...formData, customer: e.target.value })
                if (errors.customer) setErrors({ ...errors, customer: '' })
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.customer ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.customer && <p className="text-red-500 text-xs mt-1">{errors.customer}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Origin <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={formData.origin}
              onChange={(e) => {
                setFormData({ ...formData, origin: e.target.value })
                if (errors.origin) setErrors({ ...errors, origin: '' })
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.origin ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.origin && <p className="text-red-500 text-xs mt-1">{errors.origin}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Destination <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={formData.destination}
              onChange={(e) => {
                setFormData({ ...formData, destination: e.target.value })
                if (errors.destination) setErrors({ ...errors, destination: '' })
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.destination ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.destination && <p className="text-red-500 text-xs mt-1">{errors.destination}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Driver</label>
            <input
              type="text"
              value={formData.driver}
              onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Optional"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Pending">Pending</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Job Details"
        footer={<Button variant="secondary" onClick={() => setIsViewModalOpen(false)}>Close</Button>}
      >
        {selectedJob && (
          <div className="space-y-3">
            <div><span className="text-sm font-medium text-gray-500">ID:</span> <p className="text-gray-900">{selectedJob.id}</p></div>
            <div><span className="text-sm font-medium text-gray-500">Job Number:</span> <p className="text-gray-900">{selectedJob.jobNumber}</p></div>
            <div><span className="text-sm font-medium text-gray-500">Customer:</span> <p className="text-gray-900">{selectedJob.customer}</p></div>
            <div><span className="text-sm font-medium text-gray-500">Origin:</span> <p className="text-gray-900">{selectedJob.origin}</p></div>
            <div><span className="text-sm font-medium text-gray-500">Destination:</span> <p className="text-gray-900">{selectedJob.destination}</p></div>
            <div><span className="text-sm font-medium text-gray-500">Driver:</span> <p className="text-gray-900">{selectedJob.driver || 'Not Assigned'}</p></div>
            <div><span className="text-sm font-medium text-gray-500">Status:</span> <p className="text-gray-900">{selectedJob.status}</p></div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setErrors({})
        }}
        title="Edit Job"
        footer={
          <>
            <Button variant="secondary" onClick={() => {
              setIsEditModalOpen(false)
              setErrors({})
            }}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Number</label>
            <input
              type="text"
              value={formData.jobNumber}
              onChange={(e) => setFormData({ ...formData, jobNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={formData.customer}
              onChange={(e) => {
                setFormData({ ...formData, customer: e.target.value })
                if (errors.customer) setErrors({ ...errors, customer: '' })
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.customer ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.customer && <p className="text-red-500 text-xs mt-1">{errors.customer}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Origin <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={formData.origin}
              onChange={(e) => {
                setFormData({ ...formData, origin: e.target.value })
                if (errors.origin) setErrors({ ...errors, origin: '' })
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.origin ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.origin && <p className="text-red-500 text-xs mt-1">{errors.origin}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Destination <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={formData.destination}
              onChange={(e) => {
                setFormData({ ...formData, destination: e.target.value })
                if (errors.destination) setErrors({ ...errors, destination: '' })
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.destination ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.destination && <p className="text-red-500 text-xs mt-1">{errors.destination}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Driver</label>
            <input
              type="text"
              value={formData.driver}
              onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Optional"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Pending">Pending</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Job"
        message={`Are you sure you want to delete ${selectedJob?.jobNumber}?`}
      />
    </div>
  )
}

export default Jobs
