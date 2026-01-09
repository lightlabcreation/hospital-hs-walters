import React from 'react'
import Card from '../../components/common/Card'
import {
  FiUsers,
  FiTruck,
  FiPackage,
  FiDollarSign,
  FiTrendingUp,
  FiBarChart2,
} from 'react-icons/fi'

const AdminDashboard = () => {
  const kpiData = [
    {
      title: 'Total Companies',
      value: '24',
      change: '+3',
      trend: 'up',
      icon: FiUsers,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Fleet',
      value: '156',
      change: '+12',
      trend: 'up',
      icon: FiTruck,
      color: 'bg-green-500',
    },
    {
      title: 'Total Bookings',
      value: '1,234',
      change: '+18%',
      trend: 'up',
      icon: FiPackage,
      color: 'bg-purple-500',
    },
    {
      title: 'Revenue',
      value: 'J$125,678',
      change: '+22%',
      trend: 'up',
      icon: FiDollarSign,
      color: 'bg-orange-500',
    },
  ]

  return (
    <div className="space-y-6 " style={{ marginTop: '5.25rem' }}>
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
        <p className="text-gray-600 mt-1">Platform overview and management</p>
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
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Companies</h3>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                    {item}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Company {item}</p>
                    <p className="text-sm text-gray-500">company{item}@example.com</p>
                  </div>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Platform Statistics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Users</span>
              <span className="font-semibold text-gray-800">2,456</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Drivers</span>
              <span className="font-semibold text-gray-800">342</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending Bookings</span>
              <span className="font-semibold text-gray-800">89</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Completed Today</span>
              <span className="font-semibold text-gray-800">156</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboard

