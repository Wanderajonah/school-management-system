import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Edit, Trash2, X, Mail, Phone, Calendar, GraduationCap, Save } from 'lucide-react'
import api, { getImageUrl } from '../utils/api'
import { useNotifications } from '../context/NotificationContext'

interface Subject {
  _id: string
  name: string
  code: string
}

interface Class {
  _id: string
  name: string
}

interface Teacher {
  _id: string
  teacherId: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  specialization?: string
  status: string
  qualification?: string
  dateOfBirth?: string
  gender?: string
  joiningDate?: string
  salary?: number
  photo?: string
  address?: {
    street?: string
    city?: string
    state?: string
    country?: string
    zipCode?: string
  }
  subjects?: Array<{ _id: string; name: string; code: string }>
  classes?: Array<{ _id: string; name: string }>
}

export default function Teachers() {
  const { addNotification } = useNotifications()
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [modalLoading, setModalLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [editFormData, setEditFormData] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)
  const [editPhotoFile, setEditPhotoFile] = useState<File | null>(null)
  const [editPhotoPreview, setEditPhotoPreview] = useState<string | null>(null)

  useEffect(() => {
    fetchTeachers()
  }, [currentPage, searchTerm])

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [subjectsResponse, classesResponse] = await Promise.all([
          api.getSubjects({ limit: 100 }),
          api.getClasses({ limit: 100 }),
        ])
        if (subjectsResponse.success) {
          setSubjects(subjectsResponse.data || [])
        }
        if (classesResponse.success) {
          setClasses(classesResponse.data || [])
        }
      } catch (error) {
        console.error('Error fetching options:', error)
      }
    }
    fetchOptions()
  }, [])

  const fetchTeachers = async () => {
    try {
      setLoading(true)
      const response = await api.getTeachers({
        page: currentPage,
        limit: 10,
        search: searchTerm || undefined,
      })
      if (response.success) {
        setTeachers(response.data || [])
        setTotalPages(response.totalPages || 1)
      }
    } catch (error) {
      console.error('Error fetching teachers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent opening modal when clicking delete
    const teacherToDelete = teachers.find(t => t._id === id)
    const teacherName = teacherToDelete ? `${teacherToDelete.firstName} ${teacherToDelete.lastName}` : 'Teacher'
    
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await api.deleteTeacher(id)
        
        addNotification({
          title: 'Teacher Removed',
          message: `${teacherName} has been removed from the staff`,
          type: 'warning',
          link: '/teachers',
        })
        
        fetchTeachers()
        if (selectedTeacher?._id === id) {
          setSelectedTeacher(null)
        }
      } catch (error) {
        console.error('Error deleting teacher:', error)
        alert('Failed to delete teacher')
      }
    }
  }

  const handleTeacherClick = async (teacher: Teacher) => {
    try {
      setModalLoading(true)
      setIsEditing(false)
      // Fetch full teacher details
      const response = await api.getTeacher(teacher._id)
      if (response.success) {
        setSelectedTeacher(response.data)
        // Initialize edit form data
        const teacherData = response.data
        setEditPhotoPreview(getImageUrl(teacherData.photo, 'default-teacher.jpg'))
        setEditFormData({
          firstName: teacherData.firstName || '',
          lastName: teacherData.lastName || '',
          email: teacherData.email || '',
          phone: teacherData.phone || '',
          dateOfBirth: teacherData.dateOfBirth
            ? new Date(teacherData.dateOfBirth).toISOString().split('T')[0]
            : '',
          gender: teacherData.gender || '',
          qualification: teacherData.qualification || '',
          specialization: teacherData.specialization || '',
          joiningDate: teacherData.joiningDate
            ? new Date(teacherData.joiningDate).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
          status: teacherData.status || 'Active',
          salary: teacherData.salary?.toString() || '',
          street: teacherData.address?.street || '',
          city: teacherData.address?.city || '',
          state: teacherData.address?.state || '',
          country: teacherData.address?.country || '',
          zipCode: teacherData.address?.zipCode || '',
          selectedSubjects: teacherData.subjects?.map((s: any) => s._id) || [],
          selectedClasses: teacherData.classes?.map((c: any) => c._id) || [],
        })
      } else {
        setSelectedTeacher(teacher) // Fallback to basic data
      }
    } catch (error) {
      console.error('Error fetching teacher details:', error)
      setSelectedTeacher(teacher) // Fallback to basic data
    } finally {
      setModalLoading(false)
    }
  }

  const closeModal = () => {
    setSelectedTeacher(null)
    setIsEditing(false)
    setEditFormData(null)
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditPhotoFile(null)
    // Reset form data to original teacher data
    if (selectedTeacher) {
      handleTeacherClick(selectedTeacher)
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

  const handleMultiSelect = (name: 'selectedSubjects' | 'selectedClasses', value: string) => {
    setEditFormData((prev: any) => {
      const current = prev[name] || []
      const index = current.indexOf(value)
      if (index > -1) {
        return { ...prev, [name]: current.filter((item: string) => item !== value) }
      } else {
        return { ...prev, [name]: [...current, value] }
      }
    })
  }

  const handleSaveEdit = async () => {
    if (!selectedTeacher || !editFormData) return

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

      const teacherData = {
        firstName: editFormData.firstName,
        lastName: editFormData.lastName,
        email: editFormData.email,
        phone: editFormData.phone || undefined,
        dateOfBirth: editFormData.dateOfBirth || undefined,
        gender: editFormData.gender || undefined,
        qualification: editFormData.qualification || undefined,
        specialization: editFormData.specialization || undefined,
        joiningDate: editFormData.joiningDate || new Date().toISOString(),
        status: editFormData.status,
        salary: editFormData.salary ? parseFloat(editFormData.salary) : undefined,
        address: {
          street: editFormData.street,
          city: editFormData.city,
          state: editFormData.state,
          country: editFormData.country,
          zipCode: editFormData.zipCode,
        },
        subjects: editFormData.selectedSubjects,
        classes: editFormData.selectedClasses,
        ...(photoPath && { photo: photoPath }),
      }

      const response = await api.updateTeacher(selectedTeacher._id, teacherData)

      if (response.success) {
        alert('Teacher updated successfully!')
        setIsEditing(false)
        // Refresh the teacher list and update selected teacher
        await fetchTeachers()
        const updatedResponse = await api.getTeacher(selectedTeacher._id)
        if (updatedResponse.success) {
          setSelectedTeacher(updatedResponse.data)
        }
      } else {
        alert('Failed to update teacher. Please try again.')
      }
    } catch (error: any) {
      console.error('Error updating teacher:', error)
      alert(error.message || 'Failed to update teacher. Please check all required fields.')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredTeachers = teachers.filter(
    (teacher) =>
      `${teacher.firstName} ${teacher.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.teacherId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teachers</h1>
          <p className="text-gray-600 mt-1">Manage all teacher records</p>
        </div>
        <Link to="/teachers/new" className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add Teacher</span>
        </Link>
      </div>

      {/* Search */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search teachers by name, ID, or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Teachers Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading teachers...</div>
        ) : filteredTeachers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No teachers found</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Teacher
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Teacher ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Specialization
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
                  {filteredTeachers.map((teacher) => {
                    const fullName = `${teacher.firstName} ${teacher.lastName}`
                    return (
                      <tr
                        key={teacher._id}
                        onClick={() => handleTeacherClick(teacher)}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getImageUrl(teacher.photo, 'default-teacher.jpg') ? (
                              <img
                                src={getImageUrl(teacher.photo, 'default-teacher.jpg')!}
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
                              className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3"
                              style={{ display: getImageUrl(teacher.photo, 'default-teacher.jpg') ? 'none' : 'flex' }}
                            >
                              <span className="text-green-600 font-medium">
                                {teacher.firstName.charAt(0)}
                  </span>
                </div>
                <div>
                              <div className="text-sm font-medium text-gray-900">{fullName}</div>
                </div>
              </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{teacher.teacherId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{teacher.specialization || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{teacher.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{teacher.phone || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              teacher.status === 'Active'
                                ? 'bg-green-100 text-green-800'
                                : teacher.status === 'On Leave'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                {teacher.status}
              </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              to={`/teachers/${teacher._id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              <Edit className="w-5 h-5" />
                            </Link>
                            <button
                              onClick={(e) => handleDelete(teacher._id, e)}
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

      {/* Teacher Details Modal */}
      {selectedTeacher && (
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
              <h2 className="text-2xl font-bold text-gray-900">Teacher Details</h2>
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
              <div className="p-8 text-center text-gray-500">Loading teacher details...</div>
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

                  {/* Professional Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                        <input
                          type="text"
                          name="qualification"
                          value={editFormData.qualification}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="e.g., B.Ed, M.Sc"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Specialization *</label>
                        <input
                          type="text"
                          name="specialization"
                          value={editFormData.specialization}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="e.g., Mathematics, Science"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date *</label>
                        <input
                          type="date"
                          name="joiningDate"
                          value={editFormData.joiningDate}
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
                          <option value="On Leave">On Leave</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                        <input
                          type="number"
                          name="salary"
                          value={editFormData.salary}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
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

                  {/* Subject and Class Assignments */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Subject and Class Assignments</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Subjects */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Assign Subjects</label>
                        <div className="border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto">
                          {subjects.length === 0 ? (
                            <p className="text-gray-500 text-sm">No subjects available</p>
                          ) : (
                            <div className="space-y-2">
                              {subjects.map((subject) => (
                                <label
                                  key={subject._id}
                                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                                >
                                  <input
                                    type="checkbox"
                                    checked={editFormData.selectedSubjects?.includes(subject._id) || false}
                                    onChange={() => handleMultiSelect('selectedSubjects', subject._id)}
                                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                  />
                                  <span className="text-sm text-gray-700">
                                    {subject.name} ({subject.code})
                                  </span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Classes */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Assign Classes</label>
                        <div className="border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto">
                          {classes.length === 0 ? (
                            <p className="text-gray-500 text-sm">No classes available</p>
                          ) : (
                            <div className="space-y-2">
                              {classes.map((cls) => (
                                <label
                                  key={cls._id}
                                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                                >
                                  <input
                                    type="checkbox"
                                    checked={editFormData.selectedClasses?.includes(cls._id) || false}
                                    onChange={() => handleMultiSelect('selectedClasses', cls._id)}
                                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                  />
                                  <span className="text-sm text-gray-700">{cls.name}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {/* Teacher Header */}
                <div className="flex items-start space-x-6">
                  {getImageUrl(selectedTeacher.photo, 'default-teacher.jpg') ? (
                    <img
                      src={getImageUrl(selectedTeacher.photo, 'default-teacher.jpg')!}
                      alt={`${selectedTeacher.firstName} ${selectedTeacher.lastName}`}
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
                    className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center"
                    style={{ display: getImageUrl(selectedTeacher.photo, 'default-teacher.jpg') ? 'none' : 'flex' }}
                  >
                    <span className="text-3xl font-bold text-green-600">
                      {selectedTeacher.firstName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {selectedTeacher.firstName} {selectedTeacher.lastName}
                    </h3>
                    <p className="text-gray-600 mt-1">Teacher ID: {selectedTeacher.teacherId}</p>
                    <div className="flex items-center space-x-3 mt-3">
                      <span
                        className={`px-3 py-1 text-sm font-medium rounded-full ${
                          selectedTeacher.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : selectedTeacher.status === 'On Leave'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {selectedTeacher.status}
                      </span>
                      {selectedTeacher.specialization && (
                        <span className="px-3 py-1 text-sm font-medium bg-purple-100 text-purple-800 rounded-full">
                          {selectedTeacher.specialization}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Teacher Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">Personal Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="text-gray-900">{selectedTeacher.email}</p>
                        </div>
                      </div>
                      {selectedTeacher.phone && (
                        <div className="flex items-start space-x-3">
                          <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="text-gray-900">{selectedTeacher.phone}</p>
                          </div>
                        </div>
                      )}
                      {selectedTeacher.gender && (
                        <div>
                          <p className="text-sm text-gray-500">Gender</p>
                          <p className="text-gray-900">{selectedTeacher.gender}</p>
                        </div>
                      )}
                      {selectedTeacher.dateOfBirth && (
                        <div className="flex items-start space-x-3">
                          <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-500">Date of Birth</p>
                            <p className="text-gray-900">
                              {new Date(selectedTeacher.dateOfBirth).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}
                      {selectedTeacher.address && (
                        <div>
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="text-gray-900">
                            {[
                              selectedTeacher.address.street,
                              selectedTeacher.address.city,
                              selectedTeacher.address.state,
                              selectedTeacher.address.country,
                              selectedTeacher.address.zipCode,
                            ]
                              .filter(Boolean)
                              .join(', ') || 'N/A'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">Professional Information</h4>
                    <div className="space-y-3">
                      {selectedTeacher.specialization && (
                        <div>
                          <p className="text-sm text-gray-500">Specialization</p>
                          <p className="text-gray-900">{selectedTeacher.specialization}</p>
                        </div>
                      )}
                      {selectedTeacher.qualification && (
                        <div className="flex items-start space-x-3">
                          <GraduationCap className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-500">Qualification</p>
                            <p className="text-gray-900">{selectedTeacher.qualification}</p>
                          </div>
                        </div>
                      )}
                      {selectedTeacher.joiningDate && (
                        <div className="flex items-start space-x-3">
                          <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-500">Joining Date</p>
                            <p className="text-gray-900">
                              {new Date(selectedTeacher.joiningDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}
                      {selectedTeacher.salary && (
                        <div>
                          <p className="text-sm text-gray-500">Salary</p>
                          <p className="text-gray-900">
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'USD',
                            }).format(selectedTeacher.salary)}
                          </p>
                        </div>
                      )}
                </div>
              </div>
            </div>

                {/* Subjects and Classes */}
                {((selectedTeacher.subjects?.length ?? 0) > 0 || (selectedTeacher.classes?.length ?? 0) > 0) && (
                  <div className="space-y-4">
                    {(selectedTeacher.subjects?.length ?? 0) > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Assigned Subjects</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedTeacher.subjects!.map((subject) => (
                            <span
                              key={subject._id}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm"
                            >
                              {subject.name} ({subject.code})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {(selectedTeacher.classes?.length ?? 0) > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Assigned Classes</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedTeacher.classes!.map((cls) => (
                            <span
                              key={cls._id}
                              className="px-3 py-1 bg-purple-100 text-purple-800 rounded-lg text-sm"
                            >
                              {cls.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
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
                    <span>Edit Teacher</span>
                  </button>
                  <Link
                    to={`/teachers/${selectedTeacher._id}`}
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



