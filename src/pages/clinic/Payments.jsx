import React from 'react'
import { FiDollarSign, FiSearch, FiCheckCircle, FiPlus } from 'react-icons/fi'
import Card from '../../components/common/Card'
import StatCard from '../../components/dashboard/StatCard'

const Payments = () => {
  const transactions = [
    { id: 'TXN-101', patient: 'John Doe', amount: '$150.00', date: '2023-10-25', status: 'Paid' },
    { id: 'TXN-102', patient: 'Sarah K.', amount: '$2,400.00', date: '2023-10-24', status: 'Pending' },
    { id: 'TXN-103', patient: 'Robert B.', amount: '$75.00', date: '2023-10-24', status: 'Paid' },
  ]

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Financial Hub</h1>
          <p className="text-gray-500 text-sm font-medium italic">Managed transactions and receivables tracker</p>
        </div>
        <button
          className="btn-primary flex items-center gap-2 text-xs uppercase tracking-widest px-6"
        >
          <FiPlus size={16} /> Record Pay
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard title="Daily Revenue" count="$1,240.00" subtitle="Authorized today" icon={FiDollarSign} color="blue" />
        <StatCard title="Pending Claims" count="12" subtitle="Awaiting clearing" icon={FiCheckCircle} color="blue" />
      </div>

      {/* Table */}
      <Card className="overflow-hidden p-0 border-gray-100 shadow-sm">
        <div className="p-4 border-b border-gray-50 bg-[#90E0EF]/10">
          <h3 className="text-[10px] font-black text-[#1D627D] uppercase tracking-widest">Recent Ledger</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-black tracking-widest">
              <tr>
                <th className="px-6 py-4 border-b">Token ID</th>
                <th className="px-6 py-4 border-b">Member Identity</th>
                <th className="px-6 py-4 border-b">Value</th>
                <th className="px-6 py-4 border-b text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 font-black text-[#1d627d]">{t.id}</td>
                  <td className="px-6 py-4 font-bold text-gray-800">{t.patient}</td>
                  <td className="px-6 py-4 font-black text-gray-700">{t.amount}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${t.status === 'Paid' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default Payments
