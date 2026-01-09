import React from 'react'
import Card from '../../components/common/Card'
import {
  FiPackage,
  FiUsers,
  FiMapPin,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
} from 'react-icons/fi'

const DispatcherDashboard = () => {
  const kpiData = [
    {
      title: 'Assigned Jobs',
      value: '23',
      change: '+5',
      trend: 'up',
      icon: FiPackage,
      color: 'bg-blue-500',
    },
    {
      title: 'Available Drivers',
      value: '12',
      change: '+2',
      trend: 'up',
      icon: FiUsers,
      color: 'bg-green-500',
    },
    {
      title: 'In Progress',
      value: '18',
      change: '+3',
      trend: 'up',
      icon: FiClock,
      color: 'bg-yellow-500',
    },
    {
      title: 'Completed Today',
      value: '15',
      change: '+4',
      trend: 'up',
      icon: FiCheckCircle,
      color: 'bg-purple-500',
    },
  ]

  return (
    <div className="space-y-6" style={{ marginTop: '5.25rem' }}>
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Dispatcher Dashboard</h2>
        <p className="text-gray-600 mt-1">Manage job assignments and driver coordination</p>
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
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Jobs Requiring Assignment</h3>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FiPackage className="text-primary" size={20} />
                  <div>
                    <p className="font-medium text-gray-800">Job #{4000 + item}</p>
                    <p className="text-sm text-gray-500">Pune → Bangalore</p>
                  </div>
                </div>
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Unassigned</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Drivers</h3>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FiUsers className="text-green-500" size={20} />
                  <div>
                    <p className="font-medium text-gray-800">Driver {item}</p>
                    <p className="text-sm text-gray-500">Vehicle: MH-{12 + item} AB {1000 + item}</p>
                  </div>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Available</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default DispatcherDashboard

