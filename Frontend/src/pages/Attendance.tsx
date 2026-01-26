import { useState } from 'react'
import { CheckCircle, XCircle, Clock, Users } from 'lucide-react'
import { format } from 'date-fns'

const classes = ['S1', 'S2', 'S3', 'S4']
const selectedDate = new Date()

const students = [
  { id: 1, name: 'John Doe', studentId: 'STU001', status: 'present' },
  { id: 2, name: 'Jane Smith', studentId: 'STU002', status: 'present' },
  { id: 3, name: 'Mike Johnson', studentId: 'STU003', status: 'absent' },
  { id: 4, name: 'Sarah Williams', studentId: 'STU004', status: 'present' },
]

export default function Attendance() {
  const [selectedClass, setSelectedClass] = useState('S1')
  const [attendanceDate, setAttendanceDate] = useState(selectedDate)
  const [attendanceStatus, setAttendanceStatus] = useState<Record<number, 'present' | 'absent' | 'late'>>({
    1: 'present',
    2: 'present',
    3: 'absent',
    4: 'present',
  })

  const handleStatusChange = (studentId: number, status: 'present' | 'absent' | 'late') => {
    setAttendanceStatus((prev) => ({ ...prev, [studentId]: status }))
  }

  const presentCount = Object.values(attendanceStatus).filter((s) => s === 'present').length
  const absentCount = Object.values(attendanceStatus).filter((s) => s === 'absent').length
  const lateCount = Object.values(attendanceStatus).filter((s) => s === 'late').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
        <p className="text-gray-600 mt-1">Mark and track student attendance</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Select Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="input-field"
            >
              {classes.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Date</label>
            <input
              type="date"
              value={format(attendanceDate, 'yyyy-MM-dd')}
              onChange={(e) => setAttendanceDate(new Date(e.target.value))}
              className="input-field"
            />
          </div>
          <div className="flex items-end">
            <button className="btn-primary w-full">Load Attendance</button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{students.length}</p>
            </div>
            <Users className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Present</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{presentCount}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Absent</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{absentCount}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Late</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{lateCount}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Attendance List */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Attendance for {selectedClass} - {format(attendanceDate, 'MMMM dd, yyyy')}
          </h2>
          <button className="btn-primary">Save Attendance</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student ID</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{student.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.studentId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        attendanceStatus[student.id] === 'present'
                          ? 'bg-green-100 text-green-800'
                          : attendanceStatus[student.id] === 'late'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {attendanceStatus[student.id]?.toUpperCase() || 'PENDING'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleStatusChange(student.id, 'present')}
                        className={`px-3 py-1 text-xs rounded ${
                          attendanceStatus[student.id] === 'present'
                            ? 'bg-green-600 text-white'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => handleStatusChange(student.id, 'late')}
                        className={`px-3 py-1 text-xs rounded ${
                          attendanceStatus[student.id] === 'late'
                            ? 'bg-orange-600 text-white'
                            : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                        }`}
                      >
                        Late
                      </button>
                      <button
                        onClick={() => handleStatusChange(student.id, 'absent')}
                        className={`px-3 py-1 text-xs rounded ${
                          attendanceStatus[student.id] === 'absent'
                            ? 'bg-red-600 text-white'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        Absent
                      </button>
                    </div>
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

