import React, { useState, useMemo } from 'react'
import { FiCalendar, FiSearch, FiEdit2, FiCheck, FiUser, FiClock, FiMapPin } from 'react-icons/fi'
import Modal from '../../components/common/Modal'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'

const DoctorSchedule = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedConsultation, setSelectedConsultation] = useState(null)

  const [schedule, setSchedule] = useState([
    { id: 'SCH-001', time: '09:00 AM', patient: 'Michael J.', type: 'Checkup', room: 'Room 201', doctor: 'Dr. John Smith', status: 'Arrived', phone: '+91 900XX 111' },
    { id: 'SCH-002', time: '10:30 AM', patient: 'Sarah K.', type: 'Consultation', room: 'Wing 105', doctor: 'Dr. Emily Wilson', status: 'Scheduled', phone: '+91 900XX 222' },
    { id: 'SCH-003', time: '11:15 AM', patient: 'John Doe', type: 'Lab Review', room: 'Room 201', doctor: 'Dr. John Smith', status: 'Delayed', phone: '+91 900XX 333' },
    { id: 'SCH-004', time: '12:45 PM', patient: 'Robert Brown', type: 'Emergency', room: 'ER-1', doctor: 'Dr. Robert Brown', status: 'In-Progress', phone: '+91 900XX 444' },
  ])

  const filteredSchedule = useMemo(() => {
    return schedule.filter(s =>
      s.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.doctor.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [schedule, searchQuery])

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Arrived': return 'bg-green-50 text-green-600 border-green-100'
      case 'Scheduled': return 'bg-blue-50 text-blue-600 border-blue-100'
      case 'Delayed': return 'bg-red-50 text-red-600 border-red-100'
      case 'In-Progress': return 'bg-amber-50 text-amber-600 border-amber-100'
      default: return 'bg-gray-50 text-gray-500 border-gray-100'
    }
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Doctor Schedule</h1>
          <p className="text-gray-500 text-sm font-medium italic">Roster synchronization and session tracking</p>
        </div>
        <div className="relative w-full md:w-72 group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1d627d] transition-colors" />
          <input
            type="text"
            placeholder="Search roster..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-[#90e0ef]/30 font-bold text-xs transition-all uppercase tracking-widest"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table Layout */}
      <Card className="overflow-hidden p-0 border-gray-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#90E0EF]/10 text-[#1D627D] uppercase text-[10px] font-black tracking-widest">
              <tr>
                <th className="px-6 py-4 border-b border-gray-100">Doctor Name</th>
                <th className="px-6 py-4 border-b border-gray-100">Patient / Room</th>
                <th className="px-6 py-4 border-b border-gray-100">Time Slot</th>
                <th className="px-6 py-4 border-b border-gray-100">Status</th>
                <th className="px-6 py-4 border-b border-gray-100 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredSchedule.length > 0 ? filteredSchedule.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-[#1d627d]">
                        <FiUser size={14} />
                      </div>
                      <span className="font-black text-gray-800 text-sm tracking-tight">{item.doctor}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-700 text-sm">{item.patient}</div>
                    <div className="text-[10px] text-gray-400 font-black uppercase flex items-center gap-1 mt-0.5"><FiMapPin size={10} /> {item.room}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-[#1D627D] font-black text-sm">
                      <FiClock size={14} className="text-[#90E0EF]" /> {item.time}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setSelectedConsultation(item)}
                        className="btn-icon h-8 w-8 flex items-center justify-center"
                        title="Edit Session"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        className="btn-icon h-8 w-8 flex items-center justify-center text-green-600 hover:text-green-700"
                        title="Confirm Arrival"
                      >
                        <FiCheck size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center text-gray-300">
                    <FiCalendar size={48} className="mx-auto opacity-20" />
                    <p className="font-black text-xs uppercase tracking-widest mt-2">No synchronized sessions</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedConsultation}
        onClose={() => setSelectedConsultation(null)}
        title="Session Details"
        size="sm"
        footer={<Button variant="primary" onClick={() => setSelectedConsultation(null)}>Close</Button>}
      >
        {selectedConsultation && (
          <div className="space-y-6">
            <div className="card-soft-blue text-center">
              <h3 className="text-xl font-black text-[#1D627D]">{selectedConsultation.patient}</h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 italic">{selectedConsultation.phone}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Assigned Time</p>
                <p className="text-sm font-black text-gray-800 mt-1">{selectedConsultation.time}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</p>
                <p className="text-sm font-black text-gray-800 mt-1">{selectedConsultation.room}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default DoctorSchedule
