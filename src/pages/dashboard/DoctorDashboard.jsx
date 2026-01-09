import React, { useState } from 'react'
import StatCard from '../../components/dashboard/StatCard'
import Card from '../../components/common/Card'
import Modal from '../../components/common/Modal'
import Button from '../../components/common/Button'
import { FiUsers, FiCalendar, FiActivity, FiFileText, FiClock, FiCheckCircle, FiPlay, FiPlus, FiArrowRight, FiCheck, FiEye, FiDownload } from 'react-icons/fi'

const DoctorDashboard = () => {
  const [selectedConsultation, setSelectedConsultation] = useState(null)
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false)
  const [isLabModalOpen, setIsLabModalOpen] = useState(false)

  const appointments = [
    { id: '101', name: 'John Doe', time: '10:00 AM', reason: 'Regular Checkup', type: 'First Visit' },
    { id: '102', name: 'Sarah Smith', time: '10:30 AM', reason: 'Viral Fever', type: 'Follow-up' },
    { id: '103', name: 'Mike Johnson', time: '11:15 AM', reason: 'Knee Pain', type: 'Review' },
    { id: '104', name: 'Emily Brown', time: '11:45 AM', reason: 'Skin Allergy', type: 'Consultation' },
  ]

  const handleStartConsultation = (apt) => {
    setSelectedConsultation(apt)
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Physician Portal</h1>
          <p className="text-gray-500 text-sm font-medium italic">Clinical schedule and patient encounter control</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsPrescriptionModalOpen(true)}
            className="btn-primary flex items-center gap-2 text-xs uppercase tracking-widest px-6 py-2.5"
          >
            <FiPlus size={16} /> Prescription
          </button>
          <button
            onClick={() => setIsLabModalOpen(true)}
            className="btn-secondary flex items-center gap-2 text-xs uppercase tracking-widest px-6 py-2.5"
          >
            <FiActivity size={16} /> Lab Request
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard title="My Patients" count="42" subtitle="Active cases" icon={FiUsers} color="blue" />
        <StatCard title="Today Slots" count="12" subtitle="8 remaining" icon={FiCalendar} color="green" />
        <StatCard title="Lab Reports" count="6" subtitle="New uploads from patients" icon={FiActivity} color="red" />
        <StatCard title="Reports Sub" count="128" subtitle="This month" icon={FiFileText} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Schedule Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-gray-100 shadow-sm overflow-hidden p-0">
            <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-[#90E0EF]/10">
              <h3 className="text-[10px] font-black text-[#1D627D] uppercase tracking-widest">Appointment Roster</h3>
              <span className="bg-white px-2 py-0.5 rounded text-[8px] font-black text-gray-400 border border-gray-100 uppercase tracking-widest">Live</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 text-gray-400 uppercase text-[10px] font-black tracking-widest">
                  <tr>
                    <th className="px-6 py-3 border-b">Time</th>
                    <th className="px-6 py-3 border-b">Patient</th>
                    <th className="px-6 py-3 border-b">Reason</th>
                    <th className="px-6 py-3 border-b text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="text-sm font-black text-[#1d627d]">{apt.time}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase">30 Min</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-800">#{apt.id} • {apt.name}</div>
                        <div className="text-[10px] text-[#90E0EF] font-black uppercase tracking-widest">{apt.type}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase tracking-tighter">
                          {apt.reason}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleStartConsultation(apt)}
                          className="btn-primary flex items-center gap-2 text-[10px] uppercase tracking-widest px-4 py-1.5"
                        >
                          <FiPlay size={12} /> Start
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Info Grid */}
        <div className="space-y-6">
          <Card className="card-soft-blue border-none overflow-hidden relative group">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2 font-black text-[#1D627D] text-sm uppercase tracking-widest">
                <FiActivity size={16} /> <span>Queue alerts</span>
              </div>
              <ul className="space-y-3 pt-2">
                <li className="flex items-center gap-3 p-3 bg-white/60 rounded-xl border border-blue-50 hover:bg-white transition-all cursor-pointer">
                  <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
                    <FiClock size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-800 uppercase tracking-tighter leading-none">Review Lab Results</p>
                    <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">3 pending signatures</p>
                  </div>
                </li>
                <li className="flex items-center gap-3 p-3 bg-white/60 rounded-xl border border-blue-50 hover:bg-white transition-all cursor-pointer">
                  <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                    <FiCheckCircle size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-800 uppercase tracking-tighter leading-none">Discharge Approval</p>
                    <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">2 ready to exit</p>
                  </div>
                </li>
              </ul>
            </div>
          </Card>

          {/* Patient Uploads Notification */}
          <Card className="border-gray-100 shadow-sm p-4">
            <h4 className="text-[10px] font-black text-[#1D627D] uppercase tracking-widest mb-3">Recent Patient Uploads</h4>
            <ul className="space-y-2">
              {[
                { patient: 'Jane Roe', file: 'Thyroid_Report.pdf', time: '10 mins ago' },
                { patient: 'Mike Ross', file: 'X-Ray_Chest.jpg', time: '1 hr ago' }
              ].map((up, i) => (
                <li key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <p className="text-xs font-bold text-gray-800">{up.patient}</p>
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-wide">{up.file}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="btn-icon" title="View"><FiEye size={14} /></button>
                    <button className="btn-icon" title="Download"><FiDownload size={14} /></button>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      {/* Start Consultation Modal */}
      <Modal
        isOpen={!!selectedConsultation}
        onClose={() => setSelectedConsultation(null)}
        title="Active Consultation"
        size="md"
        footer={
          <div className="flex gap-2 w-full justify-end">
            <Button variant="secondary" onClick={() => setSelectedConsultation(null)}>Discard</Button>
            <Button variant="primary" onClick={() => {
              alert('Completed.')
              setSelectedConsultation(null)
            }}>
              <FiCheck className="mr-2" /> Finish
            </Button>
          </div>
        }
      >
        {selectedConsultation && (
          <div className="space-y-6">
            <div className="card-soft-blue flex justify-between items-center">
              <div>
                <h4 className="text-xl font-black text-[#1d627d]">{selectedConsultation.name}</h4>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">#{selectedConsultation.id} • {selectedConsultation.reason}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Notes</label>
                <textarea rows="4" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none text-sm font-medium" placeholder="Clinical observations..."></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none text-xs font-bold" placeholder="BP: 120/80" />
                <input type="text" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none text-xs font-bold" placeholder="Temp: 98.6 F" />
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Write Prescription Modal */}
      <Modal
        isOpen={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
        title="Prescription Pad"
        size="md"
        footer={<Button variant="primary" onClick={() => setIsPrescriptionModalOpen(false)}>Authorize</Button>}
      >
        <div className="space-y-4 p-1">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Patient</label>
            <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm">
              {appointments.map(a => <option key={a.id}>{a.name} (ID: {a.id})</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Medications</label>
            <textarea rows="5" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold text-sm text-[#1d627d]" placeholder="1. Med A - 500mg - 1-0-1"></textarea>
          </div>
        </div>
      </Modal>

      {/* Request Lab Modal */}
      <Modal
        isOpen={isLabModalOpen}
        onClose={() => setIsLabModalOpen(false)}
        title="Lab Investigation"
        size="sm"
        footer={<Button variant="primary" onClick={() => setIsLabModalOpen(false)}>Send Request</Button>}
      >
        <div className="space-y-4 p-1">
          <div className="grid grid-cols-1 gap-2">
            {['CBC', 'Lipid', 'KFT', 'LFT', 'Thyroid', 'Urine'].map(test => (
              <label key={test} className="p-3 border border-gray-100 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-all">
                <input type="checkbox" className="w-4 h-4 accent-[#1d627d]" />
                <span className="text-sm font-bold text-gray-700">{test}</span>
              </label>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default DoctorDashboard
