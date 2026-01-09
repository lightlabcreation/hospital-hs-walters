import React, { useState } from 'react'
import StatCard from '../../components/dashboard/StatCard'
import Card from '../../components/common/Card'
import Modal from '../../components/common/Modal'
import Button from '../../components/common/Button'
import { FiCalendar, FiFileText, FiActivity, FiClock, FiPlus, FiAlertCircle, FiCheckCircle, FiEye, FiDownload, FiPrinter, FiUpload } from 'react-icons/fi'
import { printElement, downloadData, generateBaseReport } from '../../utils/helpers'

const PatientDashboard = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const [selectedApt, setSelectedApt] = useState(null)

  const appointments = [
    { id: 'APT-1', date: '12', month: 'Jan', doctor: 'Dr. Emily Smith', dept: 'Cardiologist', reason: 'General Checkup', time: '10:00 AM - 10:30 AM', status: 'CONFIRMED' },
    { id: 'APT-2', date: '25', month: 'Jan', doctor: 'Dr. John Watson', dept: 'Pathologist', reason: 'Lab Review', time: '02:00 PM - 02:20 PM', status: 'SCHEDULED' },
  ]

  const reports = [
    { title: 'Blood Count (CBC)', doctor: 'Dr. Smith', date: 'Jan 05, 2026', type: 'Pathology', status: 'Final', content: 'Hemoglobin: 14.5 g/dL (Normal). WBC: 7,500/mm3 (Normal). Platelets: 2,50,000/mm3 (Normal).' },
    { title: 'Chest X-Ray', doctor: 'Dr. Emily', date: 'Dec 20, 2025', type: 'Radiology', status: 'Reviewed', content: 'Lungs are clear. No pleural effusion or pneumothorax. Heart size is within normal limits.' },
  ]

  return (
    <div className="space-y-6 pb-24">
      {/* Welcome Banner */}
      <div className="card-soft-blue border-none p-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-black text-[#1D627D] tracking-tight">Active Wellness Hub</h2>
          <p className="text-gray-500 text-sm font-medium max-w-lg mt-1 italic">Your medical journey is fully digital and secure.</p>
        </div>
        <button
          onClick={() => setIsBookingModalOpen(true)}
          className="btn-primary flex items-center gap-2 text-xs uppercase tracking-widest px-8"
        >
          <FiCalendar size={16} /> Schedule visit
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Next Appointment" count="Jan 12" subtitle="10:00 AM" icon={FiCalendar} color="blue" />
        <StatCard title="Prescriptions" count="5" subtitle="Active" icon={FiFileText} color="green" />
        <StatCard title="Lab Reports" count="3" subtitle="New results" icon={FiActivity} color="purple" />
        <StatCard title="Invoices Due" count="J$0" subtitle="No outstanding" icon={FiClock} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments Section */}
        <Card className="border-gray-100 shadow-sm overflow-hidden p-0">
          <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-[#90E0EF]/10">
            <h3 className="text-[10px] font-black text-[#1D627D] uppercase tracking-widest">Upcoming Visits</h3>
            <button className="text-[10px] font-black text-[#1d627d] uppercase tracking-widest hover:underline">Full History</button>
          </div>
          <div className="p-4 space-y-3">
            {appointments.map(apt => (
              <div
                key={apt.id}
                onClick={() => setSelectedApt(apt)}
                className="flex items-center gap-4 p-4 border border-gray-50 bg-gray-50/30 rounded-xl hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg flex flex-col items-center justify-center text-[#1d627d] shadow-sm border border-blue-50 group-hover:bg-[#90e0ef] transition-colors">
                  <span className="text-lg font-black leading-none">{apt.date}</span>
                  <span className="text-[8px] uppercase font-black">{apt.month}</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-gray-800 text-sm">{apt.doctor}</h4>
                    <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[8px] font-black rounded border border-green-100 uppercase tracking-widest">{apt.status}</span>
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{apt.dept} • {apt.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Lab Requests Section - NEW */}
        <Card className="border-gray-100 shadow-sm overflow-hidden p-0">
          <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-[#90E0EF]/10">
            <h3 className="text-[10px] font-black text-[#1D627D] uppercase tracking-widest">Prescribed Test Requests</h3>
            <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest">Action Required</span>
          </div>
          <div className="p-0">
            <table className="w-full text-left">
              <tbody className="divide-y divide-gray-50">
                {[
                  { id: 1, test: 'Thyroid Profile', doctor: 'Dr. Emily Smith', date: 'Jan 10, 2026', status: 'Pending' },
                  { id: 2, test: 'Vitamin D Total', doctor: 'Dr. John Watson', date: 'Jan 09, 2026', status: 'Uploaded' }
                ].map((req, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${req.status === 'Pending' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                          <FiActivity size={14} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-800 tracking-tight">{req.test}</div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase">Prescribed by {req.doctor}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {req.status === 'Pending' ? (
                        <label className="btn-secondary text-[10px] uppercase tracking-widest px-3 py-1.5 cursor-pointer inline-flex items-center gap-2">
                          <FiUpload size={12} /> Upload Report
                          <input type="file" className="hidden" onChange={(e) => {
                            if (e.target.files[0]) alert(`Uploaded ${e.target.files[0].name} successfully!`)
                          }} />
                        </label>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-[10px] font-black text-green-600 uppercase tracking-widest flex items-center gap-1"><FiCheckCircle size={10} /> Sent</span>
                          <button className="btn-icon" title="View"><FiEye size={14} /></button>
                          <button className="btn-icon" title="Download"><FiDownload size={14} /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Active Prescriptions Section - NEW */}
        <Card className="border-gray-100 shadow-sm overflow-hidden p-0 mt-6">
          <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-[#90E0EF]/10">
            <h3 className="text-[10px] font-black text-[#1D627D] uppercase tracking-widest">Active Prescriptions</h3>
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Read Only</span>
          </div>
          <div className="p-4 space-y-3">
            <div className="p-3 border border-gray-100 rounded-xl bg-white hover:shadow-sm transition-all flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FiFileText size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">Amoxicillin (500mg)</p>
                  <p className="text-[10px] font-black text-gray-400 uppercase">Dr. Emily Smith • Twice Daily</p>
                </div>
              </div>
              <button className="btn-icon" title="View"><FiEye size={16} /></button>
            </div>
            <div className="p-3 border border-gray-100 rounded-xl bg-white hover:shadow-sm transition-all flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                  <FiFileText size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">Paracetamol (650mg)</p>
                  <p className="text-[10px] font-black text-gray-400 uppercase">Dr. John Watson • SOS</p>
                </div>
              </div>
              <button className="btn-icon" title="View"><FiEye size={16} /></button>
            </div>
          </div>
        </Card>

        {/* Reports Section */}
        <Card className="border-gray-100 shadow-sm overflow-hidden p-0">
          <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-[#90E0EF]/10">
            <h3 className="text-[10px] font-black text-[#1D627D] uppercase tracking-widest">Bio Data & Reports</h3>
            <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">Synchronized</span>
          </div>
          <div className="p-0">
            <table className="w-full text-left">
              <tbody className="divide-y divide-gray-50">
                {reports.map((report, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors group cursor-pointer" onClick={() => setSelectedReport(report)}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 text-[#1d627d] flex items-center justify-center">
                          <FiActivity size={14} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-800 tracking-tight">{report.title}</div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase">{report.date}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="btn-icon">
                          <FiEye size={16} />
                        </button>
                        <button className="btn-icon">
                          <FiDownload size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Book Appointment Modal */}
      <Modal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        title="Schedule Consultation"
        size="md"
        footer={<Button variant="primary" onClick={() => setIsBookingModalOpen(false)}>Confirm Booking</Button>}
      >
        <div className="space-y-4 p-1">
          <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex items-start gap-3">
            <FiAlertCircle className="text-blue-500 mt-0.5" size={16} />
            <p className="text-[10px] text-blue-800 font-medium leading-relaxed">Select your physician and slot. Subject to reception approval.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Physician</label>
              <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm">
                <option>Dr. Emily Smith (Cardiology)</option>
                <option>Dr. John Watson (General)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</label>
              <input type="date" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Symptoms</label>
            <textarea rows="3" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none font-medium text-sm" placeholder="How are you feeling?"></textarea>
          </div>
        </div>
      </Modal>

      {/* Report View Modal */}
      <Modal
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        title="Clinical Report"
        size="sm"
        footer={
          <div className="flex gap-2 w-full justify-end">
            <Button variant="secondary" onClick={() => setSelectedReport(null)}>Dismiss</Button>
            <Button variant="primary" onClick={() => {
              const rpt = generateBaseReport([selectedReport], 'Patient Report')
              downloadData(rpt, `Report_${selectedReport.title.replace(' ', '_')}.txt`)
            }}>
              Download
            </Button>
            <Button variant="secondary" onClick={() => printElement()}>Print</Button>
          </div>
        }
      >
        {selectedReport && (
          <div className="space-y-6">
            <div className="card-soft-blue flex justify-between items-center">
              <div>
                <h4 className="text-xl font-black text-[#1d627d]">{selectedReport.title}</h4>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">{selectedReport.type} Analysis</p>
              </div>
              <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest">Released</span>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-gray-700 font-medium text-sm leading-relaxed italic text-justify">"{selectedReport.content}"</p>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-50">
              <p className="text-[10px] font-black text-gray-400 uppercase">Signed by {selectedReport.doctor}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Appointment Detail Modal */}
      <Modal
        isOpen={!!selectedApt}
        onClose={() => setSelectedApt(null)}
        title="Visit Confirmation"
        size="sm"
        footer={<Button variant="primary" onClick={() => setSelectedApt(null)}>Ok</Button>}
      >
        {selectedApt && (
          <div className="space-y-6 text-center p-1">
            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-green-100">
              <FiCheckCircle size={32} />
            </div>
            <div>
              <h4 className="text-xl font-black text-gray-800 tracking-tight">Visit Confirmed</h4>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Ref ID: {selectedApt.id}</p>
            </div>
            <div className="p-4 bg-[#1d627d] rounded-2xl text-white">
              <p className="text-[8px] font-black opacity-60 uppercase mb-2 tracking-widest">Instruction</p>
              <p className="text-xs font-bold leading-relaxed">Arrive 15 mins early for {selectedApt.time}.</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default PatientDashboard
