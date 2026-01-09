import React, { useState, useMemo } from 'react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { FiPlus, FiSearch, FiCalendar, FiClock, FiUser, FiEdit2, FiTrash2, FiEye, FiCheck } from 'react-icons/fi'

const Appointments = () => {
  // Dummy Data
  const [appointments, setAppointments] = useState([
    { id: 'APT-2026-001', patient: 'John Doe', doctor: 'Dr. Smith', date: 'Jan 06, 2026', time: '10:00 AM', status: 'Scheduled', reason: 'Routine Checkup', type: 'Offline' },
    { id: 'APT-2026-002', patient: 'Jane Roe', doctor: 'Dr. Emily', date: 'Jan 06, 2026', time: '10:30 AM', status: 'Completed', reason: 'Fever & Cold', type: 'Online' },
    { id: 'APT-2026-003', patient: 'Mike Ross', doctor: 'Dr. Smith', date: 'Jan 06, 2026', time: '11:00 AM', status: 'Cancelled', reason: 'Follow-up', type: 'Offline' },
    { id: 'APT-2026-004', patient: 'Rachel Z', doctor: 'Dr. Brown', date: 'Jan 07, 2026', time: '09:00 AM', status: 'Scheduled', reason: 'Blood Test', type: 'Offline' },
    { id: 'APT-2026-005', patient: 'Harvey S', doctor: 'Dr. Emily', date: 'Jan 07, 2026', time: '09:30 AM', status: 'Scheduled', reason: 'Skin Rash', type: 'Online' },
  ])

  // State Management
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  const [formData, setFormData] = useState({
    patient: '',
    doctor: '',
    date: '',
    time: '',
    status: 'Scheduled',
    reason: '',
    type: 'Offline'
  })

  // Filter Logic
  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt =>
      apt.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.doctor.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [appointments, searchQuery])

  // Handlers
  const handleAdd = () => {
    setIsEdit(false)
    setFormData({
      patient: '',
      doctor: '',
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM',
      status: 'Scheduled',
      reason: '',
      type: 'Offline'
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
    setAppointments(appointments.filter(a => a.id !== selectedItem.id))
    setIsDeleteOpen(false)
    setSelectedItem(null)
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (isEdit) {
      setAppointments(appointments.map(a => a.id === selectedItem.id ? { ...a, ...formData } : a))
    } else {
      const newApt = {
        ...formData,
        id: `APT-2026-${String(appointments.length + 1).padStart(3, '0')}`,
      }
      setAppointments([newApt, ...appointments])
    }
    setIsModalOpen(false)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-50 text-blue-600 border-blue-100'
      case 'Completed': return 'bg-green-50 text-green-600 border-green-100'
      case 'Cancelled': return 'bg-red-50 text-red-600 border-red-100'
      default: return 'bg-gray-50 text-gray-500 border-gray-100'
    }
  }

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">Visit Roster</h2>
          <p className="text-gray-500 text-sm font-medium italic">Managed scheduling and consultation queue</p>
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
            <FiPlus size={16} /> Book Slot
          </button>
        </div>
      </div>

      {/* Appointments List/Table */}
      <Card className="overflow-hidden p-0 border-gray-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#90E0EF]/10 text-[#1D627D] uppercase text-[10px] font-black tracking-widest">
              <tr>
                <th className="px-6 py-4 border-b">Apt Token</th>
                <th className="px-6 py-4 border-b">Patient</th>
                <th className="px-6 py-4 border-b">Doctor</th>
                <th className="px-6 py-4 border-b">Schedule Card</th>
                <th className="px-6 py-4 border-b">Status</th>
                <th className="px-6 py-4 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredAppointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 font-black text-[#1d627d] text-sm tracking-tight">{apt.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-800 text-sm">{apt.patient}</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-1">{apt.type} Session</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-[#1d627d]">
                        <FiUser size={12} />
                      </div>
                      <span className="text-sm font-bold text-gray-700">{apt.doctor}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-bold text-gray-600 flex items-center gap-1.5 whitespace-nowrap">
                      <FiCalendar size={13} className="text-[#90e0ef]" /> {apt.date}
                    </div>
                    <div className="text-[10px] text-gray-400 font-black uppercase mt-0.5 tracking-tighter flex items-center gap-1.5">
                      <FiClock size={11} className="text-orange-400" /> {apt.time}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getStatusColor(apt.status)}`}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => handleView(apt)} className="btn-icon" title="View Detail"><FiEye size={16} /></button>
                      <button onClick={() => handleEdit(apt)} className="btn-icon" title="Modify Slot"><FiEdit2 size={16} /></button>
                      <button onClick={() => handleDeleteClick(apt)} className="btn-icon hover:text-red-500" title="Void"><FiTrash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Book / Edit Appointment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEdit ? 'Modify Schedule' : 'New Clinical Slot'}
        size="md"
        footer={
          <div className="flex gap-2 w-full justify-end">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Discard</Button>
            <Button variant="primary" onClick={handleSave}>
              <FiCheck className="mr-2" /> {isEdit ? 'Update Slot' : 'Authorize Visit'}
            </Button>
          </div>
        }
      >
        <form className="space-y-4 p-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Patient Name</label>
              <input type="text" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm placeholder:font-normal" placeholder="John Doe" value={formData.patient} onChange={(e) => setFormData({ ...formData, patient: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Assigned Physician</label>
              <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm" value={formData.doctor} onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}>
                <option value="">Select Doctor</option>
                <option value="Dr. Smith">Dr. Smith (Cardio)</option>
                <option value="Dr. Emily">Dr. Emily (Peds)</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Schedule Date</label>
              <input type="date" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Preferred Slot</label>
              <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })}>
                <option>09:00 AM</option><option>10:00 AM</option><option>11:00 AM</option>
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Visit Narrative</label>
            <textarea rows="2" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none font-medium text-sm" placeholder="Reason for consultation..." value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })}></textarea>
          </div>
        </form>
      </Modal>

      {/* Appointment Details Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Consultation Summary"
        size="sm"
        footer={<Button variant="primary" onClick={() => setIsViewOpen(false)}>Dismiss</Button>}
      >
        {selectedItem && (
          <div className="space-y-6">
            <div className="card-soft-blue flex justify-between items-center">
              <div>
                <h4 className="text-xl font-black text-[#1d627d] tracking-tight">{selectedItem.id}</h4>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Confirmed clinical entry</p>
              </div>
              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border border-blue-100 bg-white`}>
                {selectedItem.status}
              </span>
            </div>
            <div className="space-y-4 px-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] self-center">subject</span>
                <span className="font-black text-gray-800">{selectedItem.patient}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] self-center">physician</span>
                <span className="font-black text-[#1d627d]">{selectedItem.doctor}</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 italic text-xs text-gray-600">
                "{selectedItem.reason}"
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Void Slot"
        message={`Authorize cancellation of appointment ${selectedItem?.id}? This action is irreversible.`}
      />
    </div>
  )
}

export default Appointments
