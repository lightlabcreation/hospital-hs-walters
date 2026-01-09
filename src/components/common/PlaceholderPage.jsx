import React from 'react'
import { useAuth } from '../../context/AuthContext'

const PlaceholderPage = ({ title }) => {
  const { role } = useAuth()

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 min-h-[500px]">
      <div className="mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <p className="text-gray-500 mt-1">Role: <span className="capitalize font-medium text-blue-600">{role?.replace('_', ' ')}</span></p>
      </div>

      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <div className="text-6xl mb-4">🚧</div>
        <h2 className="text-xl font-semibold">Under Construction</h2>
        <p className="mt-2">This page is being built for the {title} module.</p>
      </div>
    </div>
  )
}

export default PlaceholderPage
