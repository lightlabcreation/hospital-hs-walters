import React from 'react'
import Card from '../../components/common/Card'
import {
  FiPackage,
  FiTruck,
  FiUsers,
  FiMapPin,
  FiClock,
  FiCheckCircle,
} from 'react-icons/fi'

const OperationsDashboard = () => {
  const kpiData = [
    {
      title: 'Active Bookings',
      value: '89',
      change: '+12',
      trend: 'up',
      icon: FiPackage,
      color: 'bg-blue-500',
    },
    {
      title: 'In Transit',
      value: '45',
      change: '+5',
      trend: 'up',
      icon: FiTruck,
      color: 'bg-yellow-500',
    },
    {
      title: 'Available Drivers',
      value: '23',
      change: '-2',
      trend: 'down',
      icon: FiUsers,
      color: 'bg-green-500',
    },
    {
      title: 'On-Time Delivery',
      value: '94%',
      change: '+2%',
      trend: 'up',
      icon: FiCheckCircle,
      color: 'bg-purple-500',
    },
  ]

  return (
    <div className="space-y-6" style={{ marginTop: '5.25rem' }}>
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Operations Dashboard</h2>
        <p className="text-gray-600 mt-1">Manage bookings, dispatch, and fleet operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon
          return (
            <Card key={index} hover={false}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-gray-600 text-sm font-medium">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-2">{kpi.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <span className={`text-sm font-medium ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {kpi.change}
                    </span>
                    <span className="text-gray-500 text-sm">vs yesterday</span>
                  </div>
                </div>
                <div className={`${kpi.color} p-3 rounded-lg text-white`}>
                  <Icon size={24} />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Pending Assignments</h3>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FiPackage className="text-primary" size={20} />
                  <div>
                    <p className="font-medium text-gray-800">Booking #{1000 + item}</p>
                    <p className="text-sm text-gray-500">Mumbai → Delhi</p>
                  </div>
                </div>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Pending</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Active Shipments</h3>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FiTruck className="text-green-500" size={20} />
                  <div>
                    <p className="font-medium text-gray-800">Shipment #{2000 + item}</p>
                    <p className="text-sm text-gray-500">Driver: Driver {item}</p>
                  </div>
                </div>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">In Transit</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default OperationsDashboard

