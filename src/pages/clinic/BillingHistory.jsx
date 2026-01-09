import React, { useState, useMemo } from 'react'
import { FiDollarSign, FiDownload, FiSearch, FiEye, FiClock, FiCreditCard, FiPrinter } from 'react-icons/fi'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import { printElement, downloadData, generateBaseReport } from '../../utils/helpers'

const BillingHistory = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedInvoice, setSelectedInvoice] = useState(null)

  const [invoices, setInvoices] = useState([
    { id: 'INV-2026-001', service: 'General Consultation', date: 'Jan 05, 2026', amount: 1500, status: 'Paid', method: 'UPI (GPay)' },
    { id: 'INV-2026-002', service: 'Full Blood Count (CBC)', date: 'Jan 04, 2026', amount: 800, status: 'Paid', method: 'Insurance' },
    { id: 'INV-2026-003', service: 'Physiotherapy Session', date: 'Dec 28, 2025', amount: 2000, status: 'Paid', method: 'Credit Card' },
    { id: 'INV-2026-004', service: 'Emergency Medication', date: 'Jan 06, 2026', amount: 550, status: 'Pending', method: 'Offline' },
  ])

  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv =>
      inv.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [invoices, searchQuery])

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-50 text-green-600 border-green-100'
      case 'Pending': return 'bg-yellow-50 text-yellow-600 border-yellow-100'
      default: return 'bg-gray-50 text-gray-500 border-gray-100'
    }
  }

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Billing Archive</h1>
          <p className="text-gray-500 text-sm">Historical records of all transactions and payments</p>
        </div>
        <div className="relative w-full md:w-72 group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1d627d] transition-colors" />
          <input
            type="text"
            placeholder="Search archive..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-4 focus:ring-[#90e0ef]/30 font-medium text-sm transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-soft-blue flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-[#1d627d] uppercase tracking-widest opacity-60">Total Settled</p>
            <h3 className="text-2xl font-black text-gray-800 tracking-tighter">J$4,300.00</h3>
          </div>
          <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
            <FiDollarSign size={20} />
          </div>
        </div>
        <div className="card-soft-blue border-red-200 bg-red-50/20 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-red-700 uppercase tracking-widest opacity-60">Pending Dues</p>
            <h3 className="text-2xl font-black text-gray-800 tracking-tighter">J$550.00</h3>
          </div>
          <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
            <FiClock size={20} />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <Card className="overflow-hidden p-0 border-gray-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#90E0EF]/10 text-[#1D627D] uppercase text-[10px] font-black tracking-widest">
              <tr>
                <th className="px-6 py-4 border-b">Receipt ID</th>
                <th className="px-6 py-4 border-b">Service Segment</th>
                <th className="px-6 py-4 border-b">Net Amount</th>
                <th className="px-6 py-4 border-b">Status</th>
                <th className="px-6 py-4 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 font-black text-[#1d627d] text-sm tracking-tight">{inv.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-800 text-sm">{inv.service}</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{inv.date}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-black text-gray-800 text-sm">J${inv.amount.toLocaleString()}</div>
                    <div className="text-[10px] text-gray-400 uppercase font-black italic">{inv.method}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusColor(inv.status)}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="btn-icon h-8 w-8 flex items-center justify-center"
                        title="View Record"
                      >
                        <FiEye size={16} />
                      </button>
                      <button
                        className="btn-icon h-8 w-8 flex items-center justify-center"
                        title="Print"
                        onClick={() => printElement()}
                      >
                        <FiPrinter size={16} />
                      </button>
                      <button
                        className="btn-icon h-8 w-8 flex items-center justify-center"
                        title="Download"
                        onClick={() => {
                          const rpt = generateBaseReport([inv], 'Billing Record')
                          downloadData(rpt, `${inv.id}.txt`)
                        }}
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

      {/* Summary Modal */}
      <Modal
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        title="Transaction Record"
        size="sm"
        footer={<Button variant="primary" onClick={() => setSelectedInvoice(null)}>Close</Button>}
      >
        {selectedInvoice && (
          <div className="space-y-6">
            <div className="card-soft-blue text-center">
              <h4 className="text-xl font-black text-[#1d627d]">{selectedInvoice.id}</h4>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 italic">Issued on {selectedInvoice.date}</p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-bold uppercase tracking-widest">Service</span>
                <span className="font-black text-gray-800">{selectedInvoice.service}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-bold uppercase tracking-widest">Method</span>
                <span className="font-black text-gray-800 uppercase italic">{selectedInvoice.method}</span>
              </div>
              <div className="flex justify-between text-xl border-t border-gray-100 pt-4">
                <span className="text-[#1D627D] font-black uppercase text-xs tracking-[0.2em] self-center">Settled Total</span>
                <span className="font-black text-[#1D627D]">J${selectedInvoice.amount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default BillingHistory
