import React, { useState } from 'react'
import StatCard from '../../components/dashboard/StatCard'
import Card from '../../components/common/Card'
import Modal from '../../components/common/Modal'
import Button from '../../components/common/Button'
import { FiFileText, FiCheckCircle, FiClock, FiPlus, FiPrinter, FiMail, FiCheck, FiSearch, FiEye, FiActivity } from 'react-icons/fi'
import { printElement } from '../../utils/helpers'

const BillingDashboard = () => {
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false)
  const [selectedTx, setSelectedTx] = useState(null)

  const transactions = [
    { id: 'INV-2026-001', patient: 'Sarah Connor', amount: 2500, status: 'Paid', date: 'Jan 05, 2026', method: 'UPI' },
    { id: 'INV-2026-002', patient: 'Tony Stark', amount: 15000, status: 'Pending', date: 'Jan 06, 2026', method: 'Insurance' },
    { id: 'INV-2026-003', patient: 'Diana Prince', amount: 800, status: 'Paid', date: 'Jan 06, 2026', method: 'Cash' },
    { id: 'INV-2026-004', patient: 'Bruce Wayne', amount: 45000, status: 'Overdue', date: 'Dec 28, 2025', method: 'Card' },
    { id: 'INV-2026-005', patient: 'Barry Allen', amount: 1200, status: 'Paid', date: 'Jan 06, 2026', method: 'UPI' },
  ]

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Billing Terminal</h1>
          <p className="text-gray-500 text-sm font-medium italic">Revenue tracking and invoice management</p>
        </div>
        <button
          onClick={() => setIsInvoiceModalOpen(true)}
          className="btn-primary flex items-center gap-2 text-xs uppercase tracking-widest px-6 py-2.5"
        >
          <FiPlus size={16} /> New Transaction
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Invoices Generated" count="76" subtitle="Today" icon={FiFileText} color="blue" />
        <StatCard title="Payments Received" count="J$120,000" subtitle="J$1,20,000" icon={FiCheckCircle} color="green" />
        <StatCard title="Pending Dues" count="J$65,000" subtitle="Outstanding" icon={FiClock} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-gray-100 shadow-sm overflow-hidden p-0">
            <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-[#90E0EF]/10">
              <div className="text-[10px] font-black text-[#1D627D] uppercase tracking-widest">Financial Ledger</div>
              <button className="text-[10px] font-black text-[#1d627d] uppercase tracking-widest hover:underline px-2 py-1 rounded border border-blue-200 bg-white">Full Report</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 text-gray-400 uppercase text-[10px] font-black tracking-widest">
                  <tr>
                    <th className="px-6 py-3 border-b border-gray-100">Token</th>
                    <th className="px-6 py-3 border-b border-gray-100">Recipient</th>
                    <th className="px-6 py-3 border-b border-gray-100">Volume</th>
                    <th className="px-6 py-3 border-b border-gray-100">Status</th>
                    <th className="px-6 py-3 border-b border-gray-100 text-center">Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {transactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4 font-black text-[#1d627d] text-xs uppercase">{tx.id}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-800 tracking-tight">{tx.patient}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{tx.date}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-black text-gray-800">J${tx.amount.toLocaleString()}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase italic">{tx.method}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${tx.status === 'Paid' ? 'bg-green-50 text-green-600 border-green-100' : tx.status === 'Overdue' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-yellow-50 text-yellow-600 border-yellow-100'}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => setSelectedTx(tx)} className="btn-icon">
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
          <Card className="card-soft-blue border-none overflow-hidden relative group">
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-2 font-black text-[#1D627D] text-sm uppercase tracking-widest">
                <FiActivity size={16} /> <span>Collection Pipeline</span>
              </div>
              <div className="space-y-6 pt-2">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black text-[#1d627d] uppercase tracking-widest mb-1 opacity-60">Revenue Target</p>
                    <p className="text-xl font-black text-gray-800 tracking-tighter">J$1,50,000</p>
                  </div>
                  <span className="text-[10px] font-black text-green-600 uppercase tracking-widest bg-white/80 px-2 py-0.5 rounded-lg border border-green-100 shadow-sm">75% Achieved</span>
                </div>
                <div className="w-full bg-white/50 rounded-full h-2 p-0.5 shadow-inner">
                  <div className="bg-[#1D627D] h-1 rounded-full shadow-[0_0_10px_rgba(144,224,239,0.5)]" style={{ width: '75%' }}></div>
                </div>
              </div>
              <p className="text-[10px] text-gray-500 font-medium italic leading-relaxed text-center pt-4">Collection metrics are synchronized every 15 minutes with the central billing ledger.</p>
            </div>
          </Card>

          <Card className="border-gray-100 bg-gray-50/20 border-dashed">
            <div className="flex flex-col items-center gap-2 py-6 text-gray-400">
              <FiCheckCircle size={32} className="opacity-20" />
              <p className="text-[10px] font-black uppercase tracking-widest">All claims synchronized</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedTx}
        onClose={() => setSelectedTx(null)}
        title="Transaction Proof"
        size="sm"
        footer={
          <div className="flex gap-2 w-full justify-end">
            <Button variant="secondary" onClick={() => alert('Sending to email...')}>
              <FiMail className="mr-2" /> Email
            </Button>
            <Button variant="primary" onClick={() => printElement()}>
              <FiPrinter className="mr-2" /> Print
            </Button>
          </div>
        }
      >
        {selectedTx && (
          <div className="space-y-6 p-1">
            <div className="card-soft-blue text-center">
              <div className="w-12 h-12 bg-green-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <FiCheck size={24} />
              </div>
              <h4 className="text-xl font-black text-[#1d627d]">{selectedTx.id}</h4>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Confirmed Payment Receipt</p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest self-center">subject identity</span>
                <span className="font-black text-gray-800">{selectedTx.patient}</span>
              </div>
              <div className="flex justify-between text-xl border-t border-gray-100 pt-4">
                <span className="text-[#1D627D] font-black uppercase text-xs tracking-widest self-center">net settle</span>
                <span className="font-black text-[#1D627D]">J${selectedTx.amount.toLocaleString()}</span>
              </div>
              <div className="text-center pt-4 italic text-[10px] text-gray-300 font-bold uppercase tracking-widest">Verified Digital Copy • HS Walters</div>
            </div>
          </div>
        )}
      </Modal>

      {/* New Invoice Modal */}
      <Modal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        title="Generate Billing Token"
        size="md"
        footer={<Button variant="primary" onClick={() => setIsInvoiceModalOpen(false)}>Commit Transaction</Button>}
      >
        <div className="space-y-6 p-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Recipient Identity</label>
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none focus:ring-4 focus:ring-[#90e0ef]/30 text-sm" placeholder="Patient Name / ID" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Payment Channel</label>
              <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm">
                <option>Self Pay (Cash/Card)</option>
                <option>Corporate Insurance</option>
                <option>Government Scheme</option>
              </select>
            </div>
          </div>
          <div className="card-soft-blue border-dashed space-y-4">
            <label className="text-[10px] font-black text-[#1d627d] uppercase tracking-widest mb-2 block">Service breakdown</label>
            {[
              { label: 'General Consultation', price: 'J$1,000' },
              { label: 'Lab Investigation (CBC)', price: 'J$1,500' },
              { label: 'OPD Registration Fee', price: 'J$2,000' },
            ].map((s, idx) => (
              <div key={idx} className="flex justify-between items-center bg-white/80 p-2 rounded-lg border border-blue-50">
                <span className="text-xs font-bold text-gray-600">{s.label}</span>
                <span className="text-xs font-black text-[#1d627d]">{s.price}</span>
              </div>
            ))}
            <div className="pt-4 flex justify-between items-center border-t border-blue-100">
              <span className="font-black text-[10px] uppercase text-[#1d627d] tracking-widest">Cumulative Total</span>
              <span className="text-2xl font-black text-[#1d627d]">J$1,700</span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default BillingDashboard
