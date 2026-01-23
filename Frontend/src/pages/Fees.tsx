import { useState } from 'react'
import { DollarSign, Receipt, FileText, Plus, Search, CheckCircle, Users } from 'lucide-react'

const feeStructure = [
  {
    id: 1,
    class: 'S1',
    termFee: 50000,
    boardingFee: 30000,
    dayFee: 0,
    activitiesFee: 5000,
    totalBoarding: 85000,
    totalDay: 55000,
  },
  {
    id: 2,
    class: 'S2',
    termFee: 50000,
    boardingFee: 30000,
    dayFee: 0,
    activitiesFee: 5000,
    totalBoarding: 85000,
    totalDay: 55000,
  },
]

const payments = [
  {
    id: 1,
    studentName: 'John Doe',
    studentId: 'STU001',
    class: 'S1',
    term: 'First Term',
    amount: 55000,
    paid: 30000,
    balance: 25000,
    status: 'Partial',
    paymentDate: '2024-01-15',
  },
  {
    id: 2,
    studentName: 'Jane Smith',
    studentId: 'STU002',
    class: 'S1',
    term: 'First Term',
    amount: 55000,
    paid: 55000,
    balance: 0,
    status: 'Paid',
    paymentDate: '2024-01-10',
  },
  {
    id: 3,
    studentName: 'Mike Johnson',
    studentId: 'STU003',
    class: 'S2',
    term: 'First Term',
    amount: 55000,
    paid: 55000,
    balance: 0,
    status: 'Paid',
    paymentDate: '2024-01-12',
  },
  {
    id: 4,
    studentName: 'Sarah Williams',
    studentId: 'STU004',
    class: 'S3',
    term: 'First Term',
    amount: 60000,
    paid: 60000,
    balance: 0,
    status: 'Paid',
    paymentDate: '2024-01-08',
  },
  {
    id: 5,
    studentName: 'David Brown',
    studentId: 'STU005',
    class: 'S1',
    term: 'First Term',
    amount: 55000,
    paid: 20000,
    balance: 35000,
    status: 'Partial',
    paymentDate: '2024-01-20',
  },
  {
    id: 6,
    studentName: 'Emily Davis',
    studentId: 'STU006',
    class: 'S2',
    term: 'First Term',
    amount: 55000,
    paid: 55000,
    balance: 0,
    status: 'Paid',
    paymentDate: '2024-01-05',
  },
  {
    id: 7,
    studentName: 'Robert Wilson',
    studentId: 'STU007',
    class: 'S3',
    term: 'First Term',
    amount: 60000,
    paid: 60000,
    balance: 0,
    status: 'Paid',
    paymentDate: '2024-01-14',
  },
]

export default function Fees() {
  const [activeTab, setActiveTab] = useState<'structure' | 'payments' | 'receipts' | 'reports'>('payments')
  const [searchTerm, setSearchTerm] = useState('')
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'paid' | 'partial' | 'unpaid'>('paid')

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter =
      paymentFilter === 'all' ||
      (paymentFilter === 'paid' && payment.status === 'Paid') ||
      (paymentFilter === 'partial' && payment.status === 'Partial') ||
      (paymentFilter === 'unpaid' && payment.balance === payment.amount)
    
    return matchesSearch && matchesFilter
  })

  const paidCount = payments.filter((p) => p.status === 'Paid').length
  const partialCount = payments.filter((p) => p.status === 'Partial').length
  const unpaidCount = payments.filter((p) => p.balance === p.amount).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fees & Finance</h1>
          <p className="text-gray-600 mt-1">Manage fee structure and payments</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Record Payment</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'structure', label: 'Fee Structure', icon: DollarSign },
            { id: 'payments', label: 'Payments', icon: Receipt },
            { id: 'receipts', label: 'Receipts', icon: FileText },
            { id: 'reports', label: 'Reports', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'structure' && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Fee Structure</h2>
            <button className="btn-primary flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Fee Structure</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Term Fee</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Boarding Fee</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Day Fee</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Activities</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total (Boarding)</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total (Day)</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {feeStructure.map((fee) => (
                  <tr key={fee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {fee.class}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">₦{fee.termFee.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">₦{fee.boardingFee.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">₦{fee.dayFee.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">₦{fee.activitiesFee.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      ₦{fee.totalBoarding.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      ₦{fee.totalDay.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button className="text-primary-600 hover:text-primary-700">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="space-y-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{payments.length}</p>
                </div>
                <Users className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Fully Paid</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{paidCount}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Partial Payment</p>
                  <p className="text-2xl font-bold text-yellow-600 mt-1">{partialCount}</p>
                </div>
                <DollarSign className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Unpaid</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">{unpaidCount}</p>
                </div>
                <Receipt className="w-8 h-8 text-red-500" />
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="card">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by student name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
              <div>
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value as any)}
                  className="input-field"
                >
                  <option value="all">All Payments</option>
                  <option value="paid">Fully Paid</option>
                  <option value="partial">Partial Payment</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {paymentFilter === 'paid' ? 'Students Who Have Paid' : 
                 paymentFilter === 'partial' ? 'Students with Partial Payment' :
                 paymentFilter === 'unpaid' ? 'Students with Unpaid Fees' :
                 'All Payment Records'}
              </h2>
              <div className="text-sm text-gray-500">
                Showing {filteredPayments.length} of {payments.length} students
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Term</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount Due</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount Paid</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Balance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments.length > 0 ? (
                    filteredPayments.map((payment) => (
                      <tr
                        key={payment.id}
                        className={`hover:bg-gray-50 ${
                          payment.status === 'Paid' ? 'bg-green-50/30' : ''
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {payment.status === 'Paid' && (
                              <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">{payment.studentName}</div>
                              <div className="text-sm text-gray-500">{payment.studentId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {payment.class}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.term}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">₦{payment.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-green-600">
                          ₦{payment.paid.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-red-600">
                          ₦{payment.balance.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              payment.status === 'Paid'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payment.paymentDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <button className="text-primary-600 hover:text-primary-700">View</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                        <CheckCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                        <p>No students found matching the selected filter</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'receipts' && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Receipts</h2>
          <div className="text-center py-12 text-gray-500">
            <Receipt className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p>Receipt generation feature will be implemented here</p>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Fee Collection Report</h3>
            <p className="text-sm text-gray-600 mb-4">Generate reports on fee collections</p>
            <button className="btn-primary w-full">Generate Report</button>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Students with Arrears</h3>
            <p className="text-sm text-gray-600 mb-4">View students with outstanding balances</p>
            <button className="btn-primary w-full">View Report</button>
          </div>
        </div>
      )}
    </div>
  )
}

