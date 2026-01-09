import React, { useState, useEffect } from 'react'
import StatCard from '../../components/dashboard/StatCard'
import Card from '../../components/common/Card'
import Modal from '../../components/common/Modal'
import Button from '../../components/common/Button'
import { FiUserPlus, FiCalendar, FiXCircle, FiCheck, FiSearch, FiEdit2, FiUserCheck, FiPhone, FiEye, FiClock } from 'react-icons/fi'
import { patientAPI, appointmentAPI, doctorAPI } from '../../api/services'

const ReceptionistDashboard = () => {
  const [isRegModalOpen, setIsRegModalOpen] = useState(false)
  const [selectedApt, setSelectedApt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [patients, setPatients] = useState([])
  const [appointments, setAppointments] = useState([])
  const [doctors, setDoctors] = useState([])
  const [stats, setStats] = useState({
    newPatientsToday: 0,
    appointmentsBooked: 0,
    cancelledAppointments: 0
  })
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Male',
    address: ''
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [patientsRes, appointmentsRes, doctorsRes] = await Promise.all([
        patientAPI.getAll(),
        appointmentAPI.getAll(),
        doctorAPI.getAll()
      ])

      const allPatients = patientsRes.data.data || []
      const allAppointments = appointmentsRes.data.data || []
      const allDoctors = doctorsRes.data.data || []

      // Filter today's data
      const today = new Date().toISOString().split('T')[0]
      const todayPatients = allPatients.filter(p => {
        const createdDate = p.createdAt?.split('T')[0]
        return createdDate === today
      })

      const todayAppointments = allAppointments.filter(a => {
        const aptDate = a.date?.split('T')[0]
        return aptDate === today
      })

      const cancelledToday = todayAppointments.filter(a => a.status === 'cancelled').length
      const pendingOrScheduled = todayAppointments.filter(a =>
        a.status === 'scheduled' || a.status === 'pending'
      )

      setPatients(allPatients.slice(-10).reverse()) // Show recent 10 patients
      setAppointments(pendingOrScheduled.slice(0, 10))
      setDoctors(allDoctors)

      setStats({
        newPatientsToday: todayPatients.length,
        appointmentsBooked: todayAppointments.length,
        cancelledAppointments: cancelledToday
      })

    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!formData.firstName || !formData.lastName) return
    setSaving(true)
    try {
      await patientAPI.create(formData)
      await fetchDashboardData()
      setIsRegModalOpen(false)
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        dateOfBirth: '',
        gender: 'Male',
        address: ''
      })
    } catch (err) {
      console.error('Failed to register patient:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleCheckIn = async () => {
    if (!selectedApt) return
    setSaving(true)
    try {
      await appointmentAPI.update(selectedApt.id, { status: 'in_progress' })
      await fetchDashboardData()
      setSelectedApt(null)
    } catch (err) {
      console.error('Failed to check in:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = async () => {
    if (!selectedApt) return
    setSaving(true)
    try {
      await appointmentAPI.update(selectedApt.id, { status: 'cancelled' })
      await fetchDashboardData()
      setSelectedApt(null)
    } catch (err) {
      console.error('Failed to cancel:', err)
    } finally {
      setSaving(false)
    }
  }

  const getPatientName = (apt) => {
    // Backend returns patient as a string (full name)
    if (typeof apt.patient === 'string') {
      return apt.patient || 'Unknown'
    }
    if (apt.patient) {
      return apt.patient.name || `${apt.patient.firstName || ''} ${apt.patient.lastName || ''}`.trim() || 'Unknown'
    }
    return 'Unknown'
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

  const formatTime = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
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
        <StatCard title="New Patients Today" count={stats.newPatientsToday.toString()} subtitle="Registered" icon={FiUserPlus} color="blue" />
        <StatCard title="Appointments Booked" count={stats.appointmentsBooked.toString()} subtitle="Total for today" icon={FiCalendar} color="green" />
        <StatCard title="Cancelled" count={stats.cancelledAppointments.toString()} subtitle="Appointments" icon={FiXCircle} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side: Recent Registrations */}
        <Card className="border-gray-100 shadow-sm overflow-hidden p-0">
          <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-[#90E0EF]/10">
            <h3 className="text-[10px] font-black text-[#1D627D] uppercase tracking-widest">Recent Intake</h3>
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Last 10</span>
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
                {patients.length > 0 ? patients.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-800">{p.name || `${p.firstName || ''} ${p.lastName || ''}`.trim()}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase">{p.patientId || `PAT-${p.id}`}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold text-gray-500">{formatDate(p.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="btn-icon">
                        <FiEye size={16} />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-10 text-center text-gray-400 text-sm">
                      No patients registered yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Right Side: Appointments Queue */}
        <Card className="border-gray-100 shadow-sm overflow-hidden p-0">
          <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-[#90E0EF]/10">
            <h3 className="text-[10px] font-black text-[#1D627D] uppercase tracking-widest">Queue Status</h3>
            <span className="bg-white px-2 py-0.5 rounded text-[8px] font-black text-[#1d627d] border border-blue-50 uppercase tracking-widest">Live Roster</span>
          </div>
          <div className="p-0">
            <table className="w-full text-left">
              <tbody className="divide-y divide-gray-50">
                {appointments.length > 0 ? appointments.map(apt => (
                  <tr key={apt.id} className="hover:bg-gray-50 transition-colors group cursor-pointer" onClick={() => setSelectedApt(apt)}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-[#1d627d] font-black text-xs">
                          {formatTime(apt.date)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-800">{getDoctorName(apt)} <span className="text-[10px] text-gray-400 font-normal ml-1">{apt.doctor?.specialization || 'General'}</span></div>
                          <div className="text-[10px] text-gray-500 font-medium flex items-center gap-1"><FiUserCheck size={10} className="text-green-500" /> {getPatientName(apt)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center gap-1 text-[8px] font-black px-2 py-1 rounded border uppercase tracking-widest ${apt.status === 'scheduled' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                        <FiCheck size={10} /> {apt.status}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="2" className="px-6 py-10 text-center text-gray-400 text-sm">
                      No appointments in queue
                    </td>
                  </tr>
                )}
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
            <Button variant="primary" onClick={handleRegister} loading={saving}>
              <FiCheck className="mr-2" /> Complete Intake
            </Button>
          </div>
        }
      >
        <form className="space-y-4 p-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">First Name</label>
              <input type="text" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm" placeholder="John" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
              <input type="text" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm" placeholder="Doe" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone</label>
              <input type="text" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm" placeholder="+1..." value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date of Birth</label>
              <input type="date" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm" value={formData.dateOfBirth} onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Gender</label>
              <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Address</label>
              <input type="text" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm" placeholder="Street, City" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
            </div>
          </div>
        </form>
      </Modal>

      {/* Appointment Quick Action Modal */}
      <Modal
        isOpen={!!selectedApt}
        onClose={() => setSelectedApt(null)}
        title="Queue Action"
        size="sm"
        footer={<Button variant="secondary" onClick={() => setSelectedApt(null)}>Dismiss</Button>}
      >
        {selectedApt && (
          <div className="space-y-4 p-1">
            <div className="card-soft-blue text-center">
              <h4 className="text-xl font-black text-[#1D627D] tracking-tight">{getPatientName(selectedApt)}</h4>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{getDoctorName(selectedApt)} • {formatTime(selectedApt.date)}</p>
            </div>
            <div className="space-y-2">
              <button
                onClick={handleCheckIn}
                disabled={saving}
                className="w-full py-3 bg-[#90e0ef] text-[#1d627d] rounded-xl font-black uppercase text-[10px] tracking-widest border border-blue-200 transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <FiCheck /> Mark as Arrived
              </button>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="w-full py-3 text-red-500 font-black uppercase text-[10px] tracking-widest hover:underline flex items-center justify-center gap-2 disabled:opacity-50"
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
