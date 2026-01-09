import React from 'react'

const Button = ({
  children,
  variant = 'primary',
  onClick,
  disabled = false,
  loading = false,
  className = '',
  type = 'button',
  ...props
}) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'

  const variantClasses = {
    primary: 'bg-[#90e0ef] text-[#1d627d] border border-[#00b4d8]/20 shadow-sm hover:shadow-md hover:bg-[#bde0fe] hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm transition-all duration-200 font-black uppercase tracking-wider text-xs',
    secondary: 'bg-[#90e0ef] text-[#1d627d] border border-blue-200 shadow-sm hover:shadow-md hover:bg-[#bde0fe] hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm transition-all duration-200 font-black uppercase tracking-wider text-xs',
    danger: 'bg-red-500 text-white shadow-md hover:shadow-lg hover:bg-red-600 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm transition-all duration-200 font-black uppercase tracking-wider text-xs',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  )
}

export default Button

