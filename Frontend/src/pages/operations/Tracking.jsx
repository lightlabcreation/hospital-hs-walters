import React, { useState } from 'react'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { FiSearch, FiEye, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi'

const Tracking = () => {
  const [shipments, setShipments] = useState([
    { id: 1, trackingNumber: 'TRK-001', origin: 'Mumbai', destination: 'Delhi', status: 'In Transit', location: 'Pune', eta: '2024-01-18' },
    { id: 2, trackingNumber: 'TRK-002', origin: 'Pune', destination: 'Bangalore', status: 'In Transit', location: 'Kolhapur', eta: '2024-01-19' },
    { id: 3, trackingNumber: 'TRK-003', origin: 'Delhi', destination: 'Mumbai', status: 'Delivered', location: 'Mumbai', eta: '2024-01-17' },
    { id: 4, trackingNumber: 'TRK-004', origin: 'Chennai', destination: 'Hyderabad', status: 'In Transit', location: 'Bangalore', eta: '2024-01-20' },
    { id: 5, trackingNumber: 'TRK-005', origin: 'Kolkata', destination: 'Mumbai', status: 'Delivered', location: 'Mumbai', eta: '2024-01-16' },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedShipment, setSelectedShipment] = useState(null)
  const [formData, setFormData] = useState({ trackingNumber: '', origin: '', destination: '', status: 'In Transit', location: '', eta: '' })
  const [errors, setErrors] = useState({})

  const filteredShipments = shipments.filter(shipment =>
    shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.destination.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredShipments.length / itemsPerPage)
  const paginatedShipments = filteredShipments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const validateForm = () => {
    const newErrors = {}
    if (!formData.trackingNumber.trim()) {
      newErrors.trackingNumber = 'Tracking number is required'
    }
    if (!formData.origin.trim()) {
      newErrors.origin = 'Origin is required'
    }
    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination is required'
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Current location is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAdd = () => {
    setFormData({ trackingNumber: `TRK-${String(shipments.length + 1).padStart(3, '0')}`, origin: '', destination: '', status: 'In Transit', location: '', eta: new Date().toISOString().split('T')[0] })
    setErrors({})
    setIsAddModalOpen(true)
  }

  const handleView = (shipment) => {
    setSelectedShipment(shipment)
    setIsViewModalOpen(true)
  }

  const handleEdit = (shipment) => {
    setSelectedShipment(shipment)
    setFormData({ ...shipment })
    setErrors({})
    setIsEditModalOpen(true)
  }

  const handleDelete = (shipment) => {
    setSelectedShipment(shipment)
    setIsDeleteDialogOpen(true)
  }

  const handleSaveAdd = () => {
    if (!validateForm()) return
    const newShipment = { id: shipments.length + 1, ...formData }
    setShipments([...shipments, newShipment])
    setIsAddModalOpen(false)
    setFormData({ trackingNumber: '', origin: '', destination: '', status: 'In Transit', location: '', eta: '' })
    setErrors({})
    setSearchTerm('')
    setCurrentPage(1)
  }

  const handleSaveEdit = () => {
    if (!validateForm()) return
    setShipments(shipments.map(s => s.id === selectedShipment.id ? { ...formData, id: selectedShipment.id } : s))
    setIsEditModalOpen(false)
    setSelectedShipment(null)
    setErrors({})
  }

  const handleConfirmDelete = () => {
    setShipments(shipments.filter(s => s.id !== selectedShipment.id))
    setIsDeleteDialogOpen(false)
    setSelectedShipment(null)
    if (paginatedShipments.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const getStatusBadge = (status) => {
    return status === 'Delivered' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-blue-100 text-blue-800'
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" style={{ marginTop: '5.25rem' }}>
        <h1 className="text-2xl font-bold text-gray-800">Tracking</h1>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <FiPlus size={18} />
          Add Shipment
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by tracking number, origin, or destination..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ETA</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedShipments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    No shipments found
                  </td>
                </tr>
              ) : (
                paginatedShipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{shipment.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{shipment.trackingNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{shipment.origin}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{shipment.destination}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{shipment.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{shipment.eta}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(shipment.status)}`}>
                        {shipment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(shipment)}
                          className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded hover:bg-blue-50"
                          title="View"
                        >
                          <FiEye size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(shipment)}
                          className="text-green-600 hover:text-green-900 transition-colors p-1 rounded hover:bg-green-50"
                          title="Edit"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(shipment)}
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
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredShipments.length)} of {filteredShipments.length} results
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
        title="Add Shipment"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Number <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={formData.trackingNumber}
              onChange={(e) => {
                setFormData({ ...formData, trackingNumber: e.target.value })
                if (errors.trackingNumber) setErrors({ ...errors, trackingNumber: '' })
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.trackingNumber ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.trackingNumber && <p className="text-red-500 text-xs mt-1">{errors.trackingNumber}</p>}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Location <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => {
                setFormData({ ...formData, location: e.target.value })
                if (errors.location) setErrors({ ...errors, location: '' })
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ETA</label>
            <input
              type="date"
              value={formData.eta}
              onChange={(e) => setFormData({ ...formData, eta: e.target.value })}
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
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Tracking Details"
        footer={<Button variant="secondary" onClick={() => setIsViewModalOpen(false)}>Close</Button>}
        size="lg"
      >
        {selectedShipment && (
          <div className="space-y-4">
            <div><span className="text-sm font-medium text-gray-500">Tracking Number:</span> <p className="text-gray-900">{selectedShipment.trackingNumber}</p></div>
            <div><span className="text-sm font-medium text-gray-500">Origin:</span> <p className="text-gray-900">{selectedShipment.origin}</p></div>
            <div><span className="text-sm font-medium text-gray-500">Destination:</span> <p className="text-gray-900">{selectedShipment.destination}</p></div>
            <div><span className="text-sm font-medium text-gray-500">Current Location:</span> <p className="text-gray-900">{selectedShipment.location}</p></div>
            <div><span className="text-sm font-medium text-gray-500">Status:</span> <p className="text-gray-900">{selectedShipment.status}</p></div>
            <div><span className="text-sm font-medium text-gray-500">ETA:</span> <p className="text-gray-900">{selectedShipment.eta}</p></div>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Route Map</p>
              <div className="h-48 bg-gray-200 rounded flex items-center justify-center">
                <p className="text-gray-500">Map visualization would appear here</p>
              </div>
            </div>
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
        title="Edit Shipment"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Number <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={formData.trackingNumber}
              onChange={(e) => {
                setFormData({ ...formData, trackingNumber: e.target.value })
                if (errors.trackingNumber) setErrors({ ...errors, trackingNumber: '' })
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.trackingNumber ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.trackingNumber && <p className="text-red-500 text-xs mt-1">{errors.trackingNumber}</p>}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Location <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => {
                setFormData({ ...formData, location: e.target.value })
                if (errors.location) setErrors({ ...errors, location: '' })
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ETA</label>
            <input
              type="date"
              value={formData.eta}
              onChange={(e) => setFormData({ ...formData, eta: e.target.value })}
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
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Shipment"
        message={`Are you sure you want to delete ${selectedShipment?.trackingNumber}?`}
      />
    </div>
  )
}

export default Tracking
