import React, { useState, useMemo } from 'react'
import { FiPlus, FiSearch, FiClipboard, FiFileText, FiClock, FiEdit2, FiEye, FiCheck, FiUser } from 'react-icons/fi'
import Modal from '../../components/common/Modal'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'

const MedicalNotes = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState(null)

  const [notes, setNotes] = useState([
    { id: 'NOTE-2026-881', patient: 'John Doe', type: 'Clinical Consultation', date: 'Jan 05, 2026', time: '10:30 AM', author: 'Dr. John Smith', preview: 'Patient presented with mild fever and persistent cough for 3 days.', detail: 'Patient John Doe (34M) came in complaining of a dry cough. O2 Sat: 98%, Temp: 100.2F. Lungs are clear on auscultation. No history of pneumonia.' },
    { id: 'NOTE-2026-882', patient: 'Sarah K.', type: 'Surgical Follow-up', date: 'Jan 04, 2026', time: '02:15 PM', author: 'Dr. Emily Wilson', preview: 'Post-operative recovery is progressing well. Stitches checked and healthy.', detail: 'Post-op Day 14. Appendectomy wound is healing well. No signs of infection (redness/discharge). Patient is advised to resume light walking.' },
    { id: 'NOTE-2026-883', patient: 'Robert Brown', type: 'Chronic Progress', date: 'Jan 03, 2026', time: '09:45 AM', author: 'Dr. John Smith', preview: 'Blood pressure stabilized at 130/85. Continuing current regimen.', detail: 'Hypertension management. BP today 130/85 mmHg. Heart rate 72 bpm. Patient compliant with Amlodipine 5mg. No side effects reported.' },
  ])

  const filteredNotes = useMemo(() => {
    return notes.filter(n =>
      n.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.type.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [notes, searchQuery])

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
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
          <button
            onClick={() => setIsNoteModalOpen(true)}
            className="btn-primary flex items-center gap-2 text-xs uppercase tracking-widest px-6"
          >
            <FiPlus size={16} /> Compose
          </button>
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
                    <div className="text-sm font-bold text-gray-800">{note.date}</div>
                    <div className="text-[10px] text-gray-400 uppercase font-black">{note.time}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-black text-[#1D627D]">{note.patient}</div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-tighter">{note.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600 truncate max-w-md font-medium">{note.preview}</p>
                    <p className="text-[10px] text-[#90E0EF] font-black uppercase tracking-widest">{note.type}</p>
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
                      <button
                        className="btn-icon"
                        title="Edit Note"
                      >
                        <FiEdit2 size={16} />
                      </button>
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
        title="Compose Medical Note"
        size="lg"
        footer={
          <div className="flex gap-2 w-full justify-end">
            <Button variant="secondary" onClick={() => setIsNoteModalOpen(false)}>Discard</Button>
            <Button variant="primary" onClick={() => setIsNoteModalOpen(false)}>
              <FiCheck className="mr-2" /> Save Note
            </Button>
          </div>
        }
      >
        <div className="space-y-6 p-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Patient Name</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none focus:ring-4 focus:ring-[#90e0ef]/30 text-sm" placeholder="Search Patient..." />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Note Type</label>
              <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm">
                <option>Consultation Note</option>
                <option>Progress Note</option>
                <option>Follow-up Visit</option>
                <option>Surgical Summary</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Clinical Observations</label>
            <textarea rows="6" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-medium text-sm leading-relaxed" placeholder="Record encounter details here..."></textarea>
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={!!selectedNote}
        onClose={() => setSelectedNote(null)}
        title="Clinical Note Detail"
        size="md"
        footer={<Button variant="primary" onClick={() => setSelectedNote(null)}>Close</Button>}
      >
        {selectedNote && (
          <div className="space-y-6 p-1">
            <div className="card-soft-blue flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-[#1D627D] tracking-tight">{selectedNote.patient}</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{selectedNote.type}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-gray-700">{selectedNote.date}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase">{selectedNote.time}</p>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Encounter details</label>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <p className="text-gray-700 text-sm leading-relaxed font-medium italic text-justify">
                  "{selectedNote.detail}"
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-50 text-[10px] font-black text-gray-300 uppercase tracking-widest">
              <span>Ref ID: {selectedNote.id}</span>
              <span>Author: {selectedNote.author}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default MedicalNotes
