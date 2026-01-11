import React, { useState, useMemo, useEffect } from 'react'
import { FiActivity, FiSearch, FiFileText, FiDownload, FiCheckCircle, FiClock, FiPlus, FiUser, FiEye, FiCheck } from 'react-icons/fi'
import Modal from '../../components/common/Modal'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import { printElement, downloadData, generateBaseReport } from '../../utils/helpers'
import { labAPI, patientAPI } from '../../api/services'
import { useAuth } from '../../context/AuthContext'

const LabResults = () => {
  const { role } = useAuth()

  // Role-based permissions
  const canCreate = ['super_admin', 'doctor', 'receptionist'].includes(role)
  const canEdit = ['super_admin', 'doctor'].includes(role)

  // State
  const [labReports, setLabReports] = useState([])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  // State Management
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedReport, setSelectedReport] = useState(null)
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState('All')
  const [formData, setFormData] = useState({
    patientId: '',
    testName: '',
    findings: '',
    results: '',
    status: 'pending'
  })

  // Fetch data on mount
  useEffect(() => {
    fetchLabResults()
    fetchPatients()
  }, [])

  const fetchLabResults = async () => {
    try {
      setLoading(true)
      const response = await labAPI.getAll()
      setLabReports(response.data.data || [])
    } catch (err) {
      setError('Failed to load lab results')
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
  const getPatientName = (report) => {
    if (typeof report.patient === 'string') return report.patient
    return report.patient?.name || report.patient?.firstName + ' ' + report.patient?.lastName || 'Unknown'
  }
  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })
  }

  const handleNewRequest = () => {
    if (!canCreate) return
    setFormData({
      patientId: '',
      testName: '',
      findings: '',
      results: '',
      status: 'pending'
    })
    setIsNewRequestOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await labAPI.create(formData)
      await fetchLabResults()
      setIsNewRequestOpen(false)
    } catch (err) {
      console.error('Save failed:', err)
      setError(err.response?.data?.message || 'Failed to save lab request')
    } finally {
      setSaving(false)
    }
  }

  // Filter Logic
  const filteredReports = useMemo(() => {
    return labReports.filter(report => {
      const patientName = getPatientName(report).toLowerCase()
      const query = searchQuery.toLowerCase()
      const matchesSearch = patientName.includes(query) ||
        String(report.id).includes(query) ||
        (report.testName || '').toLowerCase().includes(query)
      const matchesFilter = filterStatus === 'All' || report.status === filterStatus.toLowerCase()
      return matchesSearch && matchesFilter
    })
  }, [labReports, searchQuery, filterStatus])

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-50 text-green-600 border-green-100'
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100'
      case 'cancelled': return 'bg-red-50 text-red-500 border-red-100'
      default: return 'bg-blue-50 text-blue-600 border-blue-100'
    }
  }

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
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">Diagnostics Control</h2>
          <p className="text-gray-500 text-sm font-medium italic">Laboratory investigations and result lifecycle</p>
        </div>
        <div className="flex w-full sm:w-auto gap-3">
          <div className="relative flex-1 sm:w-64 group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1d627d] transition-colors" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-4 focus:ring-[#90e0ef]/30 font-medium text-sm transition-all"
            />
          </div>
          {canCreate && (
            <button
              onClick={handleNewRequest}
              className="btn-primary flex items-center gap-2 text-xs uppercase tracking-widest px-6"
            >
              <FiPlus size={16} /> Order Test
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100 w-fit">
        {['All', 'Completed', 'Pending'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`py-2 px-6 rounded-lg font-black uppercase text-[10px] tracking-widest transition-all ${filterStatus === status ? 'bg-[#90e0ef] text-[#1d627d] border border-blue-200' : 'text-gray-400 hover:text-gray-600'}`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Table Section */}
      <Card className="overflow-hidden p-0 border-gray-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#90E0EF]/10 text-[#1D627D] uppercase text-[10px] font-black tracking-widest">
              <tr>
                <th className="px-6 py-4 border-b">Request ID</th>
                <th className="px-6 py-4 border-b">Subject Identity</th>
                <th className="px-6 py-4 border-b">Investigation Panel</th>
                <th className="px-6 py-4 border-b text-center">Status</th>
                <th className="px-6 py-4 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-black text-[#1d627d]">LAB-{report.id}</span>
                    <div className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{formatDate(report.createdAt)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                        <FiUser size={16} />
                      </div>
                      <span className="font-bold text-gray-800">{getPatientName(report)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-700 tracking-tight">{report.testName}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => setSelectedReport(report)} className="btn-icon" title="View Report"><FiEye size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Report Preview Modal */}
      <Modal
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        title="Diagnostic Certificate"
        size="md"
        footer={
          <div className="flex gap-2 w-full justify-end">
            <Button variant="secondary" onClick={() => setSelectedReport(null)}>Dismiss</Button>
            <Button variant="primary" onClick={() => {
              const rpt = generateBaseReport([selectedReport], 'Lab Certificate')
              downloadData(rpt, `LAB-${selectedReport.id}.txt`)
            }}>
              <FiDownload size={16} className="mr-2" /> Download
            </Button>
            <Button variant="secondary" onClick={() => printElement()}>Print</Button>
          </div>
        }
      >
        {selectedReport && (
          <div className="space-y-6">
            <div className="card-soft-blue flex justify-between items-center group">
              <div>
                <h4 className="text-xl font-black text-[#1d627d] tracking-tight">{selectedReport.testName}</h4>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">LAB-{selectedReport.id} • {getPatientName(selectedReport)}</p>
              </div>
              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${getStatusColor(selectedReport.status)}`}>
                {selectedReport.status}
              </span>
            </div>

            <div className="space-y-4 px-1">
              {selectedReport.results ? (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-700">
                  <p className="font-bold mb-2">Results:</p>
                  <p>{selectedReport.results}</p>
                </div>
              ) : (
                <div className="p-10 border-2 border-dashed border-gray-100 rounded-3xl text-center space-y-2 grayscale opacity-50">
                  <FiClock className="mx-auto" size={24} />
                  <p className="text-[10px] font-black uppercase tracking-widest">Processing Node Results</p>
                </div>
              )}
              {selectedReport.findings && (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 italic text-xs text-gray-600 leading-relaxed">
                  "{selectedReport.findings}"
                </div>
              )}
              {selectedReport.status === 'completed' && (
                <div className="flex items-center gap-2 text-[10px] font-black text-green-600 uppercase tracking-widest self-center justify-center pt-2">
                  <FiCheckCircle size={14} /> Certified by Lab Node
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* New Lab Request Modal */}
      <Modal
        isOpen={isNewRequestOpen}
        onClose={() => setIsNewRequestOpen(false)}
        title="Order Investigation"
        size="md"
        footer={
          <div className="flex gap-2 w-full justify-end">
            <Button variant="secondary" onClick={() => setIsNewRequestOpen(false)}>Discard</Button>
            <Button variant="primary" onClick={handleSave} loading={saving}>
              <FiCheck className="mr-2" /> Commit
            </Button>
          </div>
        }
      >
        <div className="space-y-4 p-1">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Patient</label>
            <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm" value={formData.patientId} onChange={(e) => setFormData({ ...formData, patientId: e.target.value })} >
              <option value="">Select Patient</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name} (ID: {p.patientId})</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Test Name</label>
            <input type="text" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm placeholder:font-normal" placeholder="e.g., Full Blood Count (CBC)" value={formData.testName} onChange={(e) => setFormData({ ...formData, testName: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Investigation Profile (Quick Select)</label>
            <div className="grid grid-cols-2 gap-2">
              {['Full Blood Count', 'Lipid Profile', 'Thyroid Function', 'Liver Function'].map(t => (
                <button key={t} type="button" onClick={() => setFormData({ ...formData, testName: t })} className={`p-3 border rounded-xl text-[10px] font-black uppercase tracking-tight transition-all ${formData.testName === t ? 'border-[#1d627d] bg-[#90e0ef]/20 text-[#1d627d]' : 'border-gray-100 text-gray-700 hover:bg-gray-50'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default LabResults
