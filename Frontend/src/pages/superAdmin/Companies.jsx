import React, { useState } from 'react'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { FiSearch, FiEye, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi'

const Companies = () => {
  const [companies, setCompanies] = useState([
    { id: 1, name: 'ABC Logistics', email: 'contact@abclogistics.com', phone: '+91 9876543210', status: 'Active', branches: 5 },
    { id: 2, name: 'XYZ Transport', email: 'info@xyztransport.com', phone: '+91 9876543211', status: 'Active', branches: 3 },
    { id: 3, name: 'Fast Movers', email: 'hello@fastmovers.com', phone: '+91 9876543212', status: 'Inactive', branches: 2 },
    { id: 4, name: 'Global Shipping', email: 'info@globalshipping.com', phone: '+91 9876543213', status: 'Active', branches: 8 },
    { id: 5, name: 'Express Logistics', email: 'contact@expresslog.com', phone: '+91 9876543214', status: 'Active', branches: 4 },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', status: 'Active', branches: '' })

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.phone.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage)
  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleAdd = () => {
    setFormData({ name: '', email: '', phone: '', status: 'Active', branches: '' })
    setIsAddModalOpen(true)
  }

  const handleView = (company) => {
    setSelectedCompany(company)
    setIsViewModalOpen(true)
  }

  const handleEdit = (company) => {
    setSelectedCompany(company)
    setFormData({ ...company })
    setIsEditModalOpen(true)
  }

  const handleDelete = (company) => {
    setSelectedCompany(company)
    setIsDeleteDialogOpen(true)
  }

  const handleSaveAdd = () => {
    const newCompany = {
      id: companies.length + 1,
      ...formData,
      branches: parseInt(formData.branches) || 0,
    }
    setCompanies([...companies, newCompany])
    setIsAddModalOpen(false)
    setFormData({ name: '', email: '', phone: '', status: 'Active', branches: '' })
    setSearchTerm('')
    setCurrentPage(1)
  }

  const handleSaveEdit = () => {
    setCompanies(companies.map(c => c.id === selectedCompany.id ? { ...formData, id: selectedCompany.id, branches: parseInt(formData.branches) || 0 } : c))
    setIsEditModalOpen(false)
    setSelectedCompany(null)
  }

  const handleConfirmDelete = () => {
    setCompanies(companies.filter(c => c.id !== selectedCompany.id))
    setIsDeleteDialogOpen(false)
    setSelectedCompany(null)
    if (paginatedCompanies.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const getStatusBadge = (status) => {
    return status === 'Active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800'
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0" style={{ marginTop: '5.25rem' }}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Companies</h1>
        <Button onClick={handleAdd} className="w-full sm:w-auto flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-sm sm:text-base px-4 py-2">
          <FiPlus size={18} />
          <span>Add Company</span>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by company name, email, or phone..."
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
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Name</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Email</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Phone</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Branches</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedCompanies.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No companies found
                  </td>
                </tr>
              ) : (
                paginatedCompanies.map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{company.id}</td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex flex-col">
                        <span>{company.name}</span>
                        <span className="text-xs text-gray-500 md:hidden">{company.email}</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden md:table-cell">{company.email}</td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden lg:table-cell">{company.phone}</td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden lg:table-cell">{company.branches}</td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(company.status)}`}>
                        {company.status}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <button
                          onClick={() => handleView(company)}
                          className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded hover:bg-blue-50"
                          title="View"
                        >
                          <FiEye size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(company)}
                          className="text-green-600 hover:text-green-900 transition-colors p-1 rounded hover:bg-green-50"
                          title="Edit"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(company)}
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 px-2 sm:px-0">
          <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredCompanies.length)} of {filteredCompanies.length} results
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
            <Button
              variant="secondary"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
            >
              Prev
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
        title="Add Company"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveAdd}>Add</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Branches</label>
            <input
              type="number"
              value={formData.branches}
              onChange={(e) => setFormData({ ...formData, branches: e.target.value })}
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
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Company Details"
        footer={<Button variant="secondary" onClick={() => setIsViewModalOpen(false)}>Close</Button>}
      >
        {selectedCompany && (
          <div className="space-y-3">
            <div><span className="text-sm font-medium text-gray-500">ID:</span> <p className="text-gray-900">{selectedCompany.id}</p></div>
            <div><span className="text-sm font-medium text-gray-500">Name:</span> <p className="text-gray-900">{selectedCompany.name}</p></div>
            <div><span className="text-sm font-medium text-gray-500">Email:</span> <p className="text-gray-900">{selectedCompany.email}</p></div>
            <div><span className="text-sm font-medium text-gray-500">Phone:</span> <p className="text-gray-900">{selectedCompany.phone}</p></div>
            <div><span className="text-sm font-medium text-gray-500">Branches:</span> <p className="text-gray-900">{selectedCompany.branches}</p></div>
            <div><span className="text-sm font-medium text-gray-500">Status:</span> <p className="text-gray-900">{selectedCompany.status}</p></div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Company"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Branches</label>
            <input
              type="number"
              value={formData.branches}
              onChange={(e) => setFormData({ ...formData, branches: e.target.value })}
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
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Company"
        message={`Are you sure you want to delete ${selectedCompany?.name}?`}
      />
    </div>
  )
}

export default Companies
