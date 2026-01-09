import React from 'react'
import Card from '../../components/common/Card'
import {
  FiPackage,
  FiDollarSign,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiClipboard,
} from 'react-icons/fi'

const DriverDashboard = () => {
  const kpiData = [
    {
      title: 'Active Jobs',
      value: '3',
      change: '+1',
      trend: 'up',
      icon: FiPackage,
      color: 'bg-blue-500',
    },
    {
      title: 'Completed Today',
      value: '2',
      change: '+2',
      trend: 'up',
      icon: FiCheckCircle,
      color: 'bg-green-500',
    },
    {
      title: 'Total Earnings',
      value: 'J$1,245',
      change: '+J$120',
      trend: 'up',
      icon: FiDollarSign,
      color: 'bg-purple-500',
    },
    {
      title: 'Pending POD',
      value: '1',
      change: '-1',
      trend: 'down',
      icon: FiClipboard,
      color: 'bg-yellow-500',
    },
  ]

  return (
    <div className="space-y-6" style={{ marginTop: '5.25rem' }}>
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Driver Dashboard</h2>
        <p className="text-gray-600 mt-1">Your jobs, earnings, and delivery status</p>
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
          <h3 className="text-lg font-semibold text-gray-800 mb-4">My Active Jobs</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FiPackage className="text-primary" size={20} />
                  <div>
                    <p className="font-medium text-gray-800">Job #{5000 + item}</p>
                    <p className="text-sm text-gray-500">Mumbai → Delhi</p>
                    <p className="text-xs text-gray-400 mt-1">ETA: {item + 2} hours</p>
                  </div>
                </div>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">In Transit</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Earnings Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Today's Earnings</span>
              <span className="font-semibold text-green-600">J$245</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">This Week</span>
              <span className="font-semibold text-gray-800">J$1,245</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">This Month</span>
              <span className="font-semibold text-gray-800">J$4,890</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending Payout</span>
              <span className="font-semibold text-yellow-600">J$890</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default DriverDashboard

