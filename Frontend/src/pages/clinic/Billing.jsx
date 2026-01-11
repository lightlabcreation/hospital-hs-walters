import React, { useState, useMemo, useEffect } from 'react'
import { FiPlus, FiDownload, FiSearch, FiFileText, FiEye, FiCheck, FiPrinter } from 'react-icons/fi'
import Modal from '../../components/common/Modal'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import { printElement, downloadData, generateBaseReport } from '../../utils/helpers'
import { billingAPI, patientAPI } from '../../api/services'
import { useAuth } from '../../context/AuthContext'

const Billing = () => {
  const { role } = useAuth()

  // Role-based permissions
  const canCreate = ['super_admin', 'billing_staff', 'receptionist'].includes(role)
  const canEdit = ['super_admin', 'billing_staff'].includes(role)

  // State
  const [invoices, setInvoices] = useState([])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  // State Management
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  const [formData, setFormData] = useState({
    patientId: '',
    amount: '',
    status: 'pending',
    paymentMethod: 'cash',
    dueDate: '',
    items: ''
  })

  // Fetch data on mount
  useEffect(() => {
    fetchInvoices()
    fetchPatients()
  }, [])

  const fetchInvoices = async () => {
    try {
      setLoading(true)
      const response = await billingAPI.getAll()
      setInvoices(response.data.data || [])
    } catch (err) {
      setError('Failed to load invoices')
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
  const getPatientName = (inv) => {
    if (!inv.patient && !inv.patientId) return 'Unknown';
    if (typeof inv.patient === 'string') return inv.patient;
    if (inv.patient?.name) return inv.patient.name;
    return inv.patient?.firstName ? `${inv.patient.firstName} ${inv.patient.lastName || ''}`.trim() : inv.patientId;
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
  }

  // Filter Logic
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const patientName = getPatientName(inv).toLowerCase()
      const query = searchQuery.toLowerCase()
      return patientName.includes(query) || String(inv.invoiceId || inv.id).toLowerCase().includes(query)
    })
  }, [invoices, searchQuery])

  const handleAdd = () => {
    if (!canCreate) return
    const dueDate = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
    setFormData({
      patientId: '',
      amount: '',
      status: 'pending',
      paymentMethod: 'cash',
      dueDate: dueDate,
      items: ''
    })
    setIsModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await billingAPI.create({
        ...formData,
        amount: parseFloat(formData.amount) || 0
      })
      await fetchInvoices()
      setIsModalOpen(false)
    } catch (err) {
      console.error('Save failed:', err)
      setError(err.response?.data?.message || 'Failed to save invoice')
    } finally {
      setSaving(false)
    }
  }

  const handlePrint = () => {
    printElement('Invoice Receipt')
  }

  const handleDownload = (inv) => {
    const report = generateBaseReport([inv], 'Invoice Receipt')
    downloadData(report, `INV-${inv.id}.txt`)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-50 text-green-600 border-green-100'
      case 'pending': return 'bg-yellow-50 text-yellow-600 border-yellow-100'
      case 'overdue': return 'bg-red-50 text-red-600 border-red-100'
      case 'cancelled': return 'bg-gray-50 text-gray-500 border-gray-100'
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
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
          <button onClick={() => setError('')} className="ml-4 text-red-400 hover:text-red-600">Dismiss</button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Billing & Invoices</h1>
          <p className="text-gray-500 text-sm">Financial records and payment tracking system</p>
        </div>
        <div className="flex w-full sm:w-auto gap-3">
          <div className="relative flex-1 sm:w-64 group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1d627d] transition-colors" />
            <input
              type="text"
              placeholder="Search invoice..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-4 focus:ring-[#90e0ef]/30 font-medium text-sm transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {canCreate && (
            <button
              onClick={handleAdd}
              className="btn-primary flex items-center gap-2 text-xs uppercase tracking-widest px-6"
            >
              <FiPlus size={16} /> New Invoice
            </button>
          )}
        </div>
      </div>

      {/* Table Section */}
      <Card className="overflow-hidden p-0 border-gray-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#90E0EF]/10 text-[#1D627D] uppercase text-[10px] font-black tracking-widest">
              <tr>
                <th className="px-6 py-4 border-b">Invoice ID</th>
                <th className="px-6 py-4 border-b">Patient</th>
                <th className="px-6 py-4 border-b">Amount</th>
                <th className="px-6 py-4 border-b">Status</th>
                <th className="px-6 py-4 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-black text-[#1d627d] text-sm tracking-tight">{inv.invoiceId || `INV-${inv.id}`}</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Due: {formatDate(inv.dueDate)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-800 text-sm">{getPatientName(inv)}</div>
                    <div className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">PAT-{inv.patientId}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-black text-gray-800 text-base">J${(inv.amount || 0).toLocaleString()}</div>
                    <div className="text-[10px] text-gray-400 uppercase font-black italic">{inv.paymentMethod}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusColor(inv.status)}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => { setSelectedItem(inv); setIsViewOpen(true); }}
                        className="btn-icon h-8 w-8 flex items-center justify-center"
                        title="View Invoice"
                      >
                        <FiEye size={16} />
                      </button>
                      <button
                        className="btn-icon h-8 w-8 flex items-center justify-center"
                        title="Print Receipt"
                        onClick={handlePrint}
                      >
                        <FiPrinter size={16} />
                      </button>
                      <button
                        className="btn-icon h-8 w-8 flex items-center justify-center"
                        title="Download PDF"
                        onClick={() => handleDownload(inv)}
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

      {/* New Invoice Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Generate Invoice"
        size="md"
        footer={
          <div className="flex gap-2 w-full justify-end">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Discard</Button>
            <Button variant="primary" onClick={handleSave} loading={saving}>
              <FiCheck className="mr-2" /> Save Invoice
            </Button>
          </div>
        }
      >
        <form className="space-y-4 p-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Patient</label>
              <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm" value={formData.patientId} onChange={(e) => setFormData({ ...formData, patientId: e.target.value })} >
                <option value="">Select Patient</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Payment Method</label>
              <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm" value={formData.paymentMethod} onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}>
                <option value="cash">Cash</option>
                <option value="card">Credit Card</option>
                <option value="insurance">Insurance</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Total Amount (J$)</label>
              <input type="number" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-black text-[#1d627d] text-lg outline-none" placeholder="0.00" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Due Date</label>
              <input type="date" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Billing Items</label>
            <textarea rows="3" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none font-medium text-sm" placeholder="List services separated by commas..." value={formData.items} onChange={(e) => setFormData({ ...formData, items: e.target.value })}></textarea>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Invoice Summary"
        size="sm"
        footer={
          <div className="flex gap-2 w-full justify-end">
            <Button variant="secondary" onClick={() => setIsViewOpen(false)}>Dismiss</Button>
            <Button variant="primary" onClick={() => {
              const rpt = generateBaseReport([selectedItem], 'Invoice Summary')
              downloadData(rpt, `INV-${selectedItem.id}.txt`)
            }}>Download</Button>
            <Button variant="secondary" onClick={() => printElement()}>Print Invoice</Button>
          </div>
        }
      >
        {selectedItem && (
          <div className="space-y-6">
            <div className="card-soft-blue flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-[#1D627D]">{selectedItem.invoiceId || `INV-${selectedItem.id}`}</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 italic">Generated on {formatDate(selectedItem.createdAt)}</p>
              </div>
              <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase text-xs border ${getStatusColor(selectedItem.status)}`}>
                {selectedItem.status}
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-bold uppercase tracking-tighter">Subject</span>
                <span className="font-black text-gray-800">{getPatientName(selectedItem)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-bold uppercase tracking-tighter">Payment Method</span>
                <span className="font-bold text-gray-700 uppercase">{selectedItem.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-bold uppercase tracking-tighter">Due Date</span>
                <span className="font-bold text-gray-700">{formatDate(selectedItem.dueDate)}</span>
              </div>
              <div className="flex justify-between text-base border-t border-gray-100 pt-3">
                <span className="text-[#1d627d] font-black uppercase text-xs tracking-widest">Grand Total</span>
                <span className="font-black text-[#1d627d]">J${(selectedItem.amount || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Billing
