import React from 'react'
import { FiX } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}) => {
  const { role } = useAuth()

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-[400px]',
    md: 'max-w-[500px]',
    lg: 'max-w-[600px]',
    xl: 'max-w-[800px]',
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Content */}
      <div
        className={`relative h-full bg-white shadow-2xl ${sizeClasses[size]} w-full animate-slide-in-right flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b bg-white sticky top-0 z-10">
          <div className="flex flex-col">
            <h3 className="text-lg font-black text-gray-800 tracking-tight">{title}</h3>
            {role && (
              <span className="text-[10px] font-black text-[#1d627d] uppercase tracking-widest bg-[#90e0ef]/20 w-fit px-2 py-0.5 rounded-md mt-1">
                Role: {role.replace('_', ' ')}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
            aria-label="Close"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-4 sm:p-5 border-t bg-gray-50 flex items-center justify-end gap-3 sticky bottom-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export default Modal
