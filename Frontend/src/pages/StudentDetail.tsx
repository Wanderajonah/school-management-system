import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, Calendar, MapPin, Edit } from 'lucide-react'

// Mock data
const studentData = {
  id: 1,
  name: 'John Doe',
  studentId: 'STU001',
  admissionNumber: 'ADM2023001',
  email: 'john.doe@example.com',
  phone: '+1234567890',
  class: 'S1',
  stream: 'Science',
  address: '123 Main Street, City, State 12345',
  dateOfBirth: '2008-05-15',
  gender: 'Male',
  placeOfBirth: 'City',
  nationality: 'Nigerian',
  enrollmentDate: '2023-09-01',
  status: 'Active',
  parentName: 'Jane Doe',
  parentPhone: '+1234567890',
  parentEmail: 'jane.doe@example.com',
  parentRelationship: 'Mother',
  parentOccupation: 'Teacher',
}

export default function StudentDetail() {
  const { id } = useParams()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/students" className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Students
        </Link>
        <Link to={`/students/${id}/edit`} className="btn-primary flex items-center space-x-2">
          <Edit className="w-5 h-5" />
          <span>Edit Student</span>
        </Link>
      </div>

      {/* Student Header */}
      <div className="card">
        <div className="flex items-start space-x-6">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-3xl font-bold text-primary-600">
              {studentData.name.charAt(0)}
            </span>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{studentData.name}</h1>
            <p className="text-gray-600 mt-1">Student ID: {studentData.studentId}</p>
            <div className="flex items-center space-x-4 mt-4">
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${
                  studentData.status === 'Active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {studentData.status}
              </span>
              <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                {studentData.class}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Student Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Admission Number</p>
              <p className="text-gray-900 font-medium">{studentData.admissionNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Gender</p>
              <p className="text-gray-900">{studentData.gender}</p>
            </div>
            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="text-gray-900">{studentData.dateOfBirth}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Place of Birth</p>
              <p className="text-gray-900">{studentData.placeOfBirth}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Nationality</p>
              <p className="text-gray-900">{studentData.nationality}</p>
            </div>
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-900">{studentData.email}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-gray-900">{studentData.phone}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="text-gray-900">{studentData.address}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Academic Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Enrollment Date</p>
              <p className="text-gray-900 mt-1">{studentData.enrollmentDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Class</p>
              <p className="text-gray-900 mt-1">{studentData.class}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Stream</p>
              <p className="text-gray-900 mt-1">{studentData.stream}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="text-gray-900 mt-1">{studentData.status}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Parent/Guardian Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="text-gray-900 mt-1">{studentData.parentName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Relationship</p>
              <p className="text-gray-900 mt-1">{studentData.parentRelationship}</p>
            </div>
            <div className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-gray-900">{studentData.parentPhone}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Occupation</p>
              <p className="text-gray-900 mt-1">{studentData.parentOccupation}</p>
            </div>
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-900">{studentData.parentEmail}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Academic Performance</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Overall GPA</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">3.85</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Attendance Rate</p>
              <p className="text-2xl font-bold text-green-600 mt-1">94%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



