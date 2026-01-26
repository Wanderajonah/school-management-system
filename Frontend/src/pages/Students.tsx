import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Edit, Trash2, X, Mail, Phone, Calendar, Save, User } from 'lucide-react'
import api, { getImageUrl } from '../utils/api'
import { useNotifications } from '../context/NotificationContext'

interface Class {
  _id: string
  name: string
  description?: string
}

interface Student {
  _id: string
  studentId: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  status: string
  photo?: string
  dateOfBirth?: string
  gender?: string
  enrollmentDate?: string
  boardingStatus?: string
  class?: {
    _id: string
    name: string
  }
  address?: {
    street?: string
    city?: string
    state?: string
    country?: string
    zipCode?: string
  }
  guardian?: {
    name?: string
    relationship?: string
    phone?: string
    email?: string
    address?: string
  }
}

export default function Students() {
  const { addNotification } = useNotifications()
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [modalLoading, setModalLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [classes, setClasses] = useState<Class[]>([])
  const [editFormData, setEditFormData] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)
  const [editPhotoFile, setEditPhotoFile] = useState<File | null>(null)
  const [editPhotoPreview, setEditPhotoPreview] = useState<string | null>(null)

  useEffect(() => {
    fetchStudents()
  }, [currentPage, searchTerm])

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classesResponse = await api.getClasses({ limit: 100 })
        if (classesResponse.success) {
          setClasses(classesResponse.data || [])
        }
      } catch (error) {
        console.error('Error fetching classes:', error)
      }
    }
    fetchClasses()
  }, [])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const response = await api.getStudents({
        page: currentPage,
        limit: 10,
        search: searchTerm || undefined,
      })
      if (response.success) {
        setStudents(response.data || [])
        setTotalPages(response.totalPages || 1)
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation() // Prevent opening modal when clicking delete
    const studentToDelete = students.find(s => s._id === id)
    const studentName = studentToDelete ? `${studentToDelete.firstName} ${studentToDelete.lastName}` : 'Student'
    
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await api.deleteStudent(id)
        
        addNotification({
          title: 'Student Deleted',
          message: `${studentName} has been removed from the system`,
          type: 'warning',
          link: '/students',
        })
        
        fetchStudents()
        if (selectedStudent?._id === id) {
          setSelectedStudent(null)
        }
      } catch (error) {
        console.error('Error deleting student:', error)
        alert('Failed to delete student')
      }
    }
  }

  const handleStudentClick = async (student: Student) => {
    try {
      setModalLoading(true)
      setIsEditing(false)
      // Fetch full student details
      const response = await api.getStudent(student._id)
      if (response.success) {
        setSelectedStudent(response.data)
        // Initialize edit form data
        const studentData = response.data
        setEditPhotoPreview(getImageUrl(studentData.photo, 'default-student.jpg'))
        setEditFormData({
          firstName: studentData.firstName || '',
          lastName: studentData.lastName || '',
          email: studentData.email || '',
          phone: studentData.phone || '',
          dateOfBirth: studentData.dateOfBirth
            ? new Date(studentData.dateOfBirth).toISOString().split('T')[0]
            : '',
          gender: studentData.gender || '',
          class: studentData.class?._id || '',
          enrollmentDate: studentData.enrollmentDate
            ? new Date(studentData.enrollmentDate).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
          status: studentData.status || 'Active',
          boardingStatus: studentData.boardingStatus || 'Day',
          street: studentData.address?.street || '',
          city: studentData.address?.city || '',
          state: studentData.address?.state || '',
          country: studentData.address?.country || '',
          zipCode: studentData.address?.zipCode || '',
          guardianName: studentData.guardian?.name || '',
          guardianRelationship: studentData.guardian?.relationship || '',
          guardianPhone: studentData.guardian?.phone || '',
          guardianEmail: studentData.guardian?.email || '',
          guardianAddress: studentData.guardian?.address || '',
        })
      } else {
        setSelectedStudent(student) // Fallback to basic data
      }
    } catch (error) {
      console.error('Error fetching student details:', error)
      setSelectedStudent(student) // Fallback to basic data
    } finally {
      setModalLoading(false)
    }
  }

  const closeModal = () => {
    setSelectedStudent(null)
    setIsEditing(false)
    setEditFormData(null)
    setEditPhotoFile(null)
    setEditPhotoPreview(null)
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditPhotoFile(null)
    // Reset form data to original student data
    if (selectedStudent) {
      handleStudentClick(selectedStudent)
    }
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleEditPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setEditPhotoFile(file)
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveEdit = async () => {
    if (!selectedStudent || !editFormData) return

    setSubmitting(true)
    try {
      let photoPath = undefined
      
      // Upload new photo if selected
      if (editPhotoFile) {
        const uploadResponse = await api.uploadProfilePhoto(editPhotoFile)
        if (uploadResponse.success) {
          photoPath = uploadResponse.data.path
        }
      }

      const studentData = {
        firstName: editFormData.firstName,
        lastName: editFormData.lastName,
        email: editFormData.email,
        phone: editFormData.phone || undefined,
        dateOfBirth: editFormData.dateOfBirth || undefined,
        gender: editFormData.gender || undefined,
        class: editFormData.class,
        enrollmentDate: editFormData.enrollmentDate || new Date().toISOString(),
        status: editFormData.status,
        boardingStatus: editFormData.boardingStatus || 'Day',
        address: {
          street: editFormData.street,
          city: editFormData.city,
          state: editFormData.state,
          country: editFormData.country,
          zipCode: editFormData.zipCode,
        },
        guardian: {
          name: editFormData.guardianName,
          relationship: editFormData.guardianRelationship,
          phone: editFormData.guardianPhone,
          email: editFormData.guardianEmail,
          address: editFormData.guardianAddress,
        },
        ...(photoPath && { photo: photoPath }),
      }

      const response = await api.updateStudent(selectedStudent._id, studentData)

      if (response.success) {
        alert('Student updated successfully!')
        setIsEditing(false)
        // Refresh the student list and update selected student
        await fetchStudents()
        const updatedResponse = await api.getStudent(selectedStudent._id)
        if (updatedResponse.success) {
          setSelectedStudent(updatedResponse.data)
        }
      } else {
        alert('Failed to update student. Please try again.')
      }
    } catch (error: any) {
      console.error('Error updating student:', error)
      alert(error.message || 'Failed to update student. Please check all required fields.')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredStudents = students.filter(
    (student) =>
      `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-1">Manage all student records</p>
        </div>
        <div className="flex items-center space-x-2">
          <Link to="/students/new" className="btn-primary flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Enroll Student</span>
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search students by name, ID, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Students Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading students...</div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No students found</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student) => {
                    const fullName = `${student.firstName} ${student.lastName}`
                    return (
                      <tr
                        key={student._id}
                        onClick={() => handleStudentClick(student)}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getImageUrl(student.photo, 'default-student.jpg') ? (
                              <img
                                src={getImageUrl(student.photo, 'default-student.jpg')!}
                                alt={fullName}
                                className="w-10 h-10 rounded-full object-cover mr-3 border-2 border-gray-200"
                                onError={(e) => {
                                  // Fallback to initial if image fails to load
                                  const target = e.target as HTMLImageElement
                                  const fallback = target.nextElementSibling as HTMLElement
                                  target.style.display = 'none'
                                  if (fallback) fallback.style.display = 'flex'
                                }}
                              />
                            ) : null}
                            <div 
                              className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3"
                              style={{ display: getImageUrl(student.photo, 'default-student.jpg') ? 'none' : 'flex' }}
                            >
                              <span className="text-primary-600 font-medium">
                                {student.firstName.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{fullName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{student.studentId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {student.class?.name || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{student.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{student.phone || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              student.status === 'Active'
                                ? 'bg-green-100 text-green-800'
                                : student.status === 'Graduated'
                                ? 'bg-blue-100 text-blue-800'
                                : student.status === 'Transferred'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {student.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              to={`/students/${student._id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              <Edit className="w-5 h-5" />
                            </Link>
                            <button 
                              onClick={(e) => handleDelete(student._id, e)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

        {/* Pagination */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Page <span className="font-medium">{currentPage}</span> of{' '}
            <span className="font-medium">{totalPages}</span>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button 
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </>
        )}
      </div>

      {/* Student Details Modal */}
      {selectedStudent && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Student Details</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            {modalLoading ? (
              <div className="p-8 text-center text-gray-500">Loading student details...</div>
            ) : isEditing && editFormData ? (
              <div className="p-6 space-y-6">
                {/* Edit Form */}
                <div className="space-y-6">
                  {/* Profile Picture */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h4>
                    <div className="flex items-center space-x-6">
                      <div className="flex-shrink-0">
                        {editPhotoPreview ? (
                          <img
                            src={editPhotoPreview}
                            alt="Profile preview"
                            className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                          />
                        ) : (
                          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-300">
                            <span className="text-gray-500 text-sm">No photo</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Upload New Profile Picture
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleEditPhotoChange}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                        />
                        <p className="mt-1 text-xs text-gray-500">JPG, PNG or GIF. Max size: 5MB</p>
                      </div>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                        <input
                          type="text"
                          name="firstName"
                          value={editFormData.firstName}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                        <input
                          type="text"
                          name="lastName"
                          value={editFormData.lastName}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={editFormData.email}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={editFormData.phone}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={editFormData.dateOfBirth}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                        <select
                          name="gender"
                          value={editFormData.gender}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
                        <select
                          name="class"
                          value={editFormData.class}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select Class</option>
                          {classes.map((cls) => (
                            <option key={cls._id} value={cls._id}>
                              {cls.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Boarding Status</label>
                        <select
                          name="boardingStatus"
                          value={editFormData.boardingStatus}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="Day">Day</option>
                          <option value="Boarding">Boarding</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Date *</label>
                        <input
                          type="date"
                          name="enrollmentDate"
                          value={editFormData.enrollmentDate}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                        <select
                          name="status"
                          value={editFormData.status}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <option value="Graduated">Graduated</option>
                          <option value="Transferred">Transferred</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                        <input
                          type="text"
                          name="street"
                          value={editFormData.street}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                          type="text"
                          name="city"
                          value={editFormData.city}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                        <input
                          type="text"
                          name="state"
                          value={editFormData.state}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                        <input
                          type="text"
                          name="country"
                          value={editFormData.country}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                        <input
                          type="text"
                          name="zipCode"
                          value={editFormData.zipCode}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Guardian Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Guardian Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Name</label>
                        <input
                          type="text"
                          name="guardianName"
                          value={editFormData.guardianName}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                        <select
                          name="guardianRelationship"
                          value={editFormData.guardianRelationship}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="">Select Relationship</option>
                          <option value="Father">Father</option>
                          <option value="Mother">Mother</option>
                          <option value="Guardian">Guardian</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Phone</label>
                        <input
                          type="tel"
                          name="guardianPhone"
                          value={editFormData.guardianPhone}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Email</label>
                        <input
                          type="email"
                          name="guardianEmail"
                          value={editFormData.guardianEmail}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Address</label>
                        <input
                          type="text"
                          name="guardianAddress"
                          value={editFormData.guardianAddress}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {/* Student Header */}
                <div className="flex items-start space-x-6">
                  {getImageUrl(selectedStudent.photo, 'default-student.jpg') ? (
                    <img
                      src={getImageUrl(selectedStudent.photo, 'default-student.jpg')!}
                      alt={`${selectedStudent.firstName} ${selectedStudent.lastName}`}
                      className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        const fallback = target.nextElementSibling as HTMLElement
                        target.style.display = 'none'
                        if (fallback) fallback.style.display = 'flex'
                      }}
                    />
                  ) : null}
                  <div 
                    className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center"
                    style={{ display: getImageUrl(selectedStudent.photo, 'default-student.jpg') ? 'none' : 'flex' }}
                  >
                    <span className="text-3xl font-bold text-primary-600">
                      {selectedStudent.firstName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {selectedStudent.firstName} {selectedStudent.lastName}
                    </h3>
                    <p className="text-gray-600 mt-1">Student ID: {selectedStudent.studentId}</p>
                    <div className="flex items-center space-x-3 mt-3">
                      <span
                        className={`px-3 py-1 text-sm font-medium rounded-full ${
                          selectedStudent.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : selectedStudent.status === 'Graduated'
                            ? 'bg-blue-100 text-blue-800'
                            : selectedStudent.status === 'Transferred'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {selectedStudent.status}
                      </span>
                      {selectedStudent.class && (
                        <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                          {selectedStudent.class.name}
                        </span>
                      )}
                      {selectedStudent.boardingStatus && (
                        <span className="px-3 py-1 text-sm font-medium bg-purple-100 text-purple-800 rounded-full">
                          {selectedStudent.boardingStatus}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Student Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">Personal Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="text-gray-900">{selectedStudent.email}</p>
                        </div>
                      </div>
                      {selectedStudent.phone && (
                        <div className="flex items-start space-x-3">
                          <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="text-gray-900">{selectedStudent.phone}</p>
                          </div>
                        </div>
                      )}
                      {selectedStudent.gender && (
                        <div className="flex items-start space-x-3">
                          <User className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-500">Gender</p>
                            <p className="text-gray-900">{selectedStudent.gender}</p>
                          </div>
                        </div>
                      )}
                      {selectedStudent.dateOfBirth && (
                        <div className="flex items-start space-x-3">
                          <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-500">Date of Birth</p>
                            <p className="text-gray-900">
                              {new Date(selectedStudent.dateOfBirth).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}
                      {selectedStudent.address && (
                        <div>
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="text-gray-900">
                            {[
                              selectedStudent.address.street,
                              selectedStudent.address.city,
                              selectedStudent.address.state,
                              selectedStudent.address.country,
                              selectedStudent.address.zipCode,
                            ]
                              .filter(Boolean)
                              .join(', ') || 'N/A'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">Academic Information</h4>
                    <div className="space-y-3">
                      {selectedStudent.class && (
                        <div>
                          <p className="text-sm text-gray-500">Class</p>
                          <p className="text-gray-900">{selectedStudent.class.name}</p>
                        </div>
                      )}
                      {selectedStudent.enrollmentDate && (
                        <div className="flex items-start space-x-3">
                          <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-500">Enrollment Date</p>
                            <p className="text-gray-900">
                              {new Date(selectedStudent.enrollmentDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}
                      {selectedStudent.boardingStatus && (
                        <div>
                          <p className="text-sm text-gray-500">Boarding Status</p>
                          <p className="text-gray-900">{selectedStudent.boardingStatus}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Guardian Information */}
                {selectedStudent.guardian && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">Guardian Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedStudent.guardian.name && (
                        <div>
                          <p className="text-sm text-gray-500">Guardian Name</p>
                          <p className="text-gray-900">{selectedStudent.guardian.name}</p>
                        </div>
                      )}
                      {selectedStudent.guardian.relationship && (
                        <div>
                          <p className="text-sm text-gray-500">Relationship</p>
                          <p className="text-gray-900">{selectedStudent.guardian.relationship}</p>
                        </div>
                      )}
                      {selectedStudent.guardian.phone && (
                        <div>
                          <p className="text-sm text-gray-500">Guardian Phone</p>
                          <p className="text-gray-900">{selectedStudent.guardian.phone}</p>
                        </div>
                      )}
                      {selectedStudent.guardian.email && (
                        <div>
                          <p className="text-sm text-gray-500">Guardian Email</p>
                          <p className="text-gray-900">{selectedStudent.guardian.email}</p>
                        </div>
                      )}
                      {selectedStudent.guardian.address && (
                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-500">Guardian Address</p>
                          <p className="text-gray-900">{selectedStudent.guardian.address}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancelEdit}
                    disabled={submitting}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={submitting}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{submitting ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors flex items-center space-x-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit Student</span>
                  </button>
                  <Link
                    to={`/students/${selectedStudent._id}`}
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                  >
                    View Full Details
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}




