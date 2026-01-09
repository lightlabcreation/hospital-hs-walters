import React, { useState, useEffect, useMemo } from 'react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { FiPlus, FiSearch, FiEdit2, FiEye, FiTrash2, FiUser, FiCheck, FiLoader } from 'react-icons/fi'
import { patientAPI } from '../../api/services'
import { useAuth } from '../../context/AuthContext'

const Patients = () => {
  const { role } = useAuth()
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // State Management
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: 'Male',
    phone: '',
    address: '',
    bloodGroup: 'A+',
    history: ''
  })

  // Fetch patients on mount
  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    try {
      setLoading(true)
      const response = await patientAPI.getAll()
      setPatients(response.data.data || [])
      setError('')
    } catch (err) {
      console.error('Failed to fetch patients:', err)
      setError('Failed to load patients')
    } finally {
      setLoading(false)
    }
  }

  // Filter Logic
  const filteredPatients = useMemo(() => {
    return patients.filter(p =>
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.patientId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone?.includes(searchQuery)
    )
  }, [patients, searchQuery])

  // Handlers
  const handleAdd = () => {
    setIsEdit(false)
    setFormData({
      name: '',
      email: '',
      password: '',
      age: '',
      gender: 'Male',
      phone: '',
      address: '',
      bloodGroup: 'A+',
      history: ''
    })
    setIsModalOpen(true)
  }

  const handleEdit = (item) => {
    setIsEdit(true)
    setSelectedItem(item)
    setFormData({
      name: item.name || '',
      email: item.email || '',
      password: '',
      age: item.age || '',
      gender: item.gender || 'Male',
      phone: item.phone || '',
      address: item.address || '',
      bloodGroup: item.bloodGroup || 'A+',
      history: item.history || ''
    })
    setIsModalOpen(true)
  }

  const handleDeleteClick = (item) => {
    setSelectedItem(item)
    setIsDeleteOpen(true)
  }

  const handleView = (item) => {
    setSelectedItem(item)
    setIsViewOpen(true)
  }

  const confirmDelete = async () => {
    try {
      await patientAPI.delete(selectedItem.id)
      setPatients(patients.filter(p => p.id !== selectedItem.id))
      setIsDeleteOpen(false)
      setSelectedItem(null)
    } catch (err) {
      console.error('Failed to delete patient:', err)
      alert('Failed to delete patient')
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (isEdit) {
        await patientAPI.update(selectedItem.id, formData)
      } else {
        await patientAPI.create(formData)
      }
      await fetchPatients()
      setIsModalOpen(false)
    } catch (err) {
      console.error('Failed to save patient:', err)
      alert(err.response?.data?.message || 'Failed to save patient')
    } finally {
      setSaving(false)
    }
  }

  // Check if user can create/edit patients
  const canEdit = ['super_admin', 'receptionist'].includes(role)
  const canDelete = role === 'super_admin'

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FiLoader className="animate-spin text-[#1d627d]" size={32} />
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">Patient Records</h2>
          <p className="text-gray-500 text-sm font-medium italic">Manage clinical profiles and medical background</p>
        </div>
        <div className="flex w-full sm:w-auto gap-3">
          <div className="relative flex-1 sm:w-64 group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1d627d] transition-colors" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-4 focus:ring-[#90e0ef]/30 font-medium text-sm transition-all"
            />
          </div>
          {canEdit && (
            <button
              onClick={handleAdd}
              className="btn-primary flex items-center gap-2 text-xs uppercase tracking-widest px-6"
            >
              <FiPlus size={16} /> New Patient
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Patients Table */}
      <Card className="overflow-hidden p-0 border-gray-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#90E0EF]/10 text-[#1D627D] uppercase text-[10px] font-black tracking-widest">
              <tr>
                <th className="px-6 py-4 border-b">Member ID</th>
                <th className="px-6 py-4 border-b">Basic Info</th>
                <th className="px-6 py-4 border-b text-center">Age / Gender</th>
                <th className="px-6 py-4 border-b">Last Encounter</th>
                <th className="px-6 py-4 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-black text-[#1d627d] text-sm tracking-tight">{patient.patientId}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase mt-0.5 tracking-widest">Type: General</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800 text-sm">{patient.name}</div>
                      <div className="text-[10px] text-gray-400 font-medium italic truncate max-w-[150px]">{patient.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{patient.age}Y • {patient.gender}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold text-gray-500 whitespace-nowrap">
                        {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleView(patient)}
                          className="btn-icon"
                          title="View Digital Record"
                        >
                          <FiEye size={16} />
                        </button>
                        {canEdit && (
                          <button
                            onClick={() => handleEdit(patient)}
                            className="btn-icon"
                            title="Edit Profile"
                          >
                            <FiEdit2 size={16} />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => handleDeleteClick(patient)}
                            className="btn-icon hover:text-red-500"
                            title="Archive"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center text-gray-400 italic font-medium">
                    {searchQuery ? 'No results matched your search criteria.' : 'No patients found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination placeholder */}
        <div className="p-4 border-t border-gray-50 bg-gray-50/20 flex justify-between items-center text-[10px] font-black uppercase text-gray-400">
          <span>{filteredPatients.length} Active Records</span>
        </div>
      </Card>

      {/* Add / Edit Patient Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEdit ? 'Update Record' : 'Enroll Patient'}
        size="md"
        footer={
          <div className="flex gap-2 w-full justify-end">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Discard</Button>
            <Button variant="primary" onClick={handleSave} disabled={saving}>
              <FiCheck className="mr-2" /> {saving ? 'Saving...' : (isEdit ? 'Save Changes' : 'Register')}
            </Button>
          </div>
        }
      >
        <form className="space-y-4 p-1">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
            <input type="text" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm placeholder:font-normal" placeholder="e.g. John Doe" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          {!isEdit && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                <input type="email" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm" placeholder="patient@email.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
                <input type="password" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm" placeholder="******" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Age</label>
              <input type="number" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm" placeholder="25" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Gender</label>
              <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone</label>
              <input type="text" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm" placeholder="+1 555-0000" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Blood Group</label>
              <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm" value={formData.bloodGroup} onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}>
                <option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Address</label>
            <input type="text" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm" placeholder="123 Main St, City" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Medical History</label>
            <textarea rows="3" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none font-medium text-sm" placeholder="Allergies, chronic conditions..." value={formData.history} onChange={(e) => setFormData({ ...formData, history: e.target.value })}></textarea>
          </div>
        </form>
      </Modal>

      {/* View Profile Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Patient Brief"
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
                <h4 className="text-xl font-black text-[#1d627d]">{selectedItem.name}</h4>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">{selectedItem.patientId} • {selectedItem.bloodGroup}</p>
              </div>
            </div>
            <div className="space-y-3 px-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">contact</span>
                <span className="font-black text-gray-800">{selectedItem.phone}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">age/gender</span>
                <span className="font-black text-gray-800">{selectedItem.age}Y • {selectedItem.gender}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">email</span>
                <span className="font-black text-gray-800">{selectedItem.email}</span>
              </div>
              {selectedItem.history && (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 italic text-xs text-gray-600 leading-relaxed">
                  "{selectedItem.history}"
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
        title="Archive Record"
        message="Move this patient to the archive? This will not delete clinical history."
      />
    </div>
  )
}

export default Patients
