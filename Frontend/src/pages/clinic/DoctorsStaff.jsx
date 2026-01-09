import React, { useState, useMemo, useEffect } from 'react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { FiPlus, FiUser, FiSearch, FiEdit2, FiEye, FiTrash2, FiCheck, FiClock } from 'react-icons/fi'
import { userAPI, doctorAPI } from '../../api/services'
import { useAuth } from '../../context/AuthContext'

const DoctorsStaff = () => {
  const { role } = useAuth()

  // Role-based permissions
  const canCreate = role === 'super_admin'
  const canEdit = role === 'super_admin'
  const canDelete = role === 'super_admin'

  const [activeTab, setActiveTab] = useState('doctors')
  const [searchQuery, setSearchQuery] = useState('')

  // State
  const [doctors, setDoctors] = useState([])
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  // State Management
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  const [formData, setFormData] = useState({})

  // Fetch data on mount
  useEffect(() => {
    fetchDoctors()
    fetchStaff()
  }, [])

  const fetchDoctors = async () => {
    try {
      setLoading(true)
      const response = await doctorAPI.getAll()
      setDoctors(response.data.data || [])
    } catch (err) {
      setError('Failed to load doctors')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchStaff = async () => {
    try {
      const response = await userAPI.getAll({ role: 'receptionist,billing_staff' })
      setStaff(response.data.data || [])
    } catch (err) {
      console.error('Failed to load staff:', err)
    }
  }

  // Helper functions
  const getDoctorName = (doc) => doc.user?.firstName + ' ' + doc.user?.lastName || 'Unknown'
  const getStaffName = (stf) => stf.firstName + ' ' + stf.lastName || 'Unknown'

  // Filter Logic
  const filteredData = useMemo(() => {
    const data = activeTab === 'doctors' ? doctors : staff
    return data.filter(item => {
      const name = activeTab === 'doctors' ? getDoctorName(item) : getStaffName(item)
      const query = searchQuery.toLowerCase()
      return name.toLowerCase().includes(query) || String(item.id).includes(query)
    })
  }, [activeTab, doctors, staff, searchQuery])

  // Handlers
  const handleAdd = () => {
    if (!canCreate) return
    setIsEdit(false)
    setFormData(activeTab === 'doctors' ? {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      specialty: 'General Physician',
      role: 'doctor'
    } : {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'receptionist'
    })
    setIsModalOpen(true)
  }

  const handleEdit = (item) => {
    if (!canEdit) return
    setIsEdit(true)
    setSelectedItem(item)
    if (activeTab === 'doctors') {
      setFormData({
        firstName: item.user?.firstName || '',
        lastName: item.user?.lastName || '',
        email: item.user?.email || '',
        specialty: item.specialty || ''
      })
    } else {
      setFormData({
        firstName: item.firstName || '',
        lastName: item.lastName || '',
        email: item.email || '',
        role: item.role || 'receptionist'
      })
    }
    setIsModalOpen(true)
  }

  const handleDeleteClick = (item) => {
    if (!canDelete) return
    setSelectedItem(item)
    setIsDeleteOpen(true)
  }

  const handleView = (item) => {
    setSelectedItem(item)
    setIsViewOpen(true)
  }

  const confirmDelete = async () => {
    try {
      if (activeTab === 'doctors') {
        await userAPI.delete(selectedItem.userId)
        setDoctors(doctors.filter(d => d.id !== selectedItem.id))
      } else {
        await userAPI.delete(selectedItem.id)
        setStaff(staff.filter(s => s.id !== selectedItem.id))
      }
    } catch (err) {
      console.error('Delete failed:', err)
      setError('Failed to delete user')
    } finally {
      setIsDeleteOpen(false)
      setSelectedItem(null)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (isEdit) {
        const userId = activeTab === 'doctors' ? selectedItem.userId : selectedItem.id
        await userAPI.update(userId, formData)
      } else {
        await userAPI.create(formData)
      }
      await fetchDoctors()
      await fetchStaff()
      setIsModalOpen(false)
    } catch (err) {
      console.error('Save failed:', err)
      setError(err.response?.data?.message || 'Failed to save user')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1d627d]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
          <button onClick={() => setError('')} className="ml-4 text-red-400 hover:text-red-600">Dismiss</button>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">Personnel Directory</h2>
          <p className="text-gray-500 text-sm font-medium italic">Clinical staff and administrative team management</p>
        </div>
        <div className="flex w-full sm:w-auto gap-3">
          <div className="relative flex-1 sm:w-64 group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1d627d] transition-colors" />
            <input
              type="text"
              placeholder="Search roster..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-4 focus:ring-[#90e0ef]/30 font-medium text-sm transition-all"
            />
          </div>
          {canCreate && (
            <button
              onClick={handleAdd}
              className="btn-primary flex items-center gap-2 text-xs uppercase tracking-widest px-6"
            >
              <FiPlus size={16} /> Add Member
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100 w-fit">
        <button
          className={`py-2 px-6 rounded-lg font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === 'doctors' ? 'bg-[#90e0ef] text-[#1d627d] shadow-sm border border-blue-200' : 'text-gray-400 hover:text-gray-600'}`}
          onClick={() => setActiveTab('doctors')}
        >
          Doctors
        </button>
        <button
          className={`py-2 px-6 rounded-lg font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === 'staff' ? 'bg-[#90e0ef] text-[#1d627d] shadow-sm border border-blue-200' : 'text-gray-400 hover:text-gray-600'}`}
          onClick={() => setActiveTab('staff')}
        >
          Operations
        </button>
      </div>

      {/* Main Content Card */}
      <Card className="overflow-hidden p-0 border-gray-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#90E0EF]/10 text-[#1D627D] uppercase text-[10px] font-black tracking-widest">
              <tr>
                <th className="px-6 py-4 border-b">Member ID</th>
                <th className="px-6 py-4 border-b">{activeTab === 'doctors' ? 'Doctor Name' : 'Staff Name'}</th>
                <th className="px-6 py-4 border-b">{activeTab === 'doctors' ? 'Specialization' : 'Job Role'}</th>
                <th className="px-6 py-4 border-b text-center">{activeTab === 'doctors' ? 'Slots' : 'Shift'}</th>
                <th className="px-6 py-4 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-5">
                    <span className="font-black text-[#1d627d] text-sm tracking-tight">{activeTab === 'doctors' ? 'DOC' : 'STF'}-{item.id}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-[#1d627d] border border-gray-100">
                        <FiUser size={16} />
                      </div>
                      <div>
                        <div className="font-bold text-gray-800">{activeTab === 'doctors' ? getDoctorName(item) : getStaffName(item)}</div>
                        <div className="text-[10px] text-gray-400 font-medium">{activeTab === 'doctors' ? item.user?.email : item.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${activeTab === 'doctors' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-purple-50 text-purple-600 border-purple-100'}`}>
                      {activeTab === 'doctors' ? item.specialty : item.role}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="text-gray-700 font-black text-[10px] uppercase flex items-center justify-center gap-1.5 grayscale opacity-70">
                      <FiClock size={12} /> {activeTab === 'doctors' ? 'Available' : item.role}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => handleView(item)} className="btn-icon" title="View Profile"><FiEye size={16} /></button>
                      {canEdit && <button onClick={() => handleEdit(item)} className="btn-icon" title="Modify Record"><FiEdit2 size={16} /></button>}
                      {canDelete && <button onClick={() => handleDeleteClick(item)} className="btn-icon hover:text-red-500" title="Void Account"><FiTrash2 size={16} /></button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEdit ? 'Update Profile' : 'Onboard Member'}
        size="md"
        footer={
          <div className="flex gap-2 w-full justify-end">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Discard</Button>
            <Button variant="primary" onClick={handleSave} loading={saving}>
              <FiCheck className="mr-2" /> Authorize
            </Button>
          </div>
        }
      >
        <form className="space-y-4 p-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">First Name</label>
              <input type="text" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm placeholder:font-normal" value={formData.firstName || ''} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
              <input type="text" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm placeholder:font-normal" value={formData.lastName || ''} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{activeTab === 'doctors' ? 'Specialization' : 'Job Role'}</label>
              {activeTab === 'doctors' ? (
                <input type="text" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm" placeholder="e.g. Cardiology" value={formData.specialty || ''} onChange={(e) => setFormData({ ...formData, specialty: e.target.value })} />
              ) : (
                <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm" value={formData.role || ''} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                  <option value="receptionist">Receptionist</option>
                  <option value="billing_staff">Billing Staff</option>
                </select>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Official Email</label>
              <input type="email" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
          </div>
          {!isEdit && (
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
              <input type="password" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm" placeholder="******" value={formData.password || ''} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
            </div>
          )}
        </form>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Personnel Brief"
        size="sm"
        footer={<Button variant="primary" onClick={() => setIsViewOpen(false)}>Dismiss</Button>}
      >
        {selectedItem && (
          <div className="space-y-6">
            <div className="card-soft-blue flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-blue-100">
                <FiUser size={24} className="text-[#1d627d]" />
              </div>
              <div>
                <h4 className="text-xl font-black text-[#1D627D] tracking-tight">{activeTab === 'doctors' ? getDoctorName(selectedItem) : getStaffName(selectedItem)}</h4>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{activeTab === 'doctors' ? 'DOC' : 'STF'}-{selectedItem.id} • {activeTab === 'doctors' ? selectedItem.specialty : selectedItem.role}</p>
              </div>
            </div>
            <div className="space-y-4 px-1 text-sm font-medium text-gray-700">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                <span>Email</span>
                <span className="text-[#1D627D]">{activeTab === 'doctors' ? selectedItem.user?.email : selectedItem.email}</span>
              </div>
              {activeTab === 'doctors' && selectedItem.specialty && (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="font-black text-[10px] uppercase text-gray-400 mb-1">Specialty</p>
                  <p className="font-bold text-gray-700">{selectedItem.specialty}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Void Access"
        message={`Permanently remove ${selectedItem?.name} from clinical systems?`}
      />
    </div>
  )
}

export default DoctorsStaff
