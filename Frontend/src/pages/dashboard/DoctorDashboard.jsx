import React, { useState, useEffect } from 'react'
import StatCard from '../../components/dashboard/StatCard'
import Card from '../../components/common/Card'
import Modal from '../../components/common/Modal'
import Button from '../../components/common/Button'
import { FiUsers, FiCalendar, FiActivity, FiFileText, FiClock, FiCheckCircle, FiPlay, FiPlus, FiArrowRight, FiCheck, FiEye, FiDownload } from 'react-icons/fi'
import { appointmentAPI, patientAPI, labAPI, prescriptionAPI, medicalNotesAPI } from '../../api/services'
import { useAuth } from '../../context/AuthContext'

const DoctorDashboard = () => {
  const { user } = useAuth()
  const [selectedConsultation, setSelectedConsultation] = useState(null)
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false)
  const [isLabModalOpen, setIsLabModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [appointments, setAppointments] = useState([])
  const [patients, setPatients] = useState([])
  const [labReports, setLabReports] = useState([])
  const [stats, setStats] = useState({
    myPatients: 0,
    todaySlots: 0,
    remainingSlots: 0,
    newLabReports: 0,
    monthlyReports: 0
  })
  const [prescriptionForm, setPrescriptionForm] = useState({
    patientId: '',
    medications: ''
  })
  const [labForm, setLabForm] = useState({
    patientId: '',
    tests: []
  })
  const [consultationNotes, setConsultationNotes] = useState('')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [appointmentsRes, patientsRes, labRes] = await Promise.all([
        appointmentAPI.getAll(),
        patientAPI.getAll(),
        labAPI.getAll()
      ])

      const allAppointments = appointmentsRes.data.data || []
      const allPatients = patientsRes.data.data || []
      const allLabReports = labRes.data.data || []

      // Filter today's appointments for this doctor
      const today = new Date().toISOString().split('T')[0]
      const todayAppts = allAppointments.filter(a => {
        const aptDate = a.date?.split('T')[0]
        return aptDate === today && (a.status === 'scheduled' || a.status === 'pending')
      })

      setAppointments(todayAppts.slice(0, 10)) // Show max 10 appointments
      setPatients(allPatients)
      setLabReports(allLabReports)

      // Calculate stats
      const completedToday = allAppointments.filter(a => {
        const aptDate = a.date?.split('T')[0]
        return aptDate === today && a.status === 'completed'
      }).length

      const pendingLabReports = allLabReports.filter(l => l.status === 'pending').length

      setStats({
        myPatients: allPatients.length,
        todaySlots: todayAppts.length + completedToday,
        remainingSlots: todayAppts.length,
        newLabReports: pendingLabReports,
        monthlyReports: allLabReports.length
      })

    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleStartConsultation = (apt) => {
    setSelectedConsultation(apt)
    setConsultationNotes('')
  }

  const handleFinishConsultation = async () => {
    if (!selectedConsultation) return
    setSaving(true)
    try {
      // Update appointment status
      await appointmentAPI.update(selectedConsultation.id, { status: 'completed' })

      // Create medical note if notes were entered
      if (consultationNotes.trim()) {
        await medicalNotesAPI.create({
          patientId: selectedConsultation.patientId,
          noteType: 'consultation',
          content: consultationNotes
        })
      }

      await fetchDashboardData()
      setSelectedConsultation(null)
    } catch (err) {
      console.error('Failed to complete consultation:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleSavePrescription = async () => {
    if (!prescriptionForm.patientId || !prescriptionForm.medications) return
    setSaving(true)
    try {
      await prescriptionAPI.create({
        patientId: parseInt(prescriptionForm.patientId),
        medications: prescriptionForm.medications,
        instructions: 'As prescribed'
      })
      setIsPrescriptionModalOpen(false)
      setPrescriptionForm({ patientId: '', medications: '' })
    } catch (err) {
      console.error('Failed to create prescription:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveLabRequest = async () => {
    if (!labForm.patientId || labForm.tests.length === 0) return
    setSaving(true)
    try {
      // Create lab requests for each selected test
      for (const test of labForm.tests) {
        await labAPI.create({
          patientId: parseInt(labForm.patientId),
          testName: test,
          status: 'pending'
        })
      }
      setIsLabModalOpen(false)
      setLabForm({ patientId: '', tests: [] })
      await fetchDashboardData()
    } catch (err) {
      console.error('Failed to create lab request:', err)
    } finally {
      setSaving(false)
    }
  }

  const toggleTest = (test) => {
    setLabForm(prev => ({
      ...prev,
      tests: prev.tests.includes(test)
        ? prev.tests.filter(t => t !== test)
        : [...prev.tests, test]
    }))
  }

  const getPatientName = (apt) => {
    // Backend returns patient as a string (full name)
    if (typeof apt.patient === 'string') {
      return apt.patient || 'Unknown'
    }
    // Fallback for object format
    if (apt.patient) {
      return apt.patient.name || `${apt.patient.firstName || ''} ${apt.patient.lastName || ''}`.trim() || 'Unknown'
    }
    return 'Unknown'
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
        <StatCard title="My Patients" count={stats.myPatients.toString()} subtitle="Active cases" icon={FiUsers} color="blue" />
        <StatCard title="Today Slots" count={stats.todaySlots.toString()} subtitle={`${stats.remainingSlots} remaining`} icon={FiCalendar} color="green" />
        <StatCard title="Lab Reports" count={stats.newLabReports.toString()} subtitle="Pending review" icon={FiActivity} color="red" />
        <StatCard title="Reports Sub" count={stats.monthlyReports.toString()} subtitle="This month" icon={FiFileText} color="purple" />
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
                  {appointments.length > 0 ? appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="text-sm font-black text-[#1d627d]">{formatTime(apt.date)}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase">30 Min</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-800">#{apt.id} • {getPatientName(apt)}</div>
                        <div className="text-[10px] text-[#90E0EF] font-black uppercase tracking-widest">{apt.type || 'Consultation'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase tracking-tighter">
                          {apt.reason || 'General Checkup'}
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
                  )) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-10 text-center text-gray-400 text-sm">
                        No appointments scheduled for today
                      </td>
                    </tr>
                  )}
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
                    <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">{stats.newLabReports} pending signatures</p>
                  </div>
                </li>
                <li className="flex items-center gap-3 p-3 bg-white/60 rounded-xl border border-blue-50 hover:bg-white transition-all cursor-pointer">
                  <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                    <FiCheckCircle size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-800 uppercase tracking-tighter leading-none">Appointments Today</p>
                    <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">{stats.remainingSlots} remaining</p>
                  </div>
                </li>
              </ul>
            </div>
          </Card>

          {/* Recent Lab Reports */}
          <Card className="border-gray-100 shadow-sm p-4">
            <h4 className="text-[10px] font-black text-[#1D627D] uppercase tracking-widest mb-3">Recent Lab Reports</h4>
            <ul className="space-y-2">
              {labReports.slice(0, 3).map((report, i) => (
                <li key={report.id || i} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <p className="text-xs font-bold text-gray-800">{typeof report.patient === 'string' ? report.patient : (report.patient?.name || 'Unknown')}</p>
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-wide">{report.testName}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${report.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                      {report.status}
                    </span>
                  </div>
                </li>
              ))}
              {labReports.length === 0 && (
                <li className="text-center text-gray-400 text-xs py-4">No lab reports</li>
              )}
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
            <Button variant="primary" onClick={handleFinishConsultation} loading={saving}>
              <FiCheck className="mr-2" /> Finish
            </Button>
          </div>
        }
      >
        {selectedConsultation && (
          <div className="space-y-6">
            <div className="card-soft-blue flex justify-between items-center">
              <div>
                <h4 className="text-xl font-black text-[#1d627d]">{getPatientName(selectedConsultation)}</h4>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">#{selectedConsultation.id} • {selectedConsultation.reason || 'General Checkup'}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Notes</label>
                <textarea
                  rows="4"
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none text-sm font-medium"
                  placeholder="Clinical observations..."
                  value={consultationNotes}
                  onChange={(e) => setConsultationNotes(e.target.value)}
                ></textarea>
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
        footer={
          <Button variant="primary" onClick={handleSavePrescription} loading={saving}>
            Authorize
          </Button>
        }
      >
        <div className="space-y-4 p-1">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Patient</label>
            <select
              className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm"
              value={prescriptionForm.patientId}
              onChange={(e) => setPrescriptionForm({ ...prescriptionForm, patientId: e.target.value })}
            >
              <option value="">Select Patient</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name} (ID: {p.patientId || p.id})</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Medications</label>
            <textarea
              rows="5"
              className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold text-sm text-[#1d627d]"
              placeholder="1. Med A - 500mg - 1-0-1"
              value={prescriptionForm.medications}
              onChange={(e) => setPrescriptionForm({ ...prescriptionForm, medications: e.target.value })}
            ></textarea>
          </div>
        </div>
      </Modal>

      {/* Request Lab Modal */}
      <Modal
        isOpen={isLabModalOpen}
        onClose={() => setIsLabModalOpen(false)}
        title="Lab Investigation"
        size="sm"
        footer={
          <Button variant="primary" onClick={handleSaveLabRequest} loading={saving}>
            Send Request
          </Button>
        }
      >
        <div className="space-y-4 p-1">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Patient</label>
            <select
              className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm"
              value={labForm.patientId}
              onChange={(e) => setLabForm({ ...labForm, patientId: e.target.value })}
            >
              <option value="">Select Patient</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {['CBC', 'Lipid Profile', 'KFT', 'LFT', 'Thyroid Function', 'Urine Analysis'].map(test => (
              <label key={test} className="p-3 border border-gray-100 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-all">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-[#1d627d]"
                  checked={labForm.tests.includes(test)}
                  onChange={() => toggleTest(test)}
                />
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
