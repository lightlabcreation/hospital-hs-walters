import React from 'react'
import Card from '../common/Card'

const StatCard = ({ title, count, subtitle, icon: Icon, color = 'blue', onClick }) => {
  // We keep the icon background as #90E0EF based on user rules (sections/active states)
  // But we make them consistent

  return (
    <Card className="flex items-start justify-between h-full bg-white border-gray-100 shadow-sm" hover={!!onClick} onClick={onClick}>
      <div className="space-y-1">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</h3>
        <p className="text-3xl font-black text-gray-800 tracking-tight">{count}</p>
        {subtitle && (
          <span className="text-[10px] font-bold text-[#1d627d] uppercase tracking-widest opacity-60">
            {subtitle}
          </span>
        )}
      </div>
      <div className="w-10 h-10 bg-[#90E0EF]/20 text-[#1d627d] rounded-xl flex items-center justify-center border border-blue-50">
        {Icon && <Icon size={20} />}
      </div>
    </Card>
  )
}

export default StatCard
