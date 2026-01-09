import React from 'react'
import Card from '../../components/common/Card'
import {
  FiPackage,
  FiFileText,
  FiCreditCard,
  FiCheckCircle,
  FiClock,
  FiMapPin,
} from 'react-icons/fi'

const CustomerDashboard = () => {
  const kpiData = [
    {
      title: 'My Bookings',
      value: '12',
      change: '+2',
      trend: 'up',
      icon: FiPackage,
      color: 'bg-blue-500',
    },
    {
      title: 'Pending Invoices',
      value: '3',
      change: '-1',
      trend: 'down',
      icon: FiFileText,
      color: 'bg-yellow-500',
    },
    {
      title: 'Total Spent',
      value: 'J$8,450',
      change: '+J$450',
      trend: 'up',
      icon: FiCreditCard,
      color: 'bg-purple-500',
    },
    {
      title: 'In Transit',
      value: '2',
      change: '+1',
      trend: 'up',
      icon: FiMapPin,
      color: 'bg-green-500',
    },
  ]

  return (
    <div className="space-y-6 " style={{ marginTop: '5.25rem' }}>
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Customer Dashboard</h2>
        <p className="text-gray-600 mt-1">Track your shipments and manage bookings</p>
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
                    <span className="text-gray-500 text-sm">vs last month</span>
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
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Active Shipments</h3>
          <div className="space-y-3">
            {[1, 2].map((item) => (
              <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FiPackage className="text-primary" size={20} />
                  <div>
                    <p className="font-medium text-gray-800">Booking #{6000 + item}</p>
                    <p className="text-sm text-gray-500">Mumbai → Delhi</p>
                    <p className="text-xs text-gray-400 mt-1">Expected: Today, 6 PM</p>
                  </div>
                </div>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">In Transit</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Invoices</h3>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FiFileText className="text-primary" size={20} />
                  <div>
                    <p className="font-medium text-gray-800">INV-{7000 + item}</p>
                    <p className="text-sm text-gray-500">J${(800 + item * 50).toLocaleString()}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${item % 2 === 0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {item % 2 === 0 ? 'Paid' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default CustomerDashboard

