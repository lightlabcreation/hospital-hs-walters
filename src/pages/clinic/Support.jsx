import React, { useState, useMemo } from 'react'
import { FiMail, FiPhone, FiMessageCircle, FiSearch, FiFileText, FiChevronDown, FiX, FiSend } from 'react-icons/fi'
import Modal from '../../components/common/Modal'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'

const Support = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [openFaq, setOpenFaq] = useState(0)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)

  const [chatMessages, setChatMessages] = useState([
    { role: 'bot', text: 'Hello! Welcome to HS Walters Support. How can I assist you today?' }
  ])
  const [currentMsg, setCurrentMsg] = useState('')

  const allFaqs = [
    { q: 'How do I add a new staff member?', a: 'Navigate to the "Personnel Directory" panel from the sidebar, and click "Add Member".' },
    { q: 'Can I export billing reports to Excel?', a: 'Yes. In the Billing section, use the "Export" icon button in the header.' },
    { q: 'How to reset a patient password?', a: 'Go to the Patient Records, click "Edit" on the target record and find the Reset section.' },
  ]

  const filteredFaqs = useMemo(() => {
    return allFaqs.filter(faq =>
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  const handleSendChat = (e) => {
    e.preventDefault()
    if (!currentMsg.trim()) return
    const newMsgs = [...chatMessages, { role: 'user', text: currentMsg }]
    setChatMessages(newMsgs)
    setCurrentMsg('')

    setTimeout(() => {
      setChatMessages(prev => [...prev, { role: 'bot', text: 'Our team has been notified.' }])
    }, 1000)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-24 px-4 overflow-hidden">
      {/* Header */}
      <div className="text-center space-y-4 pt-10">
        <h1 className="text-4xl font-black text-gray-800 tracking-tighter">Help Ecosystem</h1>
        <p className="text-gray-500 max-w-lg mx-auto font-medium text-sm italic">Knowledge base and direct support channels for HS Walters EMR.</p>
        <div className="relative max-w-xl mx-auto group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1d627d] transition-colors" />
          <input
            type="text"
            placeholder="Search documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-8 focus:ring-[#90e0ef]/20 focus:border-[#00b4d8] transition-all font-bold text-sm"
          />
        </div>
      </div>

      {/* Connection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: FiMail, title: 'Email Assistance', sub: '< 24h Response', action: 'support@hswalters.com', onClick: () => setIsEmailModalOpen(true) },
          { icon: FiPhone, title: 'Urgent Hotline', sub: '24/7 Availability', action: '+91 (800) 900-111' },
          { icon: FiMessageCircle, title: 'Direct Chat', sub: 'Live Support', action: 'Instant Connection', onClick: () => setIsChatOpen(true) },
        ].map((card, idx) => (
          <Card key={idx} className="text-center group hover:border-[#90e0ef] transition-colors cursor-pointer" onClick={card.onClick}>
            <div className="w-12 h-12 bg-[#90E0EF]/10 text-[#1d627d] rounded-xl flex items-center justify-center mx-auto mb-4 border border-blue-50">
              <card.icon size={24} />
            </div>
            <h3 className="font-black text-gray-800 text-sm">{card.title}</h3>
            <p className="text-[10px] font-black text-[#90E0EF] uppercase tracking-widest mt-1">{card.sub}</p>
            <p className="text-[10px] text-gray-400 font-bold mt-2 italic">{card.action}</p>
          </Card>
        ))}
      </div>

      {/* FAQ */}
      <Card className="p-0 overflow-hidden border-gray-100">
        <div className="p-6 border-b border-gray-50 bg-[#90E0EF]/10 flex items-center gap-3">
          <FiFileText className="text-[#1D627D]" size={20} />
          <h2 className="text-sm font-black text-[#1D627D] uppercase tracking-widest">Knowledge Base</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {filteredFaqs.map((faq, i) => (
            <div key={i} className="group">
              <button
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                className="w-full text-left p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-bold text-gray-700 text-sm">{faq.q}</span>
                <FiChevronDown className={`text-gray-300 transition-transform ${openFaq === i ? 'rotate-180 text-[#90e0ef]' : ''}`} />
              </button>
              {openFaq === i && (
                <div className="px-6 pb-6 animate-in slide-in-from-top-2">
                  <p className="text-xs text-gray-500 font-medium leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Chat Simulation */}
      {isChatOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-[450px] bg-white rounded-2xl shadow-2xl border border-[#90e0ef]/30 flex flex-col overflow-hidden z-[200] animate-in slide-in-from-bottom-5">
          <div className="bg-[#1D627D] p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest">Support Core</span>
            </div>
            <button onClick={() => setIsChatOpen(false)}><FiX size={20} /></button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
            {chatMessages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-xl text-xs font-medium shadow-sm ${m.role === 'user' ? 'bg-[#90e0ef] text-[#1d627d]' : 'bg-white text-gray-600 border border-gray-100'}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendChat} className="p-2 bg-white border-t border-gray-100 flex gap-2">
            <input type="text" value={currentMsg} onChange={e => setCurrentMsg(e.target.value)} className="flex-1 bg-gray-100 rounded-lg px-3 py-2 text-xs font-bold outline-none" placeholder="Reply..." />
            <button type="submit" className="p-2 bg-[#90e0ef] text-[#1d627d] rounded-lg shadow-sm"><FiSend /></button>
          </form>
        </div>
      )}

      {/* Email Ticket */}
      <Modal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        title="Open Ticket"
        size="sm"
        footer={<Button variant="primary" onClick={() => setIsEmailModalOpen(false)}>Submit</Button>}
      >
        <div className="space-y-4 p-1">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Classification</label>
            <select className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl font-bold text-xs outline-none">
              <option>Technical Bug</option><option>Billing Question</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Narrative</label>
            <textarea rows="3" className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl font-medium text-xs outline-none" placeholder="Describe the issue..."></textarea>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Support
