import React, { useState, useMemo } from 'react'
import { FiPlus, FiSearch, FiFileText, FiDownload, FiEdit2, FiTrash2, FiCheck } from 'react-icons/fi'
import Modal from '../../components/common/Modal'
import Button from '../../components/common/Button'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import Card from '../../components/common/Card'
import { printElement, downloadData, generateBaseReport } from '../../utils/helpers'

const Prescriptions = () => {
  // Dummy Data
  const [prescriptions, setPrescriptions] = useState([
    { id: 'PRE-2026-001', patientId: 'PAT-2026-001', patient: 'John Doe', doctor: 'Dr. Smith', date: 'Oct 25, 2023', status: 'Active', medications: 'Amoxicillin, Paracetamol', dosage: '500mg, 1 twice daily', duration: '5 days', instructions: 'Take after meals' },
    { id: 'PRE-2026-002', patientId: 'PAT-2026-005', patient: 'Jane Smith', doctor: 'Dr. Wilson', date: 'Oct 24, 2023', status: 'Completed', medications: 'Ibuprofen', dosage: '400mg, 1 as needed', duration: '3 days', instructions: 'Do not exceed 3/day' },
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
    medications: '',
    dosage: '',
    duration: '',
    status: 'Active',
    instructions: ''
  })

  // Filtered Data
  const filteredPrescriptions = useMemo(() => {
    return prescriptions.filter(pre => {
      return pre.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pre.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pre.medications.toLowerCase().includes(searchQuery.toLowerCase())
    })
  }, [prescriptions, searchQuery])

  // Handlers
  const handleAdd = () => {
    setIsEdit(false)
    setFormData({
      patient: '',
      doctor: '',
      medications: '',
      dosage: '',
      duration: '',
      status: 'Active',
      instructions: ''
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

  const handlePrint = () => {
    printElement('Prescription')
  }

  const handleDownload = (item) => {
    const report = generateBaseReport([item], 'Medical Prescription')
    downloadData(report, `${item.id}.txt`)
  }

  const confirmDelete = () => {
    setPrescriptions(prescriptions.filter(p => p.id !== selectedItem.id))
    setIsDeleteOpen(false)
    setSelectedItem(null)
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (isEdit) {
      setPrescriptions(prescriptions.map(p => p.id === selectedItem.id ? { ...p, ...formData } : p))
    } else {
      const newPre = {
        ...formData,
        id: `PRE-2026-00${prescriptions.length + 1}`,
        patientId: `PAT-2026-0${Math.floor(Math.random() * 900) + 100}`,
        date: new Date().toLocaleDateString()
      }
      setPrescriptions([newPre, ...prescriptions])
    }
    setIsModalOpen(false)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-50 text-green-600 border-green-100'
      case 'Completed': return 'bg-blue-50 text-blue-600 border-blue-100'
      default: return 'bg-gray-50 text-gray-400 border-gray-100'
    }
  }

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
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
          <button
            onClick={handleAdd}
            className="btn-primary flex items-center gap-2 text-xs uppercase tracking-widest px-6"
          >
            <FiPlus size={16} /> New Entry
          </button>
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
                    <span className="font-black text-[#1d627d]">{pre.id}</span>
                    <div className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{pre.date}</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-800">{pre.patient}</td>
                  <td className="px-6 py-4 text-gray-700 font-medium">{pre.doctor}</td>
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
                      <button onClick={() => handleEdit(pre)} className="btn-icon" title="Edit"><FiEdit2 size={16} /></button>
                      <button onClick={() => handleDeleteClick(pre)} className="btn-icon hover:text-red-500" title="Void"><FiTrash2 size={16} /></button>
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
            <Button variant="primary" onClick={handleSave}>
              <FiCheck className="mr-2" /> {isEdit ? 'Update' : 'Commit'}
            </Button>
          </div>
        }
      >
        <form className="space-y-4 p-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Patient Name</label>
              <input type="text" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm placeholder:font-normal" placeholder="John Doe" value={formData.patient} onChange={(e) => setFormData({ ...formData, patient: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Doctor Name</label>
              <input type="text" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm placeholder:font-normal" placeholder="Dr. Smith" value={formData.doctor} onChange={(e) => setFormData({ ...formData, doctor: e.target.value })} />
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
