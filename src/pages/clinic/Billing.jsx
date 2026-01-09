import React, { useState, useMemo } from 'react'
import { FiPlus, FiDownload, FiSearch, FiFileText, FiEye, FiCheck, FiPrinter } from 'react-icons/fi'
import Modal from '../../components/common/Modal'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import { printElement, downloadData, generateBaseReport } from '../../utils/helpers'

const Billing = () => {
  // Dummy Data
  const [invoices, setInvoices] = useState([
    { id: 'INV-2026-001', patientId: 'PAT-2026-001', patient: 'John Doe', amount: 5000, status: 'Paid', date: 'Jan 05, 2026', dueDate: 'Jan 15, 2026', method: 'Cash', items: [{ desc: 'Consultation', price: 1000 }, { desc: 'Lab Test', price: 4000 }] },
    { id: 'INV-2026-002', patientId: 'PAT-2026-005', patient: 'Jane Roe', amount: 12500, status: 'Pending', date: 'Jan 06, 2026', dueDate: 'Jan 20, 2026', method: 'Insurance', items: [{ desc: 'MRI Scan', price: 12500 }] },
    { id: 'INV-2026-003', patientId: 'PAT-2026-012', patient: 'Mike Ross', amount: 3500, status: 'Overdue', date: 'Dec 28, 2025', dueDate: 'Jan 04, 2026', method: 'UPI', items: [{ desc: 'X-Ray', price: 2000 }, { desc: 'Emergency', price: 1500 }] },
  ])

  // State Management
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  const [formData, setFormData] = useState({
    patient: '',
    amount: '',
    status: 'Pending',
    method: 'Cash',
    dueDate: '',
    items: ''
  })

  // Filter Logic
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv =>
      inv.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [invoices, searchQuery])

  const handleAdd = () => {
    setFormData({
      patient: '',
      amount: '',
      status: 'Pending',
      method: 'Cash',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      items: ''
    })
    setIsModalOpen(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    setIsModalOpen(false)
    alert('Invoice generated successfully!')
  }

  const handlePrint = () => {
    printElement('Invoice Receipt')
  }

  const handleDownload = (inv) => {
    const report = generateBaseReport([inv], 'Invoice Receipt')
    downloadData(report, `${inv.id}.txt`)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-50 text-green-600 border-green-100'
      case 'Pending': return 'bg-yellow-50 text-yellow-600 border-yellow-100'
      case 'Overdue': return 'bg-red-50 text-red-600 border-red-100'
      default: return 'bg-gray-50 text-gray-500 border-gray-100'
    }
  }

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
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
          <button
            onClick={handleAdd}
            className="btn-primary flex items-center gap-2 text-xs uppercase tracking-widest px-6"
          >
            <FiPlus size={16} /> New Invoice
          </button>
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
                    <div className="font-black text-[#1d627d] text-sm tracking-tight">{inv.id}</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Due: {inv.dueDate}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-800 text-sm">{inv.patient}</div>
                    <div className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">{inv.patientId}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-black text-gray-800 text-base">J${inv.amount.toLocaleString()}</div>
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
            <Button variant="primary" onClick={handleSave}>
              <FiCheck className="mr-2" /> Save Invoice
            </Button>
          </div>
        }
      >
        <form className="space-y-4 p-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Patient Name</label>
              <input type="text" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm" placeholder="Search patient..." />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Payment Method</label>
              <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none text-sm">
                <option>UPI / GPay</option>
                <option>Cash</option>
                <option>Credit Card</option>
                <option>Insurance</option>
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Total Amount (J$)</label>
            <input type="number" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-black text-[#1d627d] text-lg outline-none" placeholder="0.00" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Billing Items</label>
            <textarea rows="3" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none font-medium text-sm" placeholder="List services separated by commas..."></textarea>
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
              downloadData(rpt, `${selectedItem.id}.txt`)
            }}>Download</Button>
            <Button variant="secondary" onClick={() => printElement()}>Print Invoice</Button>
          </div>
        }
      >
        {selectedItem && (
          <div className="space-y-6">
            <div className="card-soft-blue flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-[#1D627D]">{selectedItem.id}</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 italic">Generated on {selectedItem.date}</p>
              </div>
              <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase text-xs border ${getStatusColor(selectedItem.status)}`}>
                {selectedItem.status}
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-bold uppercase tracking-tighter">Subject</span>
                <span className="font-black text-gray-800">{selectedItem.patient}</span>
              </div>
              <div className="flex justify-between text-base border-t border-gray-100 pt-3">
                <span className="text-[#1d627d] font-black uppercase text-xs tracking-widest">Grand Total</span>
                <span className="font-black text-[#1d627d]">J${selectedItem.amount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Billing
