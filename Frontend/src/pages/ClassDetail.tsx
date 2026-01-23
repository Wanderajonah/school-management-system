import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Users, GraduationCap, Calendar, MapPin } from 'lucide-react'

// Mock data
const classData = {
  id: 1,
  name: 'S1',
  subject: 'Mathematics',
  teacher: 'Dr. Sarah Johnson',
  teacherId: 'TCH001',
  students: 28,
  schedule: 'Mon, Wed, Fri - 9:00 AM',
  room: 'Room 101',
  capacity: 30,
}

const students = [
  { id: 1, name: 'John Doe', studentId: 'STU001', attendance: '95%' },
  { id: 2, name: 'Jane Smith', studentId: 'STU002', attendance: '98%' },
  { id: 3, name: 'Mike Johnson', studentId: 'STU003', attendance: '92%' },
]

export default function ClassDetail() {
  const { id } = useParams()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/classes" className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Classes
        </Link>
      </div>

      {/* Class Header */}
      <div className="card">
        <div className="flex items-start space-x-6">
          <div className="w-24 h-24 bg-purple-100 rounded-lg flex items-center justify-center">
            <span className="text-4xl font-bold text-purple-600">{classData.name}</span>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{classData.name} - {classData.subject}</h1>
            <p className="text-gray-600 mt-1">Class Information</p>
            <div className="flex items-center space-x-4 mt-4">
              <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                {classData.students} Students
              </span>
              <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                {Math.round((classData.students / classData.capacity) * 100)}% Capacity
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Class Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Class Details</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">Subject</p>
              <p className="text-gray-900 mt-1 font-medium">{classData.subject}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Room</p>
              <p className="text-gray-900 mt-1 font-medium">{classData.room}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Schedule</p>
              <p className="text-gray-900 mt-1 font-medium">{classData.schedule}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Capacity</p>
              <p className="text-gray-900 mt-1 font-medium">{classData.students} / {classData.capacity}</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <GraduationCap className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Teacher</p>
                <Link to={`/teachers/${classData.teacherId}`} className="text-primary-600 hover:text-primary-700 font-medium">
                  {classData.teacher}
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{classData.students}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Average Attendance</p>
              <p className="text-3xl font-bold text-green-600 mt-1">94%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Average Grade</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">B+</p>
            </div>
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Students</h2>
          <Link to={`/classes/${id}/students`} className="text-sm text-primary-600 hover:text-primary-700">
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attendance</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/students/${student.id}`} className="text-sm font-medium text-gray-900 hover:text-primary-600">
                      {student.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.studentId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      {student.attendance}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <Link to={`/students/${student.id}`} className="text-primary-600 hover:text-primary-700">
                      View →
                    </Link>
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



