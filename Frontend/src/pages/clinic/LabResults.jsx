import React, { useState, useMemo } from 'react'
import { FiActivity, FiSearch, FiFileText, FiDownload, FiCheckCircle, FiClock, FiPlus, FiUser, FiEye } from 'react-icons/fi'
import Modal from '../../components/common/Modal'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import { printElement, downloadData, generateBaseReport } from '../../utils/helpers'

const LabResults = () => {
  // Dummy Data
  const [labReports, setLabReports] = useState([
    { id: 'LAB-2026-901', patient: 'Michael J.', test: 'Full Blood Count (CBC)', date: '2026-01-05', status: 'Final', technician: 'Alice Wong', findings: 'All parameters within normal range except Hemoglobin (13.2 g/dL).', results: { hgb: 13.2, wbc: 7500, plt: 250000 } },
    { id: 'LAB-2026-902', patient: 'Sarah K.', test: 'Lipid Profile', date: '2026-01-04', status: 'Pending', technician: 'Bob Miller', findings: 'Processing in progress...', results: null },
    { id: 'LAB-2026-903', patient: 'John Doe', test: 'Thyroid Function (T3/T4/TSH)', date: '2026-01-03', status: 'Final', technician: 'Alice Wong', findings: 'Elevated TSH levels detected (6.2 µIU/mL). Possible hypothyroidism.', results: { t3: 100, t4: 8.5, tsh: 6.2 } },
    { id: 'LAB-2026-904', patient: 'Emily Davis', test: 'Liver Function Test', date: '2026-01-02', status: 'Final', technician: 'Alice Wong', findings: 'Normal liver enzyme levels.', results: { alt: 25, ast: 30, alp: 70 } },
    { id: 'LAB-2026-905', patient: 'Robert Brown', test: 'Urinalysis', date: '2026-01-01', status: 'Draft', technician: 'Bob Miller', findings: 'Drafting initial observations...', results: null },
  ])

  // State Management
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedReport, setSelectedReport] = useState(null)
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState('All')

  // Filter Logic
  const filteredReports = useMemo(() => {
    return labReports.filter(report => {
      const matchesSearch = report.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.test.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFilter = filterStatus === 'All' || report.status === filterStatus
      return matchesSearch && matchesFilter
    })
  }, [labReports, searchQuery, filterStatus])

  const getStatusColor = (status) => {
    switch (status) {
      case 'Final': return 'bg-green-50 text-green-600 border-green-100'
      case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100'
      case 'Draft': return 'bg-gray-50 text-gray-500 border-gray-100'
      default: return 'bg-blue-50 text-blue-600 border-blue-100'
    }
  }

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
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
          <button
            onClick={() => setIsNewRequestOpen(true)}
            className="btn-primary flex items-center gap-2 text-xs uppercase tracking-widest px-6"
          >
            <FiPlus size={16} /> Order Test
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100 w-fit">
        {['All', 'Final', 'Pending'].map(status => (
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
                    <span className="font-black text-[#1d627d]">{report.id}</span>
                    <div className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{report.date}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                        <FiUser size={16} />
                      </div>
                      <span className="font-bold text-gray-800">{report.patient}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-700 tracking-tight">{report.test}</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">By: {report.technician}</div>
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
              downloadData(rpt, `${selectedReport.id}.txt`)
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
                <h4 className="text-xl font-black text-[#1d627d] tracking-tight">{selectedReport.test}</h4>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{selectedReport.id} • {selectedReport.patient}</p>
              </div>
              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border border-blue-100 bg-white`}>
                {selectedReport.status}
              </span>
            </div>

            <div className="space-y-4 px-1">
              {selectedReport.results ? (
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(selectedReport.results).map(([key, val]) => (
                    <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{key} Level</span>
                      <span className="font-black text-gray-800">{val} <span className="text-[8px] opacity-40 uppercase">Units</span></span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-10 border-2 border-dashed border-gray-100 rounded-3xl text-center space-y-2 grayscale opacity-50">
                  <FiClock className="mx-auto" size={24} />
                  <p className="text-[10px] font-black uppercase tracking-widest">Processing Node Results</p>
                </div>
              )}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 italic text-xs text-gray-600 leading-relaxed">
                "{selectedReport.findings}"
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-green-600 uppercase tracking-widest self-center justify-center pt-2">
                <FiCheckCircle size={14} /> Certified by Lab Node
              </div>
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
        footer={<Button variant="primary" onClick={() => setIsNewRequestOpen(false)}>Commit</Button>}
      >
        <div className="space-y-4 p-1">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Search Subject</label>
            <input type="text" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm placeholder:font-normal" placeholder="Patient Identity..." />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Investigation Profile</label>
            <div className="grid grid-cols-2 gap-2">
              {['Immunity Panel', 'Diabetes Screening', 'Cardiac Markers', 'Thyroid Profile'].map(t => (
                <label key={t} className="p-3 border border-gray-100 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-all">
                  <input type="checkbox" className="w-4 h-4 accent-[#1d627d]" />
                  <span className="text-[10px] font-black text-gray-700 uppercase tracking-tight">{t}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default LabResults
