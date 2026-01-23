import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, Calendar, Edit } from 'lucide-react'

// Mock data
const teacherData = {
  id: 1,
  name: 'Dr. Sarah Johnson',
  teacherId: 'TCH001',
  email: 'sarah.johnson@example.com',
  phone: '+1234567890',
  subject: 'Mathematics',
  department: 'Science & Mathematics',
  hireDate: '2020-09-01',
  status: 'Active',
  classes: ['10A', '10B', '11A'],
  qualifications: 'Ph.D. in Mathematics',
}

export default function TeacherDetail() {
  const { id } = useParams()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/teachers" className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Teachers
        </Link>
        <Link to={`/teachers/${id}/edit`} className="btn-primary flex items-center space-x-2">
          <Edit className="w-5 h-5" />
          <span>Edit Teacher</span>
        </Link>
      </div>

      {/* Teacher Header */}
      <div className="card">
        <div className="flex items-start space-x-6">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-3xl font-bold text-green-600">
              {teacherData.name.charAt(0)}
            </span>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{teacherData.name}</h1>
            <p className="text-gray-600 mt-1">Teacher ID: {teacherData.teacherId}</p>
            <div className="flex items-center space-x-4 mt-4">
              <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                {teacherData.status}
              </span>
              <span className="px-3 py-1 text-sm font-medium bg-purple-100 text-purple-800 rounded-full">
                {teacherData.subject}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Teacher Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-900">{teacherData.email}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-gray-900">{teacherData.phone}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Professional Information</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Subject</p>
              <p className="text-gray-900 mt-1">{teacherData.subject}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Department</p>
              <p className="text-gray-900 mt-1">{teacherData.department}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Qualifications</p>
              <p className="text-gray-900 mt-1">{teacherData.qualifications}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Hire Date</p>
              <p className="text-gray-900 mt-1">{teacherData.hireDate}</p>
            </div>
          </div>
        </div>

        <div className="card lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Assigned Classes</h2>
          <div className="flex flex-wrap gap-2">
            {teacherData.classes.map((cls) => (
              <Link
                key={cls}
                to={`/classes/${cls}`}
                className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
              >
                {cls}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}



