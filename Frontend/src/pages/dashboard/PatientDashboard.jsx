import React, { useState, useEffect } from 'react'
import StatCard from '../../components/dashboard/StatCard'
import Card from '../../components/common/Card'
import Modal from '../../components/common/Modal'
import Button from '../../components/common/Button'
import { FiCalendar, FiFileText, FiActivity, FiClock, FiPlus, FiAlertCircle, FiCheckCircle, FiEye, FiDownload, FiPrinter, FiUpload } from 'react-icons/fi'
import { printElement, downloadData, generateBaseReport } from '../../utils/helpers'
import { appointmentAPI, prescriptionAPI, labAPI, billingAPI, doctorAPI } from '../../api/services'
import { useAuth } from '../../context/AuthContext'

const PatientDashboard = () => {
  const { user } = useAuth()
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const [selectedApt, setSelectedApt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [appointments, setAppointments] = useState([])
  const [prescriptions, setPrescriptions] = useState([])
  const [labReports, setLabReports] = useState([])
  const [invoices, setInvoices] = useState([])
  const [doctors, setDoctors] = useState([])
  const [stats, setStats] = useState({
    nextAppointment: null,
    activePrescriptions: 0,
    newLabReports: 0,
    pendingDues: 0
  })
  const [bookingForm, setBookingForm] = useState({
    doctorId: '',
    date: '',
    reason: ''
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [appointmentsRes, prescriptionsRes, labRes, billingRes, doctorsRes] = await Promise.all([
        appointmentAPI.getAll(),
        prescriptionAPI.getAll(),
        labAPI.getAll(),
        billingAPI.getAll(),
        doctorAPI.getAll()
      ])

      const allAppointments = appointmentsRes.data.data || []
      const allPrescriptions = prescriptionsRes.data.data || []
      const allLabReports = labRes.data.data || []
      const allInvoices = billingRes.data.data || []
      const allDoctors = doctorsRes.data.data || []

      // Filter upcoming appointments
      const today = new Date()
      const upcomingAppts = allAppointments.filter(a => {
        const aptDate = new Date(a.date)
        return aptDate >= today && (a.status === 'scheduled' || a.status === 'pending')
      }).sort((a, b) => new Date(a.date) - new Date(b.date))

      // Calculate stats
      const nextApt = upcomingAppts[0]
      const pendingInvoices = allInvoices.filter(inv => inv.status === 'pending' || inv.status === 'overdue')
      const totalDue = pendingInvoices.reduce((sum, inv) => sum + (inv.amount || 0), 0)
      const newLabResults = allLabReports.filter(l => l.status === 'completed')

      setAppointments(upcomingAppts.slice(0, 5))
      setPrescriptions(allPrescriptions.slice(-5))
      setLabReports(allLabReports)
      setInvoices(allInvoices)
      setDoctors(allDoctors)

      setStats({
        nextAppointment: nextApt,
        activePrescriptions: allPrescriptions.length,
        newLabReports: newLabResults.length,
        pendingDues: totalDue
      })

    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleBookAppointment = async () => {
    if (!bookingForm.doctorId || !bookingForm.date) return
    setSaving(true)
    try {
      await appointmentAPI.create({
        doctorId: bookingForm.doctorId,
        date: new Date(bookingForm.date).toISOString(),
        reason: bookingForm.reason || 'General Consultation',
        status: 'scheduled'
      })
      await fetchDashboardData()
      setIsBookingModalOpen(false)
      setBookingForm({ doctorId: '', date: '', reason: '' })
    } catch (err) {
      console.error('Failed to book appointment:', err)
    } finally {
      setSaving(false)
    }
  }

  const getDoctorName = (apt) => {
    // Backend returns doctor as a string (full name)
    if (typeof apt.doctor === 'string') {
      return apt.doctor.startsWith('Dr.') ? apt.doctor : `Dr. ${apt.doctor}`
    }
    if (apt.doctor?.user) {
      const name = apt.doctor.user.firstName
        ? `${apt.doctor.user.firstName} ${apt.doctor.user.lastName || ''}`.trim()
        : apt.doctor.user.name || ''
      return `Dr. ${name}`.trim()
    }
    return 'Doctor'
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return { date: '', month: '', full: '' }
    const d = new Date(dateStr)
    return {
      date: d.getDate().toString(),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      full: d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    }
  }

  const formatTime = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1d627d]"></div>
      </div>
    )
  }

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
        <StatCard
          title="Next Appointment"
          count={stats.nextAppointment ? formatDate(stats.nextAppointment.date).full.split(',')[0] : 'None'}
          subtitle={stats.nextAppointment ? formatTime(stats.nextAppointment.date) : 'No upcoming'}
          icon={FiCalendar}
          color="blue"
        />
        <StatCard title="Prescriptions" count={stats.activePrescriptions.toString()} subtitle="Active" icon={FiFileText} color="green" />
        <StatCard title="Lab Reports" count={stats.newLabReports.toString()} subtitle="Results" icon={FiActivity} color="purple" />
        <StatCard title="Invoices Due" count={`J$${stats.pendingDues.toLocaleString()}`} subtitle={stats.pendingDues > 0 ? 'Outstanding' : 'No outstanding'} icon={FiClock} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments Section */}
        <Card className="border-gray-100 shadow-sm overflow-hidden p-0">
          <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-[#90E0EF]/10">
            <h3 className="text-[10px] font-black text-[#1D627D] uppercase tracking-widest">Upcoming Visits</h3>
            <button className="text-[10px] font-black text-[#1d627d] uppercase tracking-widest hover:underline">Full History</button>
          </div>
          <div className="p-4 space-y-3">
            {appointments.length > 0 ? appointments.map(apt => {
              const dateInfo = formatDate(apt.date)
              return (
                <div
                  key={apt.id}
                  onClick={() => setSelectedApt(apt)}
                  className="flex items-center gap-4 p-4 border border-gray-50 bg-gray-50/30 rounded-xl hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg flex flex-col items-center justify-center text-[#1d627d] shadow-sm border border-blue-50 group-hover:bg-[#90e0ef] transition-colors">
                    <span className="text-lg font-black leading-none">{dateInfo.date}</span>
                    <span className="text-[8px] uppercase font-black">{dateInfo.month}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-gray-800 text-sm">{getDoctorName(apt)}</h4>
                      <span className={`px-2 py-0.5 text-[8px] font-black rounded border uppercase tracking-widest ${apt.status === 'scheduled' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>{apt.status}</span>
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{apt.doctor?.specialization || 'General'} • {formatTime(apt.date)}</p>
                  </div>
                </div>
              )
            }) : (
              <div className="text-center py-10 text-gray-400">
                <FiCalendar size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No upcoming appointments</p>
              </div>
            )}
          </div>
        </Card>

        {/* Lab Reports Section */}
        <Card className="border-gray-100 shadow-sm overflow-hidden p-0">
          <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-[#90E0EF]/10">
            <h3 className="text-[10px] font-black text-[#1D627D] uppercase tracking-widest">Lab Reports</h3>
            <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">Latest Results</span>
          </div>
          <div className="p-0">
            <table className="w-full text-left">
              <tbody className="divide-y divide-gray-50">
                {labReports.slice(0, 4).map((report, idx) => (
                  <tr key={report.id || idx} className="hover:bg-gray-50 transition-colors group cursor-pointer" onClick={() => setSelectedReport(report)}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${report.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                          <FiActivity size={14} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-800 tracking-tight">{report.testName}</div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase">{formatDate(report.createdAt).full}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${report.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                          {report.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
                {labReports.length === 0 && (
                  <tr>
                    <td colSpan="2" className="px-6 py-10 text-center text-gray-400 text-sm">
                      No lab reports available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Active Prescriptions Section */}
        <Card className="border-gray-100 shadow-sm overflow-hidden p-0">
          <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-[#90E0EF]/10">
            <h3 className="text-[10px] font-black text-[#1D627D] uppercase tracking-widest">Active Prescriptions</h3>
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Read Only</span>
          </div>
          <div className="p-4 space-y-3">
            {prescriptions.length > 0 ? prescriptions.map(rx => (
              <div key={rx.id} className="p-3 border border-gray-100 rounded-xl bg-white hover:shadow-sm transition-all flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <FiFileText size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{rx.medications?.split('\n')[0] || 'Prescription'}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase">{typeof rx.doctor === 'string' ? (rx.doctor.startsWith('Dr.') ? rx.doctor : `Dr. ${rx.doctor}`) : `Dr. ${rx.doctor?.user?.firstName || rx.doctor?.user?.name || 'Unknown'}`} • {rx.instructions || 'As prescribed'}</p>
                  </div>
                </div>
                <button className="btn-icon" title="View"><FiEye size={16} /></button>
              </div>
            )) : (
              <div className="text-center py-6 text-gray-400">
                <p className="text-sm">No active prescriptions</p>
              </div>
            )}
          </div>
        </Card>

        {/* Billing Summary */}
        <Card className="border-gray-100 shadow-sm overflow-hidden p-0">
          <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-[#90E0EF]/10">
            <h3 className="text-[10px] font-black text-[#1D627D] uppercase tracking-widest">Billing Summary</h3>
            <span className={`text-[8px] font-black uppercase tracking-widest ${stats.pendingDues > 0 ? 'text-orange-500' : 'text-green-500'}`}>
              {stats.pendingDues > 0 ? 'Payment Due' : 'All Clear'}
            </span>
          </div>
          <div className="p-4 space-y-3">
            {invoices.slice(0, 3).map(inv => (
              <div key={inv.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div>
                  <p className="text-xs font-bold text-gray-800">INV-{inv.id}</p>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-wide">{formatDate(inv.createdAt).full}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-[#1d627d]">J${(inv.amount || 0).toLocaleString()}</p>
                  <span className={`text-[8px] font-black uppercase ${inv.status === 'paid' ? 'text-green-600' : 'text-orange-600'}`}>
                    {inv.status}
                  </span>
                </div>
              </div>
            ))}
            {invoices.length === 0 && (
              <div className="text-center py-6 text-gray-400">
                <p className="text-sm">No invoices</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Book Appointment Modal */}
      <Modal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        title="Schedule Consultation"
        size="md"
        footer={
          <Button variant="primary" onClick={handleBookAppointment} loading={saving}>
            Confirm Booking
          </Button>
        }
      >
        <div className="space-y-4 p-1">
          <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex items-start gap-3">
            <FiAlertCircle className="text-blue-500 mt-0.5" size={16} />
            <p className="text-[10px] text-blue-800 font-medium leading-relaxed">Select your physician and slot. Subject to reception approval.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Physician</label>
              <select
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm"
                value={bookingForm.doctorId}
                onChange={(e) => setBookingForm({ ...bookingForm, doctorId: e.target.value })}
              >
                <option value="">Select Doctor</option>
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>
                    Dr. {d.user?.firstName} {d.user?.lastName} ({d.specialization || 'General'})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date & Time</label>
              <input
                type="datetime-local"
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm"
                value={bookingForm.date}
                onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Symptoms</label>
            <textarea
              rows="3"
              className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none font-medium text-sm"
              placeholder="How are you feeling?"
              value={bookingForm.reason}
              onChange={(e) => setBookingForm({ ...bookingForm, reason: e.target.value })}
            ></textarea>
          </div>
        </div>
      </Modal>

      {/* Report View Modal */}
      <Modal
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        title="Lab Report"
        size="sm"
        footer={
          <div className="flex gap-2 w-full justify-end">
            <Button variant="secondary" onClick={() => setSelectedReport(null)}>Dismiss</Button>
            <Button variant="primary" onClick={() => {
              const rpt = generateBaseReport([selectedReport], 'Lab Report')
              downloadData(rpt, `Report_${selectedReport.testName?.replace(' ', '_')}.txt`)
            }}>
              Download
            </Button>
          </div>
        }
      >
        {selectedReport && (
          <div className="space-y-6">
            <div className="card-soft-blue flex justify-between items-center">
              <div>
                <h4 className="text-xl font-black text-[#1d627d]">{selectedReport.testName}</h4>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">LAB-{selectedReport.id}</p>
              </div>
              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${selectedReport.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {selectedReport.status}
              </span>
            </div>
            {selectedReport.results && (
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-gray-700 font-medium text-sm leading-relaxed italic text-justify">"{selectedReport.results}"</p>
              </div>
            )}
            {selectedReport.findings && (
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-blue-800 text-xs leading-relaxed">Findings: {selectedReport.findings}</p>
              </div>
            )}
            <div className="flex justify-between items-center pt-4 border-t border-gray-50">
              <p className="text-[10px] font-black text-gray-400 uppercase">Date: {formatDate(selectedReport.createdAt).full}</p>
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
              <h4 className="text-xl font-black text-gray-800 tracking-tight">Visit {selectedApt.status === 'scheduled' ? 'Confirmed' : 'Pending'}</h4>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Ref ID: APT-{selectedApt.id}</p>
            </div>
            <div className="p-4 bg-[#1d627d] rounded-2xl text-white">
              <p className="text-[8px] font-black opacity-60 uppercase mb-2 tracking-widest">Appointment Details</p>
              <p className="text-xs font-bold leading-relaxed">{getDoctorName(selectedApt)}</p>
              <p className="text-xs font-bold leading-relaxed">{formatDate(selectedApt.date).full} at {formatTime(selectedApt.date)}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default PatientDashboard
