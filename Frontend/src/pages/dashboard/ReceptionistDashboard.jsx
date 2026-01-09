import React, { useState } from 'react'
import StatCard from '../../components/dashboard/StatCard'
import Card from '../../components/common/Card'
import Modal from '../../components/common/Modal'
import Button from '../../components/common/Button'
import { FiUserPlus, FiCalendar, FiXCircle, FiCheck, FiSearch, FiEdit2, FiUserCheck, FiPhone, FiEye, FiClock } from 'react-icons/fi'

const ReceptionistDashboard = () => {
  const [isRegModalOpen, setIsRegModalOpen] = useState(false)
  const [selectedApt, setSelectedApt] = useState(null)
  const [formData, setFormData] = useState({ name: '', phone: '', age: '', gender: 'Male' })

  const handleRegister = (e) => {
    e.preventDefault()
    alert(`Patient ${formData.name} registered successfully! ID: PAT-2026-${Math.floor(Math.random() * 900) + 100}`)
    setIsRegModalOpen(false)
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Front Desk</h1>
          <p className="text-gray-500 text-sm font-medium italic">Patient intake and queue management</p>
        </div>
        <button
          onClick={() => setIsRegModalOpen(true)}
          className="btn-primary flex items-center gap-2 text-xs uppercase tracking-widest px-6"
        >
          <FiUserPlus size={16} /> New Intake
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="New Patients Today" count="18" subtitle="Registered" icon={FiUserPlus} color="blue" />
        <StatCard title="Appointments Booked" count="64" subtitle="Total for today" icon={FiCalendar} color="green" />
        <StatCard title="Cancelled" count="5" subtitle="Appointments" icon={FiXCircle} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side: Registrations */}
        <Card className="border-gray-100 shadow-sm overflow-hidden p-0">
          <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-[#90E0EF]/10">
            <h3 className="text-[10px] font-black text-[#1D627D] uppercase tracking-widest">Recent Intake</h3>
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Last 24 Hours</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-gray-400 uppercase text-[10px] font-black tracking-widest">
                <tr>
                  <th className="px-6 py-3 border-b border-gray-100">Patient</th>
                  <th className="px-6 py-3 border-b border-gray-100">Intake</th>
                  <th className="px-6 py-3 border-b border-gray-100 text-center">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[1, 2, 3, 4, 5].map(i => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-800">Alice Johnson {i}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase">PAT-2026-00{i}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold text-gray-500">09:3{i} AM</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="btn-icon">
                        <FiEye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Right Side: Appointments */}
        <Card className="border-gray-100 shadow-sm overflow-hidden p-0">
          <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-[#90E0EF]/10">
            <h3 className="text-[10px] font-black text-[#1D627D] uppercase tracking-widest">Queue Status</h3>
            <span className="bg-white px-2 py-0.5 rounded text-[8px] font-black text-[#1d627d] border border-blue-50 uppercase tracking-widest">Live Roster</span>
          </div>
          <div className="p-0">
            <table className="w-full text-left">
              <tbody className="divide-y divide-gray-50">
                {[1, 2, 3, 4, 5].map(i => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors group cursor-pointer" onClick={() => setSelectedApt({ name: 'John Doe ' + i, doctor: 'Dr. Smith', time: '11:0' + i })}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-[#1d627d] font-black text-xs">
                          11:0{i}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-800">Dr. Smith <span className="text-[10px] text-gray-400 font-normal ml-1">OPD-4</span></div>
                          <div className="text-[10px] text-gray-500 font-medium flex items-center gap-1"><FiUserCheck size={10} className="text-green-500" /> John Doe {i}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center gap-1 text-[8px] font-black text-green-600 bg-green-50 px-2 py-1 rounded border border-green-100 uppercase tracking-widest">
                        <FiCheck size={10} /> Ready
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* New Patient Registration Modal */}
      <Modal
        isOpen={isRegModalOpen}
        onClose={() => setIsRegModalOpen(false)}
        title="Patient Intake Form"
        size="md"
        footer={
          <div className="flex gap-2 w-full justify-end">
            <Button variant="secondary" onClick={() => setIsRegModalOpen(false)}>Discard</Button>
            <Button variant="primary" onClick={handleRegister}>
              <FiCheck className="mr-2" /> Complete Intake
            </Button>
          </div>
        }
      >
        <form className="space-y-4 p-1">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
            <input type="text" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm" placeholder="e.g. Robert Pattinson" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone</label>
              <input type="text" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm" placeholder="+91..." value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Age</label>
              <input type="number" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Consulant</label>
            <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm">
              <option>Dr. Smith (Cardiology)</option>
              <option>Dr. Emily (Pediatrics)</option>
            </select>
          </div>
        </form>
      </Modal>

      {/* Appointment Quick Action Modal */}
      <Modal
        isOpen={!!selectedApt}
        onClose={() => setSelectedApt(null)}
        title="Queue Action"
        size="sm"
        footer={<Button variant="primary" onClick={() => setSelectedApt(null)}>Dismiss</Button>}
      >
        {selectedApt && (
          <div className="space-y-4 p-1">
            <div className="card-soft-blue text-center">
              <h4 className="text-xl font-black text-[#1D627D] tracking-tight">{selectedApt.name}</h4>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{selectedApt.doctor} • {selectedApt.time}</p>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => { alert('Checked in!'); setSelectedApt(null); }}
                className="w-full py-3 bg-[#90e0ef] text-[#1d627d] rounded-xl font-black uppercase text-[10px] tracking-widest border border-blue-200 transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2"
              >
                <FiCheck /> Mark as Arrived
              </button>
              <button
                onClick={() => { alert('Rescheduling...'); setSelectedApt(null); }}
                className="w-full py-3 bg-white text-gray-600 rounded-xl font-black uppercase text-[10px] tracking-widest border border-gray-100 transition-all hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <FiClock /> Reschedule
              </button>
              <button
                onClick={() => { alert('Cancelled!'); setSelectedApt(null); }}
                className="w-full py-3 text-red-500 font-black uppercase text-[10px] tracking-widest hover:underline flex items-center justify-center gap-2"
              >
                <FiXCircle /> Cancel Appointment
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default ReceptionistDashboard
