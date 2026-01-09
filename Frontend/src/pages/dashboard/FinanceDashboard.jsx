import React from 'react'
import Card from '../../components/common/Card'
import {
  FiDollarSign,
  FiFileText,
  FiCreditCard,
  FiTrendingUp,
  FiCheckCircle,
  FiClock,
} from 'react-icons/fi'

const FinanceDashboard = () => {
  const kpiData = [
    {
      title: 'Total Revenue',
      value: 'J$245,678',
      change: '+18%',
      trend: 'up',
      icon: FiDollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Pending Invoices',
      value: '34',
      change: '-5',
      trend: 'down',
      icon: FiFileText,
      color: 'bg-yellow-500',
    },
    {
      title: 'Outstanding',
      value: 'J$45,230',
      change: '-12%',
      trend: 'down',
      icon: FiCreditCard,
      color: 'bg-red-500',
    },
    {
      title: 'Driver Payouts',
      value: 'J$12,450',
      change: '+8%',
      trend: 'up',
      icon: FiTrendingUp,
      color: 'bg-blue-500',
    },
  ]

  return (
    <div className="space-y-6" style={{ marginTop: '5.25rem' }}>
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Finance Dashboard</h2>
        <p className="text-gray-600 mt-1">Financial overview and payment management</p>
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
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Invoices</h3>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FiFileText className="text-primary" size={20} />
                  <div>
                    <p className="font-medium text-gray-800">INV-{3000 + item}</p>
                    <p className="text-sm text-gray-500">J${(5000 + item * 100).toLocaleString()}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${item % 2 === 0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {item % 2 === 0 ? 'Paid' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Paid This Month</span>
              <span className="font-semibold text-green-600">J$198,450</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending Payments</span>
              <span className="font-semibold text-yellow-600">J$45,230</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Overdue</span>
              <span className="font-semibold text-red-600">J$12,340</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Driver Payouts Due</span>
              <span className="font-semibold text-blue-600">J$12,450</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default FinanceDashboard

