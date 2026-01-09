import React, { useState } from 'react'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { FiSearch, FiEye, FiPlus } from 'react-icons/fi'

const MyBookings = () => {
  const [bookings, setBookings] = useState([
    { id: 1, bookingNumber: 'BK-001', origin: 'Mumbai', destination: 'Delhi', status: 'In Transit', date: '2024-01-15' },
    { id: 2, bookingNumber: 'BK-002', origin: 'Pune', destination: 'Bangalore', status: 'Delivered', date: '2024-01-14' },
    { id: 3, bookingNumber: 'BK-003', origin: 'Delhi', destination: 'Mumbai', status: 'Pending', date: '2024-01-20' },
    { id: 4, bookingNumber: 'BK-004', origin: 'Chennai', destination: 'Hyderabad', status: 'In Transit', date: '2024-01-18' },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [formData, setFormData] = useState({ origin: '', destination: '', date: '', status: 'Pending' })
  const [errors, setErrors] = useState({})

  const filteredBookings = bookings.filter(booking =>
    booking.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.destination.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage)
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const validateForm = () => {
    const newErrors = {}
    if (!formData.origin.trim()) {
      newErrors.origin = 'Origin is required'
    }
    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination is required'
    }
    if (!formData.date) {
      newErrors.date = 'Date is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAdd = () => {
    setFormData({ origin: '', destination: '', date: '', status: 'Pending' })
    setErrors({})
    setIsAddModalOpen(true)
  }

  const handleView = (booking) => {
    setSelectedBooking(booking)
    setIsViewModalOpen(true)
  }

  const handleSaveAdd = () => {
    if (!validateForm()) return
    const newBooking = {
      id: bookings.length + 1,
      bookingNumber: `BK-${String(bookings.length + 1).padStart(3, '0')}`,
      ...formData,
    }
    setBookings([...bookings, newBooking])
    setIsAddModalOpen(false)
    setFormData({ origin: '', destination: '', date: '', status: 'Pending' })
    setErrors({})
    setSearchTerm('')
    setCurrentPage(1)
  }

  const getStatusBadge = (status) => {
    const colors = {
      'Delivered': 'bg-green-100 text-green-800',
      'In Transit': 'bg-blue-100 text-blue-800',
      'Pending': 'bg-yellow-100 text-yellow-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">My Bookings</h1>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <FiPlus size={18} />
          New Booking
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by booking number, origin, or destination..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No bookings found
                  </td>
                </tr>
              ) : (
                paginatedBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.bookingNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.origin}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.destination}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleView(booking)}
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
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredBookings.length)} of {filteredBookings.length} results
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
        title="New Booking"
        footer={
          <>
            <Button variant="secondary" onClick={() => {
              setIsAddModalOpen(false)
              setErrors({})
            }}>Cancel</Button>
            <Button onClick={handleSaveAdd}>Create Booking</Button>
          </>
        }
      >
        <div className="space-y-4">
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
              placeholder="Enter origin city"
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
              placeholder="Enter destination city"
            />
            {errors.destination && <p className="text-red-500 text-xs mt-1">{errors.destination}</p>}
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
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.date ? 'border-red-500' : 'border-gray-300'
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
        title="Booking Details"
        footer={<Button variant="secondary" onClick={() => setIsViewModalOpen(false)}>Close</Button>}
      >
        {selectedBooking && (
          <div className="space-y-3">
            <div><span className="text-sm font-medium text-gray-500">Booking Number:</span> <p className="text-gray-900">{selectedBooking.bookingNumber}</p></div>
            <div><span className="text-sm font-medium text-gray-500">Origin:</span> <p className="text-gray-900">{selectedBooking.origin}</p></div>
            <div><span className="text-sm font-medium text-gray-500">Destination:</span> <p className="text-gray-900">{selectedBooking.destination}</p></div>
            <div><span className="text-sm font-medium text-gray-500">Date:</span> <p className="text-gray-900">{selectedBooking.date}</p></div>
            <div><span className="text-sm font-medium text-gray-500">Status:</span> <p className="text-gray-900">{selectedBooking.status}</p></div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default MyBookings
