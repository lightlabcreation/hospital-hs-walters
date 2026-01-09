import React, { useState, useMemo } from 'react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { FiPlus, FiUser, FiSearch, FiEdit2, FiEye, FiTrash2, FiCheck, FiClock } from 'react-icons/fi'

const DoctorsStaff = () => {
  const [activeTab, setActiveTab] = useState('doctors')
  const [searchQuery, setSearchQuery] = useState('')

  // Dummy Data
  const [doctors, setDoctors] = useState([
    { id: 'DOC-2026-001', name: 'Dr. John Smith', dept: 'Cardiology', availability: 'Mon, Wed, Fri', email: 'smith.cardio@hswalters.com', phone: '+91 98XXX 00111', experience: '12 Years', qualifications: 'MBBS, MD (Cardiology)' },
    { id: 'DOC-2026-002', name: 'Dr. Emily Wilson', dept: 'Pediatrics', availability: 'Tue, Thu, Sat', email: 'emily.peds@hswalters.com', phone: '+91 98XXX 00222', experience: '8 Years', qualifications: 'MBBS, DCH' },
    { id: 'DOC-2026-003', name: 'Dr. Robert Brown', dept: 'Neurology', availability: 'Mon-Fri', email: 'brown.neuro@hswalters.com', phone: '+91 98XXX 00333', experience: '15 Years', qualifications: 'MBBS, MD, DM (Neurology)' },
  ])

  const [staff, setStaff] = useState([
    { id: 'STF-2026-001', name: 'Alice Johnson', role: 'Receptionist', shift: 'Morning (09-02)', email: 'alice.rec@hswalters.com', phone: '+91 99XXX 11100', joined: '2024-05-10', status: 'Active' },
    { id: 'STF-2026-002', name: 'Robert Fox', role: 'Billing Manager', shift: 'Day (10-06)', email: 'fox.billing@hswalters.com', phone: '+91 99XXX 11122', joined: '2023-11-20', status: 'Active' },
    { id: 'STF-2026-003', name: 'Mark Wood', role: 'Lab Technician', shift: 'Night (08-08)', email: 'wood.lab@hswalters.com', phone: '+91 99XXX 11133', joined: '2025-01-02', status: 'On Leave' },
  ])

  // State Management
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  const [formData, setFormData] = useState({})

  // Filter Logic
  const filteredData = useMemo(() => {
    const data = activeTab === 'doctors' ? doctors : staff
    return data.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [activeTab, doctors, staff, searchQuery])

  // Handlers
  const handleAdd = () => {
    setIsEdit(false)
    setFormData(activeTab === 'doctors' ? {
      name: '',
      dept: 'General Physician',
      availability: 'Mon-Fri',
      email: '',
      phone: '',
      experience: '',
      qualifications: ''
    } : {
      name: '',
      role: 'Staff',
      shift: 'Day (10-06)',
      email: '',
      phone: '',
      joined: new Date().toISOString().split('T')[0],
      status: 'Active'
    })
    setIsModalOpen(true)
  }

  const handleEdit = (item) => {
    setIsEdit(true)
    setSelectedItem(item)
    setFormData({ ...item })
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

  const confirmDelete = () => {
    if (activeTab === 'doctors') {
      setDoctors(doctors.filter(d => d.id !== selectedItem.id))
    } else {
      setStaff(staff.filter(s => s.id !== selectedItem.id))
    }
    setIsDeleteOpen(false)
    setSelectedItem(null)
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (activeTab === 'doctors') {
      if (isEdit) {
        setDoctors(doctors.map(d => d.id === selectedItem.id ? { ...d, ...formData } : d))
      } else {
        const newItem = { ...formData, id: `DOC-2026-${String(doctors.length + 1).padStart(3, '0')}` }
        setDoctors([newItem, ...doctors])
      }
    } else {
      if (isEdit) {
        setStaff(staff.map(s => s.id === selectedItem.id ? { ...s, ...formData } : s))
      } else {
        const newItem = { ...formData, id: `STF-2026-${String(staff.length + 1).padStart(3, '0')}` }
        setStaff([newItem, ...staff])
      }
    }
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
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
          <button
            onClick={handleAdd}
            className="btn-primary flex items-center gap-2 text-xs uppercase tracking-widest px-6"
          >
            <FiPlus size={16} /> Add Member
          </button>
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
                    <span className="font-black text-[#1d627d] text-sm tracking-tight">{item.id}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-[#1d627d] border border-gray-100">
                        <FiUser size={16} />
                      </div>
                      <div>
                        <div className="font-bold text-gray-800">{item.name}</div>
                        <div className="text-[10px] text-gray-400 font-medium">{item.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${activeTab === 'doctors' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-purple-50 text-purple-600 border-purple-100'}`}>
                      {activeTab === 'doctors' ? item.dept : item.role}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="text-gray-700 font-black text-[10px] uppercase flex items-center justify-center gap-1.5 grayscale opacity-70">
                      <FiClock size={12} /> {activeTab === 'doctors' ? item.availability : item.shift}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => handleView(item)} className="btn-icon" title="View Profile"><FiEye size={16} /></button>
                      <button onClick={() => handleEdit(item)} className="btn-icon" title="Modify Record"><FiEdit2 size={16} /></button>
                      <button onClick={() => handleDeleteClick(item)} className="btn-icon hover:text-red-500" title="Void Account"><FiTrash2 size={16} /></button>
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
            <Button variant="primary" onClick={handleSave}>
              <FiCheck className="mr-2" /> Authorize
            </Button>
          </div>
        }
      >
        <form className="space-y-4 p-1">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Identity Full Name</label>
            <input type="text" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm placeholder:font-normal" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{activeTab === 'doctors' ? 'Specialization' : 'Job Role'}</label>
              {activeTab === 'doctors' ? (
                <input type="text" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm" placeholder="e.g. Cardiology" value={formData.dept || ''} onChange={(e) => setFormData({ ...formData, dept: e.target.value })} />
              ) : (
                <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm" value={formData.role || ''} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                  <option value="Receptionist">Receptionist</option>
                  <option value="Billing Manager">Billing Manager</option>
                  <option value="Lab Technician">Lab Technician</option>
                  <option value="Nurse">Nurse</option>
                </select>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mobile Contact</label>
              <input type="text" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm" value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Official Email</label>
            <input type="email" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">User ID</label>
              <input type="text" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm" placeholder="user.name" value={formData.username || ''} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
              <input type="password" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm" placeholder="******" value={formData.password || ''} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
            </div>
          </div>
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
                <h4 className="text-xl font-black text-[#1D627D] tracking-tight">{selectedItem.name}</h4>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{selectedItem.id} • {activeTab === 'doctors' ? selectedItem.dept : selectedItem.role}</p>
              </div>
            </div>
            <div className="space-y-4 px-1 text-sm font-medium text-gray-700">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                <span>Schedule</span>
                <span className="text-[#1D627D]">{activeTab === 'doctors' ? selectedItem.availability : selectedItem.shift}</span>
              </div>
              {activeTab === 'doctors' && (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="font-black text-[10px] uppercase text-gray-400 mb-1">Qualifications</p>
                  <p className="italic leading-relaxed">{selectedItem.qualifications}</p>
                  <p className="font-black text-[#1D627D] text-[10px] uppercase mt-2 tracking-widest">Experience: {selectedItem.experience}</p>
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
