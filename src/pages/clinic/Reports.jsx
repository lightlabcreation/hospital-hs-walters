import React, { useState } from 'react'
import { FiBarChart2, FiUsers, FiDollarSign, FiDownload, FiArrowUpRight, FiArrowDownRight, FiFilter, FiTrendingUp, FiCheckCircle, FiActivity, FiEye } from 'react-icons/fi'
import Modal from '../../components/common/Modal'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import { printElement, downloadData, generateBaseReport } from '../../utils/helpers'

const Reports = () => {
  const [isExporting, setIsExporting] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const [filterPeriod, setFilterPeriod] = useState('This Month')

  const stats = [
    { title: 'Total Patients', value: '1,248', change: '+12%', up: true, icon: FiUsers, color: 'blue' },
    { title: 'Monthly Revenue', value: 'J$1,240,000', change: '+18.5%', up: true, icon: FiDollarSign, color: 'green' },
    { title: 'Active Cases', value: '85', change: '-4%', up: false, icon: FiActivity, color: 'purple' },
  ]

  const detailedReports = [
    { id: 'RPT-001', category: 'New Registrations', total: 120, trend: 'Increasing', color: 'text-green-600', details: 'A significant 20% growth in pediatric registrations observed this month.' },
    { id: 'RPT-002', category: 'Lab Tests Done', total: 450, trend: 'Stable', color: 'text-blue-600', details: 'Pathology lab reports are being processed within the standard TAT of 24 hours.' },
    { id: 'RPT-003', category: 'Pending Invoices', total: 18, trend: 'High Priority', color: 'text-red-600', details: 'Outstanding payments totaling J$45,000 across 12 insurance claims.' },
    { id: 'RPT-004', category: 'Follow-ups Missed', total: 5, trend: 'Low', color: 'text-orange-600', details: 'Minimal follow-up misses recorded this week. Automated reminders effective.' },
  ]

  const handleExport = () => {
    setIsExporting(true)
    setTimeout(() => {
      setIsExporting(false)
      const reportText = generateBaseReport(detailedReports, 'System Metrics')
      downloadData(reportText, `Reports_${filterPeriod.replace(' ', '_')}.txt`)
    }, 1500)
  }

  const handleDownloadItem = (report) => {
    const itemData = generateBaseReport([report], 'Single Metric')
    downloadData(itemData, `${report.id}.txt`)
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Clinic Intelligence</h1>
          <p className="text-gray-500 text-sm font-medium">Analytics and operational overview for <span className="text-[#1d627d] font-bold">{filterPeriod}</span></p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex-1 sm:flex-none btn-secondary flex items-center justify-center gap-2 px-6 py-2.5 text-[10px] uppercase tracking-widest"
          >
            <FiFilter /> Filter
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className={`flex-1 sm:flex-none btn-primary flex items-center justify-center gap-2 px-6 py-2.5 text-[10px] uppercase tracking-widest ${isExporting ? 'opacity-50' : ''}`}
          >
            {isExporting ? 'Exporting...' : <><FiDownload /> Export PDF</>}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.color === 'blue' ? 'bg-[#90e0ef]/20 text-[#1d627d]' : stat.color === 'green' ? 'bg-green-50 text-green-600' : 'bg-purple-50 text-purple-600'}`}>
                <stat.icon size={20} />
              </div>
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black ${stat.up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {stat.up ? <FiArrowUpRight /> : <FiArrowDownRight />} {stat.change}
              </div>
            </div>
            <p className="text-gray-400 font-black uppercase text-[10px] tracking-widest mb-1">{stat.title}</p>
            <h3 className="text-2xl font-black text-gray-800">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <Card className="overflow-hidden p-0 border-gray-100 shadow-sm">
        <div className="p-4 border-b border-gray-50 bg-gray-50/30 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#1d627d] text-white rounded-lg flex items-center justify-center shadow-lg">
            <FiTrendingUp size={16} />
          </div>
          <h2 className="font-black text-gray-800 text-sm tracking-tight uppercase tracking-widest">Advanced Metrics breakdown</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#90E0EF]/10 text-[#1D627D] uppercase text-[10px] font-black tracking-widest">
              <tr>
                <th className="px-6 py-4 border-b">Category</th>
                <th className="px-6 py-4 border-b text-center">Volume</th>
                <th className="px-6 py-4 border-b">Trend</th>
                <th className="px-6 py-4 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {detailedReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50/50 transition-all group">
                  <td className="px-6 py-4">
                    <div className="font-black text-gray-800 text-sm tracking-tight">{report.category}</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{report.id}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-gray-100 text-gray-700 font-black px-3 py-1 rounded-lg text-xs">
                      {report.total}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-2 font-black text-[10px] uppercase tracking-widest ${report.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${report.color.replace('text', 'bg')}`}></span>
                      {report.trend}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="btn-icon"
                        title="View Insight"
                      >
                        <FiEye size={16} />
                      </button>
                      <button
                        onClick={() => handleDownloadItem(report)}
                        className="btn-icon"
                        title="Download Dataset"
                      >
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

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        title={`Insight: ${selectedReport?.category}`}
        size="md"
        footer={
          <div className="flex gap-2 w-full justify-end">
            <Button variant="secondary" onClick={() => setSelectedReport(null)}>Dismiss</Button>
            <Button variant="primary" onClick={() => printElement()}>
              Print Detail
            </Button>
          </div>
        }
      >
        {selectedReport && (
          <div className="space-y-6">
            <div className="card-soft-blue flex flex-col items-center">
              <FiBarChart2 size={48} className="text-[#1d627d] mb-4 opacity-20" />
              <h4 className="text-4xl font-black text-gray-800">{selectedReport.total}</h4>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Aggregate Volume</p>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Strategic analysis</p>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 italic text-gray-700 text-sm leading-relaxed font-medium">
                "{selectedReport.details}"
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-gray-100 bg-white flex items-center justify-between">
                <span className="text-[10px] font-black text-gray-400 uppercase">Trend</span>
                <span className={`font-black text-xs uppercase ${selectedReport.color}`}>
                  {selectedReport.trend}
                </span>
              </div>
              <div className="p-4 rounded-xl border border-gray-100 bg-white flex items-center justify-between">
                <span className="text-[10px] font-black text-gray-400 uppercase">ID Code</span>
                <span className="font-black text-xs text-gray-800">{selectedReport.id}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Filter Modal */}
      <Modal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Report Filter"
        size="sm"
        footer={
          <div className="flex gap-2 w-full justify-end">
            <Button variant="secondary" onClick={() => setIsFilterOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setIsFilterOpen(false)}>Apply Filter</Button>
          </div>
        }
      >
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Time Horizon</label>
            <div className="grid grid-cols-2 gap-2">
              {['Today', 'This Week', 'This Month', 'Custom'].map((period) => (
                <button
                  key={period}
                  onClick={() => setFilterPeriod(period)}
                  className={`py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${filterPeriod === period ? 'bg-[#90E0EF] text-[#1D627D] border-[#90E0EF]' : 'bg-gray-50 text-gray-400 border-gray-100 hover:border-gray-300'}`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Reports
