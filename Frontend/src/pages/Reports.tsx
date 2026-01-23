import { FileText, Download, Calendar, TrendingUp, Users } from 'lucide-react'

const reportTypes = [
  {
    id: 1,
    name: 'Student Attendance Report',
    description: 'Generate attendance reports for individual students or classes',
    icon: Calendar,
    color: 'bg-blue-500',
  },
  {
    id: 2,
    name: 'Academic Performance Report',
    description: 'View grades and academic performance analytics',
    icon: TrendingUp,
    color: 'bg-green-500',
  },
  {
    id: 3,
    name: 'Class Statistics Report',
    description: 'Get detailed statistics for specific classes',
    icon: Users,
    color: 'bg-purple-500',
  },
  {
    id: 4,
    name: 'Teacher Performance Report',
    description: 'Analyze teacher performance and class management',
    icon: FileText,
    color: 'bg-orange-500',
  },
]

const recentReports = [
  { id: 1, name: 'Class 10A Attendance - January 2024', type: 'Attendance', date: '2024-01-20', status: 'Generated' },
  { id: 2, name: 'Student Performance Report - Q4 2023', type: 'Performance', date: '2024-01-15', status: 'Generated' },
  { id: 3, name: 'Monthly Statistics - December 2023', type: 'Statistics', date: '2024-01-01', status: 'Generated' },
]

export default function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600 mt-1">Generate and view various reports</p>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportTypes.map((report) => {
          const Icon = report.icon
          return (
            <div key={report.id} className="card hover:shadow-md transition-shadow duration-200 cursor-pointer">
              <div className={`${report.color} p-3 rounded-lg w-fit mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{report.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{report.description}</p>
              <button className="btn-primary w-full">Generate Report</button>
            </div>
          )
        })}
      </div>

      {/* Recent Reports */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Reports</h2>
          <button className="text-sm text-primary-600 hover:text-primary-700">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Report Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{report.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {report.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="text-primary-600 hover:text-primary-700 flex items-center space-x-1 ml-auto">
                      <Download className="w-4 h-4" />
                      <span className="text-sm">Download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}



