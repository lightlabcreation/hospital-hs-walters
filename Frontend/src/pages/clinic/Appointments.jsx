import React, { useState, useMemo, useEffect } from 'react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { FiPlus, FiSearch, FiCalendar, FiClock, FiUser, FiEdit2, FiTrash2, FiEye, FiCheck } from 'react-icons/fi'
import { appointmentAPI, patientAPI, doctorAPI } from '../../api/services'
import { useAuth } from '../../context/AuthContext'

const Appointments = () => {
  const { role } = useAuth()

  // Role-based permissions
  const canCreate = ['super_admin', 'doctor', 'receptionist'].includes(role)
  const canEdit = ['super_admin', 'doctor', 'receptionist'].includes(role)
  const canDelete = ['super_admin', 'receptionist'].includes(role)

  // State
  const [appointments, setAppointments] = useState([])
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
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
    patientId: '',
    doctorId: '',
    dateTime: '',
    status: 'scheduled',
    reason: '',
    type: 'offline'
  })

  // Fetch data on mount
  useEffect(() => {
    fetchAppointments()
    fetchPatients()
    fetchDoctors()
  }, [])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const response = await appointmentAPI.getAll()
      setAppointments(response.data.data || [])
    } catch (err) {
      setError('Failed to load appointments')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchPatients = async () => {
    try {
      const response = await patientAPI.getAll()
      setPatients(response.data.data || [])
    } catch (err) {
      console.error('Failed to load patients:', err)
    }
  }

  const fetchDoctors = async () => {
    try {
      const response = await doctorAPI.getAll()
      setDoctors(response.data.data || [])
    } catch (err) {
      console.error('Failed to load doctors:', err)
    }
  }

  // Helper to format display values
  const getPatientName = (apt) => apt.patient?.firstName + ' ' + apt.patient?.lastName || 'Unknown'
  const getDoctorName = (apt) => apt.doctor?.user?.firstName + ' ' + apt.doctor?.user?.lastName || 'Unknown'
  const formatDate = (dateTime) => {
    if (!dateTime) return ''
    const d = new Date(dateTime)
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
  }
  const formatTime = (dateTime) => {
    if (!dateTime) return ''
    const d = new Date(dateTime)
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  // Filter Logic
  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      const patientName = getPatientName(apt).toLowerCase()
      const doctorName = getDoctorName(apt).toLowerCase()
      const query = searchQuery.toLowerCase()
      return patientName.includes(query) || doctorName.includes(query) || String(apt.id).includes(query)
    })
  }, [appointments, searchQuery])

  // Handlers
  const handleAdd = () => {
    if (!canCreate) return
    setIsEdit(false)
    const now = new Date()
    now.setHours(10, 0, 0, 0)
    setFormData({
      patientId: '',
      doctorId: '',
      dateTime: now.toISOString().slice(0, 16),
      status: 'scheduled',
      reason: '',
      type: 'offline'
    })
    setIsModalOpen(true)
  }

  const handleEdit = (item) => {
    if (!canEdit) return
    setIsEdit(true)
    setSelectedItem(item)
    const dt = item.dateTime ? new Date(item.dateTime).toISOString().slice(0, 16) : ''
    setFormData({
      patientId: item.patientId || '',
      doctorId: item.doctorId || '',
      dateTime: dt,
      status: item.status || 'scheduled',
      reason: item.reason || '',
      type: item.type || 'offline'
    })
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
      await appointmentAPI.delete(selectedItem.id)
      setAppointments(appointments.filter(a => a.id !== selectedItem.id))
    } catch (err) {
      console.error('Delete failed:', err)
      setError('Failed to delete appointment')
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
        await appointmentAPI.update(selectedItem.id, formData)
      } else {
        await appointmentAPI.create(formData)
      }
      await fetchAppointments()
      setIsModalOpen(false)
    } catch (err) {
      console.error('Save failed:', err)
      setError(err.response?.data?.message || 'Failed to save appointment')
    } finally {
      setSaving(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-50 text-blue-600 border-blue-100'
      case 'completed': return 'bg-green-50 text-green-600 border-green-100'
      case 'cancelled': return 'bg-red-50 text-red-600 border-red-100'
      case 'no_show': return 'bg-yellow-50 text-yellow-600 border-yellow-100'
      default: return 'bg-gray-50 text-gray-500 border-gray-100'
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
          {canCreate && (
            <button
              onClick={handleAdd}
              className="btn-primary flex items-center gap-2 text-xs uppercase tracking-widest px-6"
            >
              <FiPlus size={16} /> Book Slot
            </button>
          )}
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
                  <td className="px-6 py-4 font-black text-[#1d627d] text-sm tracking-tight">APT-{apt.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-800 text-sm">{getPatientName(apt)}</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-1">{apt.type || 'offline'} Session</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-[#1d627d]">
                        <FiUser size={12} />
                      </div>
                      <span className="text-sm font-bold text-gray-700">{getDoctorName(apt)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-bold text-gray-600 flex items-center gap-1.5 whitespace-nowrap">
                      <FiCalendar size={13} className="text-[#90e0ef]" /> {formatDate(apt.dateTime)}
                    </div>
                    <div className="text-[10px] text-gray-400 font-black uppercase mt-0.5 tracking-tighter flex items-center gap-1.5">
                      <FiClock size={11} className="text-orange-400" /> {formatTime(apt.dateTime)}
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
                      {canEdit && <button onClick={() => handleEdit(apt)} className="btn-icon" title="Modify Slot"><FiEdit2 size={16} /></button>}
                      {canDelete && <button onClick={() => handleDeleteClick(apt)} className="btn-icon hover:text-red-500" title="Void"><FiTrash2 size={16} /></button>}
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
            <Button variant="primary" onClick={handleSave} loading={saving}>
              <FiCheck className="mr-2" /> {isEdit ? 'Update Slot' : 'Authorize Visit'}
            </Button>
          </div>
        }
      >
        <form className="space-y-4 p-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Patient</label>
              <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm" value={formData.patientId} onChange={(e) => setFormData({ ...formData, patientId: parseInt(e.target.value) || '' })}>
                <option value="">Select Patient</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Assigned Physician</label>
              <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm" value={formData.doctorId} onChange={(e) => setFormData({ ...formData, doctorId: parseInt(e.target.value) || '' })}>
                <option value="">Select Doctor</option>
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>{d.user?.firstName} {d.user?.lastName} - {d.specialty}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date & Time</label>
              <input type="datetime-local" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm" value={formData.dateTime} onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Type</label>
              <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                <option value="offline">Offline</option>
                <option value="online">Online</option>
              </select>
            </div>
          </div>
          {isEdit && (
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Status</label>
              <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no_show">No Show</option>
              </select>
            </div>
          )}
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
                <h4 className="text-xl font-black text-[#1d627d] tracking-tight">APT-{selectedItem.id}</h4>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Confirmed clinical entry</p>
              </div>
              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${getStatusColor(selectedItem.status)}`}>
                {selectedItem.status}
              </span>
            </div>
            <div className="space-y-4 px-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] self-center">subject</span>
                <span className="font-black text-gray-800">{getPatientName(selectedItem)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] self-center">physician</span>
                <span className="font-black text-[#1d627d]">{getDoctorName(selectedItem)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] self-center">date</span>
                <span className="font-bold text-gray-700">{formatDate(selectedItem.dateTime)} at {formatTime(selectedItem.dateTime)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] self-center">type</span>
                <span className="font-bold text-gray-700 uppercase">{selectedItem.type || 'offline'}</span>
              </div>
              {selectedItem.reason && (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 italic text-xs text-gray-600">
                  "{selectedItem.reason}"
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
        title="Void Slot"
        message={`Authorize cancellation of appointment ${selectedItem?.id}? This action is irreversible.`}
      />
    </div>
  )
}

export default Appointments
