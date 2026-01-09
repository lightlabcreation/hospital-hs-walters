import React, { useState } from 'react'
import StatCard from '../../components/dashboard/StatCard'
import SimpleChart, { SimpleLineChart } from '../../components/dashboard/SimpleChart'
import Card from '../../components/common/Card'
import Modal from '../../components/common/Modal'
import Button from '../../components/common/Button'
import { FiUsers, FiUserPlus, FiCalendar, FiDollarSign, FiActivity, FiShield, FiAlertTriangle, FiCheckCircle, FiEye } from 'react-icons/fi'

const SuperAdminDashboard = () => {
  const [selectedLog, setSelectedLog] = useState(null)
  const [isSystemReviewOpen, setIsSystemReviewOpen] = useState(false)

  const logs = [
    { id: 'LOG-001', type: 'Registration', text: 'New Doctor (Dr. Mark) joined the Neurology department.', time: '14 mins ago', status: 'Success' },
    { id: 'LOG-002', type: 'System', text: 'Weekly automated database backup successful.', time: '2 hours ago', status: 'Success' },
    { id: 'LOG-003', type: 'Security', text: 'Multiple failed login attempts detected from IP: 192.168.1.5', time: '5 hours ago', status: 'Warning' },
  ]

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Executive Dashboard</h1>
          <p className="text-gray-500 text-sm font-medium italic">High-level operational overview & system health</p>
        </div>
        <button
          onClick={() => setIsSystemReviewOpen(true)}
          className="btn-primary flex items-center gap-2 text-xs uppercase tracking-widest px-6"
        >
          <FiShield size={16} /> integrity audit
        </button>
      </div>

      {/* Stats cluster */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Patients" count="1,248" subtitle="+12% this month" icon={FiUsers} color="blue" />
        <StatCard title="Total Doctors" count="18" subtitle="Active Staff" icon={FiUserPlus} color="green" />
        <StatCard title="Today Appointments" count="96" subtitle="8 pending" icon={FiCalendar} color="purple" />
        <StatCard title="Monthly Revenue" count="J$480,000" subtitle="J$4,80,000" icon={FiDollarSign} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="h-[400px] border-gray-100 shadow-sm overflow-hidden p-6">
            <div className="section-header flex items-center gap-2 mb-6">
              <FiActivity size={16} /> <span>Operational Velocity</span>
            </div>
            <div className="h-64">
              <SimpleLineChart
                title=""
                data={[
                  { label: 'Mon', value: 40 }, { label: 'Tue', value: 60 }, { label: 'Wed', value: 45 }, { label: 'Thu', value: 80 }, { label: 'Fri', value: 70 }, { label: 'Sat', value: 30 }, { label: 'Sun', value: 20 },
                ]}
              />
            </div>
          </Card>

          {/* Logs Table */}
          <Card className="border-gray-100 shadow-sm overflow-hidden p-0">
            <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-[#90E0EF]/10">
              <div className="text-[10px] font-black text-[#1D627D] uppercase tracking-widest">System Events Ledger</div>
              <button className="text-[10px] font-black text-[#1d627d] uppercase tracking-widest hover:underline px-2 py-1 rounded border border-blue-200 bg-white">Export Logs</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 text-gray-400 uppercase text-[10px] font-black tracking-widest">
                  <tr>
                    <th className="px-6 py-3 border-b border-gray-100">Event</th>
                    <th className="px-6 py-3 border-b border-gray-100">Status</th>
                    <th className="px-6 py-3 border-b border-gray-100 text-center">Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-800 tracking-tight">{log.text}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{log.time} • {log.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${log.status === 'Warning' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="btn-icon"
                        >
                          <FiEye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="h-[400px] border-gray-100 shadow-sm p-6 overflow-hidden">
            <div className="section-header flex items-center gap-2 mb-6 text-green-700 bg-green-50/50">
              <FiDollarSign size={16} /> <span>Revenue Stream</span>
            </div>
            <SimpleChart
              title=""
              type="bar"
              data={[
                { label: 'Aug', value: 40 }, { label: 'Sep', value: 55 }, { label: 'Oct', value: 45 }, { label: 'Nov', value: 75 }, { label: 'Dec', value: 60 }, { label: 'Jan', value: 85 },
              ]}
            />
          </Card>

          <Card className="card-soft-blue border-none overflow-hidden relative group">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2 font-black text-[#1D627D] text-sm uppercase tracking-widest">
                <FiUsers size={16} /> <span>Staffing metrics</span>
              </div>
              <div className="space-y-4 pt-2">
                {[
                  { label: 'Cardiology', val: 85 },
                  { label: 'Neurology', val: 40 },
                  { label: 'Pediatrics', val: 65 },
                ].map((d, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-black uppercase text-[#1D627D] opacity-80 tracking-tighter">
                      <span>{d.label}</span>
                      <span>{d.val}% Capacity</span>
                    </div>
                    <div className="w-full bg-white/50 rounded-full h-1.5 p-0.5 shadow-inner">
                      <div className="bg-[#1D627D] h-0.5 rounded-full" style={{ width: `${d.val}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Log modal */}
      <Modal
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        title="Event Verification"
        size="sm"
        footer={<Button variant="primary" onClick={() => setSelectedLog(null)}>Acknowledge</Button>}
      >
        {selectedLog && (
          <div className="space-y-6 p-1 text-center">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto shadow-sm ${selectedLog.status === 'Warning' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
              {selectedLog.status === 'Warning' ? <FiAlertTriangle size={24} /> : <FiCheckCircle size={24} />}
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Type: {selectedLog.type}</p>
              <p className="text-sm font-bold text-gray-700 mt-2 px-4 italic leading-relaxed">"{selectedLog.text}"</p>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pt-4 border-t border-gray-50">Token: {selectedLog.id}</p>
          </div>
        )}
      </Modal>

      {/* Integrity Audit Modal */}
      <Modal
        isOpen={isSystemReviewOpen}
        onClose={() => setIsSystemReviewOpen(false)}
        title="integrity Audit"
        size="md"
        footer={<Button variant="primary" onClick={() => setIsSystemReviewOpen(false)}>Certify System Status</Button>}
      >
        <div className="space-y-6 p-1">
          <div className="flex items-center gap-4 bg-green-50 p-4 rounded-xl border border-green-100">
            <FiCheckCircle className="text-green-600" size={20} />
            <p className="text-xs text-green-800 font-black uppercase tracking-tighter">Node Connectivity: 100% Data Integrity Verified</p>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Patient Encryption Layer', status: 'Operational' },
              { label: 'Cloud Synchronisation Node', status: 'Operational' },
              { label: 'Staff Access Matrix', status: 'Verified' },
            ].map((s, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-gray-50/80 rounded-xl border border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-600">
                <span>{s.label}</span>
                <span className="text-[#1D627D]">{s.status}</span>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default SuperAdminDashboard
