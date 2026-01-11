import React, { useState, useEffect } from 'react'
import StatCard from '../../components/dashboard/StatCard'
import Card from '../../components/common/Card'
import Modal from '../../components/common/Modal'
import Button from '../../components/common/Button'
import { FiFileText, FiCheckCircle, FiClock, FiPlus, FiPrinter, FiMail, FiCheck, FiSearch, FiEye, FiActivity } from 'react-icons/fi'
import { printElement } from '../../utils/helpers'
import { billingAPI, patientAPI } from '../../api/services'

const BillingDashboard = () => {
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false)
  const [selectedTx, setSelectedTx] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [transactions, setTransactions] = useState([])
  const [patients, setPatients] = useState([])
  const [stats, setStats] = useState({
    invoicesToday: 0,
    paymentsReceived: 0,
    pendingDues: 0
  })
  const [formData, setFormData] = useState({
    patientId: '',
    amount: '',
    paymentMethod: 'cash',
    items: ''
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [billingRes, patientsRes] = await Promise.all([
        billingAPI.getAll(),
        patientAPI.getAll()
      ])

      const allInvoices = billingRes.data.data || []
      const allPatients = patientsRes.data.data || []

      // Filter today's invoices
      const today = new Date().toISOString().split('T')[0]
      const todayInvoices = allInvoices.filter(inv => {
        const invDate = inv.createdAt?.split('T')[0]
        return invDate === today
      })

      // Calculate payments received (paid invoices this month)
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      const paidThisMonth = allInvoices.filter(inv => {
        const invDate = new Date(inv.createdAt)
        return invDate.getMonth() === currentMonth && invDate.getFullYear() === currentYear && inv.status === 'paid'
      })
      const totalPaid = paidThisMonth.reduce((sum, inv) => sum + (inv.amount || 0), 0)

      // Calculate pending dues
      const pendingInvoices = allInvoices.filter(inv => inv.status === 'pending' || inv.status === 'overdue')
      const totalPending = pendingInvoices.reduce((sum, inv) => sum + (inv.amount || 0), 0)

      setTransactions(allInvoices.slice(-10).reverse())
      setPatients(allPatients)

      setStats({
        invoicesToday: todayInvoices.length,
        paymentsReceived: totalPaid,
        pendingDues: totalPending
      })

    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateInvoice = async () => {
    if (!formData.patientId || !formData.amount) return
    setSaving(true)
    try {
      const dueDate = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
      await billingAPI.create({
        patientId: formData.patientId,
        amount: parseFloat(formData.amount),
        paymentMethod: formData.paymentMethod,
        dueDate,
        items: formData.items,
        status: 'pending'
      })
      await fetchDashboardData()
      setIsInvoiceModalOpen(false)
      setFormData({
        patientId: '',
        amount: '',
        paymentMethod: 'cash',
        items: ''
      })
    } catch (err) {
      console.error('Failed to create invoice:', err)
    } finally {
      setSaving(false)
    }
  }

  const getPatientName = (inv) => {
    // Backend returns patient as a string (full name)
    if (typeof inv.patient === 'string') {
      return inv.patient || 'Unknown'
    }
    if (inv.patient) {
      return inv.patient.name || `${inv.patient.firstName || ''} ${inv.patient.lastName || ''}`.trim() || 'Unknown'
    }
    return 'Unknown'
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-50 text-green-600 border-green-100'
      case 'pending': return 'bg-yellow-50 text-yellow-600 border-yellow-100'
      case 'overdue': return 'bg-red-50 text-red-600 border-red-100'
      default: return 'bg-gray-50 text-gray-500 border-gray-100'
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
        <StatCard title="Invoices Generated" count={stats.invoicesToday.toString()} subtitle="Today" icon={FiFileText} color="blue" />
        <StatCard title="Payments Received" count={`J$${stats.paymentsReceived.toLocaleString()}`} subtitle="This month" icon={FiCheckCircle} color="green" />
        <StatCard title="Pending Dues" count={`J$${stats.pendingDues.toLocaleString()}`} subtitle="Outstanding" icon={FiClock} color="orange" />
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
                  {transactions.length > 0 ? transactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4 font-black text-[#1d627d] text-xs uppercase">INV-{tx.id}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-800 tracking-tight">{getPatientName(tx)}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{formatDate(tx.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-black text-gray-800">J${(tx.amount || 0).toLocaleString()}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase italic">{tx.paymentMethod}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusColor(tx.status)}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => setSelectedTx(tx)} className="btn-icon">
                          <FiEye size={16} />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-10 text-center text-gray-400 text-sm">
                        No transactions found
                      </td>
                    </tr>
                  )}
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
                    <p className="text-[10px] font-black text-[#1d627d] uppercase tracking-widest mb-1 opacity-60">Monthly Target</p>
                    <p className="text-xl font-black text-gray-800 tracking-tighter">J${(stats.paymentsReceived + stats.pendingDues).toLocaleString()}</p>
                  </div>
                  <span className="text-[10px] font-black text-green-600 uppercase tracking-widest bg-white/80 px-2 py-0.5 rounded-lg border border-green-100 shadow-sm">
                    {stats.paymentsReceived + stats.pendingDues > 0 ? Math.round((stats.paymentsReceived / (stats.paymentsReceived + stats.pendingDues)) * 100) : 0}% Collected
                  </span>
                </div>
                <div className="w-full bg-white/50 rounded-full h-2 p-0.5 shadow-inner">
                  <div
                    className="bg-[#1D627D] h-1 rounded-full shadow-[0_0_10px_rgba(144,224,239,0.5)]"
                    style={{ width: `${stats.paymentsReceived + stats.pendingDues > 0 ? Math.round((stats.paymentsReceived / (stats.paymentsReceived + stats.pendingDues)) * 100) : 0}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-[10px] text-gray-500 font-medium italic leading-relaxed text-center pt-4">Collection metrics are synchronized with the central billing ledger.</p>
            </div>
          </Card>

          <Card className="border-gray-100 bg-gray-50/20 border-dashed">
            <div className="flex flex-col items-center gap-2 py-6 text-gray-400">
              <FiCheckCircle size={32} className="opacity-20" />
              <p className="text-[10px] font-black uppercase tracking-widest">System operational</p>
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
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg ${selectedTx.status === 'paid' ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'}`}>
                <FiCheck size={24} />
              </div>
              <h4 className="text-xl font-black text-[#1d627d]">INV-{selectedTx.id}</h4>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{selectedTx.status === 'paid' ? 'Confirmed Payment Receipt' : 'Pending Payment'}</p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest self-center">subject identity</span>
                <span className="font-black text-gray-800">{getPatientName(selectedTx)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest self-center">payment method</span>
                <span className="font-bold text-gray-700 uppercase">{selectedTx.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-xl border-t border-gray-100 pt-4">
                <span className="text-[#1D627D] font-black uppercase text-xs tracking-widest self-center">net settle</span>
                <span className="font-black text-[#1D627D]">J${(selectedTx.amount || 0).toLocaleString()}</span>
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
        footer={
          <Button variant="primary" onClick={handleCreateInvoice} loading={saving}>
            Commit Transaction
          </Button>
        }
      >
        <div className="space-y-6 p-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Recipient Identity</label>
              <select
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm"
                value={formData.patientId}
                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
              >
                <option value="">Select Patient</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name || `${p.firstName || ''} ${p.lastName || ''}`.trim()}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Payment Channel</label>
              <select
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm"
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              >
                <option value="cash">Cash</option>
                <option value="card">Credit Card</option>
                <option value="insurance">Insurance</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Total Amount (J$)</label>
            <input
              type="number"
              className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-black text-[#1d627d] text-lg outline-none"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Service Description</label>
            <textarea
              rows="3"
              className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-medium outline-none text-sm"
              placeholder="List services..."
              value={formData.items}
              onChange={(e) => setFormData({ ...formData, items: e.target.value })}
            ></textarea>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default BillingDashboard
