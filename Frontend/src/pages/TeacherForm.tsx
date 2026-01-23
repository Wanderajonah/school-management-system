import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import api from '../utils/api'

interface Subject {
  _id: string
  name: string
  code: string
}

interface Class {
  _id: string
  name: string
}

export default function TeacherForm() {
  const navigate = useNavigate()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    
    // Professional Information
    qualification: '',
    specialization: '',
    joiningDate: new Date().toISOString().split('T')[0],
    status: 'Active',
    salary: '',
    
    // Address
    street: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    
    // Assignments
    selectedSubjects: [] as string[],
    selectedClasses: [] as string[],
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
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
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleMultiSelect = (name: 'selectedSubjects' | 'selectedClasses', value: string) => {
    setFormData((prev) => {
      const current = prev[name]
      const index = current.indexOf(value)
      if (index > -1) {
        return { ...prev, [name]: current.filter((item) => item !== value) }
      } else {
        return { ...prev, [name]: [...current, value] }
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const teacherData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth || undefined,
        gender: formData.gender || undefined,
        qualification: formData.qualification || undefined,
        specialization: formData.specialization || undefined,
        joiningDate: formData.joiningDate || new Date().toISOString(),
        status: formData.status,
        salary: formData.salary ? parseFloat(formData.salary) : undefined,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          zipCode: formData.zipCode,
        },
        subjects: formData.selectedSubjects,
        classes: formData.selectedClasses,
      }

      const response = await api.createTeacher(teacherData)
      
      if (response.success) {
        alert('Teacher added successfully!')
        navigate('/teachers')
      } else {
        alert('Failed to add teacher. Please try again.')
      }
    } catch (error: any) {
      console.error('Error adding teacher:', error)
      alert(error.message || 'Failed to add teacher. Please check all required fields.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/teachers')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Teacher</h1>
            <p className="text-gray-600 mt-1">Register a new teacher</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="label">Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="label">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="label">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="input-field"
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
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Professional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Qualification</label>
              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., B.Ed, M.Sc"
              />
            </div>
            <div>
              <label className="label">Specialization *</label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., Mathematics, Science"
                required
              />
            </div>
            <div>
              <label className="label">Joining Date *</label>
              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="label">Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>
            <div>
              <label className="label">Salary</label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                className="input-field"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Address Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="label">Street Address</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Zip Code</label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Subject and Class Assignments */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Subject and Class Assignments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Subjects */}
            <div>
              <label className="label">Assign Subjects</label>
              <div className="border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto">
                {loading ? (
                  <p className="text-gray-500 text-sm">Loading subjects...</p>
                ) : subjects.length === 0 ? (
                  <p className="text-gray-500 text-sm">No subjects available</p>
                ) : (
                  <div className="space-y-2">
                    {subjects.map((subject) => (
                      <label key={subject._id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input
                          type="checkbox"
                          checked={formData.selectedSubjects.includes(subject._id)}
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
              <label className="label">Assign Classes</label>
              <div className="border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto">
                {loading ? (
                  <p className="text-gray-500 text-sm">Loading classes...</p>
                ) : classes.length === 0 ? (
                  <p className="text-gray-500 text-sm">No classes available</p>
                ) : (
                  <div className="space-y-2">
                    {classes.map((cls) => (
                      <label key={cls._id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input
                          type="checkbox"
                          checked={formData.selectedClasses.includes(cls._id)}
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

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/teachers')}
            className="btn-secondary"
            disabled={submitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-primary flex items-center space-x-2"
            disabled={submitting}
          >
            <Save className="w-5 h-5" />
            <span>{submitting ? 'Adding Teacher...' : 'Add Teacher'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
