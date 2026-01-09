import React, { useState } from 'react'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { FiSearch, FiEye, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi'

const Dispatch = () => {
  const [dispatches, setDispatches] = useState([
    { id: 1, dispatchNumber: 'DSP-001', booking: 'BK-001', driver: 'John Doe', vehicle: 'MH-12 AB 1234', status: 'Assigned', date: '2024-01-15' },
    { id: 2, dispatchNumber: 'DSP-002', booking: 'BK-002', driver: 'Jane Smith', vehicle: 'MH-12 CD 5678', status: 'In Transit', date: '2024-01-16' },
    { id: 3, dispatchNumber: 'DSP-003', booking: 'BK-003', driver: 'Bob Wilson', vehicle: 'MH-12 EF 9012', status: 'Completed', date: '2024-01-17' },
    { id: 4, dispatchNumber: 'DSP-004', booking: 'BK-004', driver: 'Alice Brown', vehicle: 'MH-12 GH 3456', status: 'Assigned', date: '2024-01-18' },
    { id: 5, dispatchNumber: 'DSP-005', booking: 'BK-005', driver: 'Charlie Davis', vehicle: 'MH-12 IJ 7890', status: 'In Transit', date: '2024-01-19' },
    { id: 6, dispatchNumber: 'DSP-006', booking: 'BK-006', driver: 'Diana Miller', vehicle: 'MH-12 KL 2468', status: 'Completed', date: '2024-01-20' },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedDispatch, setSelectedDispatch] = useState(null)
  const [formData, setFormData] = useState({ dispatchNumber: '', booking: '', driver: '', vehicle: '', status: 'Assigned', date: '' })

  const filteredDispatches = dispatches.filter(dispatch =>
    dispatch.dispatchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dispatch.booking.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dispatch.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dispatch.vehicle.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredDispatches.length / itemsPerPage)
  const paginatedDispatches = filteredDispatches.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleAdd = () => {
    setFormData({ dispatchNumber: `DSP-${String(dispatches.length + 1).padStart(3, '0')}`, booking: '', driver: '', vehicle: '', status: 'Assigned', date: new Date().toISOString().split('T')[0] })
    setIsAddModalOpen(true)
  }

  const handleView = (dispatch) => {
    setSelectedDispatch(dispatch)
    setIsViewModalOpen(true)
  }

  const handleEdit = (dispatch) => {
    setSelectedDispatch(dispatch)
    setFormData({ ...dispatch })
    setIsEditModalOpen(true)
  }

  const handleDelete = (dispatch) => {
    setSelectedDispatch(dispatch)
    setIsDeleteDialogOpen(true)
  }

  const handleSaveAdd = () => {
    const newDispatch = { id: dispatches.length + 1, ...formData }
    setDispatches([...dispatches, newDispatch])
    setIsAddModalOpen(false)
    setFormData({ dispatchNumber: '', booking: '', driver: '', vehicle: '', status: 'Assigned', date: '' })
    setSearchTerm('')
    setCurrentPage(1)
  }

  const handleSaveEdit = () => {
    setDispatches(dispatches.map(d => d.id === selectedDispatch.id ? { ...formData, id: selectedDispatch.id } : d))
    setIsEditModalOpen(false)
    setSelectedDispatch(null)
  }

  const handleConfirmDelete = () => {
    setDispatches(dispatches.filter(d => d.id !== selectedDispatch.id))
    setIsDeleteDialogOpen(false)
    setSelectedDispatch(null)
    if (paginatedDispatches.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const getStatusBadge = (status) => {
    const colors = {
      'Assigned': 'bg-blue-100 text-blue-800',
      'In Transit': 'bg-yellow-100 text-yellow-800',
      'Completed': 'bg-green-100 text-green-800',
      'Pending': 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6" style={{ marginTop: '5.25rem' }}>
        <h1 className="text-2xl font-bold text-gray-800">Dispatch</h1>
        <Button onClick={handleAdd} className="flex items-center gap-2 shadow-lg hover:shadow-xl">
          <FiPlus size={18} />
          Add Dispatch
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by dispatch number, booking, driver, or vehicle..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dispatch #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedDispatches.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    No dispatches found
                  </td>
                </tr>
              ) : (
                paginatedDispatches.map((dispatch) => (
                  <tr key={dispatch.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dispatch.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dispatch.dispatchNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dispatch.booking}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dispatch.driver}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dispatch.vehicle}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dispatch.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(dispatch.status)}`}>
                        {dispatch.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(dispatch)}
                          className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded hover:bg-blue-50"
                          title="View"
                        >
                          <FiEye size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(dispatch)}
                          className="text-green-600 hover:text-green-900 transition-colors p-1 rounded hover:bg-green-50"
                          title="Edit"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(dispatch)}
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
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredDispatches.length)} of {filteredDispatches.length} results
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
        onClose={() => setIsAddModalOpen(false)}
        title="Add Dispatch"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveAdd}>Add</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dispatch Number</label>
            <input
              type="text"
              value={formData.dispatchNumber}
              onChange={(e) => setFormData({ ...formData, dispatchNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Booking</label>
            <input
              type="text"
              value={formData.booking}
              onChange={(e) => setFormData({ ...formData, booking: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Driver</label>
            <input
              type="text"
              value={formData.driver}
              onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
            <input
              type="text"
              value={formData.vehicle}
              onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Assigned">Assigned</option>
              <option value="In Transit">In Transit</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Dispatch Details"
        footer={<Button variant="secondary" onClick={() => setIsViewModalOpen(false)}>Close</Button>}
      >
        {selectedDispatch && (
          <div className="space-y-3">
            <div><span className="text-sm font-medium text-gray-500">ID:</span> <p className="text-gray-900">{selectedDispatch.id}</p></div>
            <div><span className="text-sm font-medium text-gray-500">Dispatch Number:</span> <p className="text-gray-900">{selectedDispatch.dispatchNumber}</p></div>
            <div><span className="text-sm font-medium text-gray-500">Booking:</span> <p className="text-gray-900">{selectedDispatch.booking}</p></div>
            <div><span className="text-sm font-medium text-gray-500">Driver:</span> <p className="text-gray-900">{selectedDispatch.driver}</p></div>
            <div><span className="text-sm font-medium text-gray-500">Vehicle:</span> <p className="text-gray-900">{selectedDispatch.vehicle}</p></div>
            <div><span className="text-sm font-medium text-gray-500">Date:</span> <p className="text-gray-900">{selectedDispatch.date}</p></div>
            <div><span className="text-sm font-medium text-gray-500">Status:</span> <p className="text-gray-900">{selectedDispatch.status}</p></div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Dispatch"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dispatch Number</label>
            <input
              type="text"
              value={formData.dispatchNumber}
              onChange={(e) => setFormData({ ...formData, dispatchNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Booking</label>
            <input
              type="text"
              value={formData.booking}
              onChange={(e) => setFormData({ ...formData, booking: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Driver</label>
            <input
              type="text"
              value={formData.driver}
              onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
            <input
              type="text"
              value={formData.vehicle}
              onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Assigned">Assigned</option>
              <option value="In Transit">In Transit</option>
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
        title="Delete Dispatch"
        message={`Are you sure you want to delete ${selectedDispatch?.dispatchNumber}?`}
      />
    </div>
  )
}

export default Dispatch
