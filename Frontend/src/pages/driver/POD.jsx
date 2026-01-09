import React, { useState } from 'react'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import { FiSearch, FiEye, FiUpload } from 'react-icons/fi'

const POD = () => {
  const [jobs, setJobs] = useState([
    { id: 1, jobNumber: 'JOB-001', customer: 'ABC Corp', origin: 'Mumbai', destination: 'Delhi', podStatus: 'Pending' },
    { id: 2, jobNumber: 'JOB-002', customer: 'XYZ Ltd', origin: 'Pune', destination: 'Bangalore', podStatus: 'Uploaded' },
    { id: 3, jobNumber: 'JOB-003', customer: 'DEF Inc', origin: 'Delhi', destination: 'Mumbai', podStatus: 'Pending' },
    { id: 4, jobNumber: 'JOB-004', customer: 'GHI Corp', origin: 'Chennai', destination: 'Hyderabad', podStatus: 'Pending' },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)
  const [file, setFile] = useState(null)
  const [errors, setErrors] = useState({})

  const pendingJobs = jobs.filter(j => j.podStatus === 'Pending')
  const filteredJobs = pendingJobs.filter(job =>
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

  const handleUpload = (job) => {
    setSelectedJob(job)
    setFile(null)
    setErrors({})
    setIsUploadModalOpen(true)
  }

  const handleView = (job) => {
    setSelectedJob(job)
    setIsViewModalOpen(true)
  }

  const handleConfirmUpload = () => {
    if (!file) {
      setErrors({ file: 'Please select a file' })
      return
    }
    setJobs(jobs.map(j => j.id === selectedJob.id ? { ...j, podStatus: 'Uploaded' } : j))
    setIsUploadModalOpen(false)
    setSelectedJob(null)
    setFile(null)
    setErrors({})
    if (paginatedJobs.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const getStatusBadge = (status) => {
    return status === 'Uploaded' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800'
  }

  return (
    <div className="space-y-6"  >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" style={{ marginTop: '5.25rem' }}>
        <h1 className="text-2xl font-bold text-gray-800">POD Upload</h1>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">POD Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedJobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No pending POD jobs found
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(job.podStatus)}`}>
                        {job.podStatus}
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
                        {job.podStatus === 'Pending' && (
                          <button
                            onClick={() => handleUpload(job)}
                            className="text-green-600 hover:text-green-900 transition-colors px-3 py-1 rounded text-xs font-medium hover:bg-green-50 flex items-center gap-1"
                            title="Upload POD"
                          >
                            <FiUpload size={14} />
                            Upload
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

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false)
          setErrors({})
        }}
        title="Upload POD"
        footer={
          <>
            <Button variant="secondary" onClick={() => {
              setIsUploadModalOpen(false)
              setErrors({})
            }}>Cancel</Button>
            <Button onClick={handleConfirmUpload} disabled={!file}>Upload</Button>
          </>
        }
      >
        {selectedJob && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Job: {selectedJob.jobNumber}</p>
              <p className="text-sm text-gray-600">{selectedJob.origin} → {selectedJob.destination}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select File <span className="text-red-500">*</span></label>
              <input
                type="file"
                onChange={(e) => {
                  setFile(e.target.files[0])
                  if (errors.file) setErrors({ ...errors, file: '' })
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.file ? 'border-red-500' : 'border-gray-300'
                }`}
                accept="image/*,.pdf"
              />
              {errors.file && <p className="text-red-500 text-xs mt-1">{errors.file}</p>}
              {file && <p className="text-sm text-gray-600 mt-2">Selected: {file.name}</p>}
            </div>
          </div>
        )}
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
            <div><span className="text-sm font-medium text-gray-500">POD Status:</span> <p className="text-gray-900">{selectedJob.podStatus}</p></div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default POD
