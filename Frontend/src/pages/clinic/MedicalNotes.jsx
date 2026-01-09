import React, { useState, useMemo, useEffect } from 'react'
import { FiPlus, FiSearch, FiClipboard, FiFileText, FiClock, FiEdit2, FiEye, FiCheck, FiUser } from 'react-icons/fi'
import Modal from '../../components/common/Modal'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import { medicalNotesAPI, patientAPI } from '../../api/services'
import { useAuth } from '../../context/AuthContext'

const MedicalNotes = () => {
  const { role, user } = useAuth()

  // Role-based permissions
  const canCreate = ['super_admin', 'doctor'].includes(role)
  const canEdit = ['super_admin', 'doctor'].includes(role)

  // State
  const [notes, setNotes] = useState([])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState(null)
  const [isEdit, setIsEdit] = useState(false)
  const [formData, setFormData] = useState({
    patientId: '',
    noteType: 'consultation',
    content: ''
  })

  // Fetch data on mount
  useEffect(() => {
    fetchNotes()
    fetchPatients()
  }, [])

  const fetchNotes = async () => {
    try {
      setLoading(true)
      const response = await medicalNotesAPI.getAll()
      setNotes(response.data.data || [])
    } catch (err) {
      setError('Failed to load medical notes')
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

  // Helper functions
  const getPatientName = (note) => note.patient?.firstName + ' ' + note.patient?.lastName || 'Unknown'
  const getAuthorName = (note) => note.doctor?.user?.firstName + ' ' + note.doctor?.user?.lastName || 'Unknown'
  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
  }
  const formatTime = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const handleAdd = () => {
    if (!canCreate) return
    setIsEdit(false)
    setFormData({
      patientId: '',
      noteType: 'consultation',
      content: ''
    })
    setIsNoteModalOpen(true)
  }

  const handleEdit = (note) => {
    if (!canEdit) return
    setIsEdit(true)
    setSelectedNote(note)
    setFormData({
      patientId: note.patientId || '',
      noteType: note.noteType || 'consultation',
      content: note.content || ''
    })
    setIsNoteModalOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (isEdit) {
        await medicalNotesAPI.update(selectedNote.id, formData)
      } else {
        await medicalNotesAPI.create(formData)
      }
      await fetchNotes()
      setIsNoteModalOpen(false)
    } catch (err) {
      console.error('Save failed:', err)
      setError(err.response?.data?.message || 'Failed to save note')
    } finally {
      setSaving(false)
    }
  }

  const filteredNotes = useMemo(() => {
    return notes.filter(n => {
      const patientName = getPatientName(n).toLowerCase()
      const query = searchQuery.toLowerCase()
      return patientName.includes(query) ||
        String(n.id).includes(query) ||
        (n.noteType || '').toLowerCase().includes(query)
    })
  }, [notes, searchQuery])

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
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Medical Notes</h1>
          <p className="text-gray-500 text-sm">Clinical documentation and patient encounter archive</p>
        </div>
        <div className="flex w-full sm:w-auto gap-3">
          <div className="relative flex-1 sm:w-64 group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1d627d] transition-colors" />
            <input
              type="text"
              placeholder="Search notes..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-4 focus:ring-[#90e0ef]/30 font-medium text-sm transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {canCreate && (
            <button
              onClick={handleAdd}
              className="btn-primary flex items-center gap-2 text-xs uppercase tracking-widest px-6"
            >
              <FiPlus size={16} /> Compose
            </button>
          )}
        </div>
      </div>

      {/* List Layout */}
      <Card className="overflow-hidden p-0 border-gray-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#90E0EF]/10 text-[#1D627D] uppercase text-[10px] font-black tracking-widest">
              <tr>
                <th className="px-6 py-4 border-b border-gray-100">Date/Time</th>
                <th className="px-6 py-4 border-b border-gray-100">Patient Name</th>
                <th className="px-6 py-4 border-b border-gray-100">Medical Note Preview</th>
                <th className="px-6 py-4 border-b border-gray-100 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredNotes.length > 0 ? filteredNotes.map((note) => (
                <tr key={note.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-800">{formatDate(note.createdAt)}</div>
                    <div className="text-[10px] text-gray-400 uppercase font-black">{formatTime(note.createdAt)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-black text-[#1D627D]">{getPatientName(note)}</div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-tighter">NOTE-{note.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600 truncate max-w-md font-medium">{note.content?.substring(0, 80)}...</p>
                    <p className="text-[10px] text-[#90E0EF] font-black uppercase tracking-widest">{note.noteType}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setSelectedNote(note)}
                        className="btn-icon"
                        title="View Note"
                      >
                        <FiEye size={16} />
                      </button>
                      {canEdit && (
                        <button
                          onClick={() => handleEdit(note)}
                          className="btn-icon"
                          title="Edit Note"
                        >
                          <FiEdit2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-300">
                      <FiClipboard size={48} className="opacity-20" />
                      <p className="font-black text-xs uppercase tracking-widest text-gray-400">No matching clinical records</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Composition Modal */}
      <Modal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        title={isEdit ? "Edit Medical Note" : "Compose Medical Note"}
        size="lg"
        footer={
          <div className="flex gap-2 w-full justify-end">
            <Button variant="secondary" onClick={() => setIsNoteModalOpen(false)}>Discard</Button>
            <Button variant="primary" onClick={handleSave} loading={saving}>
              <FiCheck className="mr-2" /> {isEdit ? 'Update Note' : 'Save Note'}
            </Button>
          </div>
        }
      >
        <div className="space-y-6 p-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Patient</label>
              <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm" value={formData.patientId} onChange={(e) => setFormData({ ...formData, patientId: parseInt(e.target.value) || '' })}>
                <option value="">Select Patient</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Note Type</label>
              <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm" value={formData.noteType} onChange={(e) => setFormData({ ...formData, noteType: e.target.value })}>
                <option value="consultation">Consultation Note</option>
                <option value="progress">Progress Note</option>
                <option value="followup">Follow-up Visit</option>
                <option value="surgical">Surgical Summary</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Clinical Observations</label>
            <textarea rows="6" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-medium text-sm leading-relaxed" placeholder="Record encounter details here..." value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })}></textarea>
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={!!selectedNote && !isNoteModalOpen}
        onClose={() => setSelectedNote(null)}
        title="Clinical Note Detail"
        size="md"
        footer={<Button variant="primary" onClick={() => setSelectedNote(null)}>Close</Button>}
      >
        {selectedNote && (
          <div className="space-y-6 p-1">
            <div className="card-soft-blue flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-[#1D627D] tracking-tight">{getPatientName(selectedNote)}</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{selectedNote.noteType}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-gray-700">{formatDate(selectedNote.createdAt)}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase">{formatTime(selectedNote.createdAt)}</p>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Encounter details</label>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <p className="text-gray-700 text-sm leading-relaxed font-medium italic text-justify">
                  "{selectedNote.content}"
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-50 text-[10px] font-black text-gray-300 uppercase tracking-widest">
              <span>Ref ID: NOTE-{selectedNote.id}</span>
              <span>Author: {getAuthorName(selectedNote)}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default MedicalNotes
