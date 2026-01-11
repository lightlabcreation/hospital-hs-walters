import React, { useState, useMemo, useEffect } from 'react'
import { FiPlus, FiSearch, FiFileText, FiDownload, FiEdit2, FiTrash2, FiCheck } from 'react-icons/fi'
import Modal from '../../components/common/Modal'
import Button from '../../components/common/Button'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import Card from '../../components/common/Card'
import { printElement, downloadData, generateBaseReport } from '../../utils/helpers'
import { prescriptionAPI, patientAPI, doctorAPI } from '../../api/services'
import { useAuth } from '../../context/AuthContext'

const Prescriptions = () => {
  const { role } = useAuth()

  // Role-based permissions
  const canCreate = ['super_admin', 'doctor'].includes(role)
  const canEdit = ['super_admin', 'doctor'].includes(role)
  const canDelete = ['super_admin'].includes(role)

  // State
  const [prescriptions, setPrescriptions] = useState([])
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  // State Management
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    medications: '',
    dosage: '',
    duration: '',
    status: 'active',
    instructions: ''
  })

  // Fetch data on mount
  useEffect(() => {
    fetchPrescriptions()
    fetchPatients()
    fetchDoctors()
  }, [])

  const fetchPrescriptions = async () => {
    try {
      setLoading(true)
      const response = await prescriptionAPI.getAll()
      setPrescriptions(response.data.data || [])
    } catch (err) {
      setError('Failed to load prescriptions')
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
  const getPatientName = (pre) => {
    if (!pre.patient && !pre.patientId) return 'Unknown';
    if (typeof pre.patient === 'string') return pre.patient; // API returns string name
    if (pre.patient?.name) return pre.patient.name;
    return pre.patient?.firstName ? `${pre.patient.firstName} ${pre.patient.lastName || ''}`.trim() : pre.patientId;
  }

  const getDoctorName = (pre) => {
    if (!pre.doctor && !pre.doctorId) return 'Unknown';
    if (typeof pre.doctor === 'string') return pre.doctor; // API returns string name
    if (pre.doctor?.name) return pre.doctor.name;
    // Fallback for nested user object
    if (pre.doctor?.user?.firstName) return `${pre.doctor.user.firstName} ${pre.doctor.user.lastName || ''}`.trim();
    return pre.doctorId;
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
  }

  // Filtered Data
  const filteredPrescriptions = useMemo(() => {
    return prescriptions.filter(pre => {
      const patientName = getPatientName(pre).toLowerCase()
      const query = searchQuery.toLowerCase()
      return patientName.includes(query) ||
        String(pre.prescriptionId || pre.id).toLowerCase().includes(query) ||
        (pre.medications || '').toLowerCase().includes(query)
    })
  }, [prescriptions, searchQuery])

  // Handlers
  const handleAdd = () => {
    if (!canCreate) return
    setIsEdit(false)
    setFormData({
      patientId: '',
      doctorId: '',
      medications: '',
      dosage: '',
      duration: '',
      status: 'active',
      instructions: ''
    })
    setIsModalOpen(true)
  }

  const handleEdit = (item) => {
    if (!canEdit) return
    setIsEdit(true)
    setSelectedItem(item)
    setFormData({
      patientId: item.patientId || '',
      doctorId: item.doctorId || '',
      medications: item.medications || '',
      dosage: item.dosage || '',
      duration: item.duration || '',
      status: item.status || 'active',
      instructions: item.instructions || ''
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

  const handlePrint = () => {
    printElement('Prescription')
  }

  const handleDownload = (item) => {
    const report = generateBaseReport([item], 'Medical Prescription')
    downloadData(report, `PRE-${item.id}.txt`)
  }

  const confirmDelete = async () => {
    try {
      await prescriptionAPI.delete(selectedItem.id)
      setPrescriptions(prescriptions.filter(p => p.id !== selectedItem.id))
    } catch (err) {
      console.error('Delete failed:', err)
      setError('Failed to delete prescription')
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
        await prescriptionAPI.update(selectedItem.id, formData)
      } else {
        await prescriptionAPI.create(formData)
      }
      await fetchPrescriptions()
      setIsModalOpen(false)
    } catch (err) {
      console.error('Save failed:', err)
      setError(err.response?.data?.message || 'Failed to save prescription')
    } finally {
      setSaving(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-50 text-green-600 border-green-100'
      case 'completed': return 'bg-blue-50 text-blue-600 border-blue-100'
      case 'cancelled': return 'bg-red-50 text-red-600 border-red-100'
      default: return 'bg-gray-50 text-gray-400 border-gray-100'
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
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">Prescription Bank</h2>
          <p className="text-gray-500 text-sm font-medium italic">Managed pharmacopeia and medical orders</p>
        </div>
        <div className="flex w-full sm:w-auto gap-3">
          <div className="relative flex-1 sm:w-64 group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1d627d] transition-colors" />
            <input
              type="text"
              placeholder="Search scripts..."
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
              <FiPlus size={16} /> New Entry
            </button>
          )}
        </div>
      </div>

      {/* Table Section */}
      <Card className="overflow-hidden p-0 border-gray-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#90E0EF]/10 text-[#1D627D] uppercase text-[10px] font-black tracking-widest">
              <tr>
                <th className="px-6 py-4 border-b">Script ID</th>
                <th className="px-6 py-4 border-b">Recipient</th>
                <th className="px-6 py-4 border-b">Authorized By</th>
                <th className="px-6 py-4 border-b">Medication</th>
                <th className="px-6 py-4 border-b">Status</th>
                <th className="px-6 py-4 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {filteredPrescriptions.map((pre) => (
                <tr key={pre.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-black text-[#1d627d]">{pre.prescriptionId || `PRE-${pre.id}`}</span>
                    <div className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{formatDate(pre.date || pre.createdAt)}</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-800">{getPatientName(pre)}</td>
                  <td className="px-6 py-4 text-gray-700 font-medium">{getDoctorName(pre)}</td>
                  <td className="px-6 py-4">
                    <div className="max-w-[150px] truncate font-black text-[#1d627d]">{pre.medications}</div>
                    <div className="text-[10px] text-gray-400 italic truncate max-w-[150px]">{pre.instructions}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${getStatusColor(pre.status)}`}>
                      {pre.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => handleView(pre)} className="btn-icon" title="View Details"><FiFileText size={16} /></button>
                      {canEdit && <button onClick={() => handleEdit(pre)} className="btn-icon" title="Edit"><FiEdit2 size={16} /></button>}
                      {canDelete && <button onClick={() => handleDeleteClick(pre)} className="btn-icon hover:text-red-500" title="Void"><FiTrash2 size={16} /></button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add / Edit Prescription Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEdit ? 'Modify Order' : 'Authorize Medication'}
        size="md"
        footer={
          <div className="flex gap-2 w-full justify-end">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Discard</Button>
            <Button variant="primary" onClick={handleSave} loading={saving}>
              <FiCheck className="mr-2" /> {isEdit ? 'Update' : 'Commit'}
            </Button>
          </div>
        }
      >
        <form className="space-y-4 p-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Patient</label>
              <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm" value={formData.patientId} onChange={(e) => setFormData({ ...formData, patientId: e.target.value })} >
                <option value="">Select Patient</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Prescribing Doctor</label>
              <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm" value={formData.doctorId} onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })} >
                <option value="">Select Doctor</option>
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>{d.user?.firstName} {d.user?.lastName} - {d.specialty}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Medication(s)</label>
            <textarea rows="2" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold text-sm text-[#1d627d]" placeholder="Drug A, Drug B..." value={formData.medications} onChange={(e) => setFormData({ ...formData, medications: e.target.value })}></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Dosage</label>
              <input type="text" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm" value={formData.dosage} onChange={(e) => setFormData({ ...formData, dosage: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Duration</label>
              <input type="text" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
            </div>
          </div>
          {isEdit && (
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Status</label>
              <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          )}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Instructions</label>
            <textarea rows="2" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none font-medium text-sm" placeholder="e.g. Take after food" value={formData.instructions} onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}></textarea>
          </div>
        </form>
      </Modal>

      {/* View/Details Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Official Script"
        size="sm"
        footer={
          <div className="flex gap-2 w-full justify-end">
            <Button variant="secondary" onClick={() => setIsViewOpen(false)}>Dismiss</Button>
            <Button variant="primary" onClick={() => handleDownload(selectedItem)}>
              <FiDownload size={16} className="mr-2" /> Download
            </Button>
            <Button variant="secondary" onClick={handlePrint}>Print</Button>
          </div>
        }
      >
        {selectedItem && (
          <div className="space-y-6">
            <div className="card-soft-blue flex justify-between items-center">
              <div>
                <h4 className="text-xl font-black text-[#1d627d] tracking-tight">{selectedItem.id}</h4>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Authorized Medical Script</p>
              </div>
            </div>
            <div className="space-y-4 px-1">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Therapeutic Order</p>
                <p className="font-black text-gray-800 text-lg leading-tight">{selectedItem.medications}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm font-medium">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Schedule</p>
                  <p className="font-bold text-gray-700">{selectedItem.dosage}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Period</p>
                  <p className="font-bold text-gray-700">{selectedItem.duration}</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 italic text-xs text-gray-600">
                "{selectedItem.instructions}"
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Void Script"
        message="Permanently withdraw this prescription?"
      />
    </div>
  )
}

export default Prescriptions
