import React from 'react'

const Card = ({ children, className = '', onClick, hover = false }) => {
  const baseClasses = 'bg-white rounded-xl shadow-sm border border-gray-100 p-6'
  const hoverClasses = hover ? 'hover:shadow-md transition-shadow duration-200 cursor-pointer' : ''

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export default Card

