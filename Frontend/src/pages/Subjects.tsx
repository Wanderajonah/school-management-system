import { useState } from 'react'
import { Plus, Search, BookOpen, Edit, Trash2, Users } from 'lucide-react'

// Lower Secondary Curriculum Subjects
const subjects = [
  // Compulsory Subjects (S1-4)
  {
    id: 1,
    name: 'English',
    code: 'ENG',
    department: 'Languages',
    type: 'Compulsory',
    classes: ['S1', 'S2', 'S3', 'S4'],
    teacher: 'Ms. Emily Davis',
  },
  {
    id: 2,
    name: 'Mathematics',
    code: 'MATH',
    department: 'Science & Mathematics',
    type: 'Compulsory',
    classes: ['S1', 'S2', 'S3', 'S4'],
    teacher: 'Dr. Sarah Johnson',
  },
  {
    id: 3,
    name: 'History & Political Education',
    code: 'HPE',
    department: 'Social Studies',
    type: 'Compulsory',
    classes: ['S1', 'S2', 'S3', 'S4'],
    teacher: 'Mr. James Wilson',
  },
  {
    id: 4,
    name: 'Geography',
    code: 'GEO',
    department: 'Social Studies',
    type: 'Compulsory',
    classes: ['S1', 'S2', 'S3', 'S4'],
    teacher: 'Mrs. Patricia Brown',
  },
  {
    id: 5,
    name: 'Physics',
    code: 'PHY',
    department: 'Science & Mathematics',
    type: 'Compulsory',
    classes: ['S1', 'S2', 'S3', 'S4'],
    teacher: 'Mr. Michael Brown',
  },
  {
    id: 6,
    name: 'Biology (General Science)',
    code: 'BIO',
    department: 'Science & Mathematics',
    type: 'Compulsory',
    classes: ['S1', 'S2', 'S3', 'S4'],
    teacher: 'Dr. Robert Lee',
  },
  {
    id: 7,
    name: 'Chemistry',
    code: 'CHEM',
    department: 'Science & Mathematics',
    type: 'Compulsory',
    classes: ['S1', 'S2', 'S3', 'S4'],
    teacher: 'Ms. Lisa Chen',
  },
  {
    id: 8,
    name: 'Physical Education',
    code: 'PE',
    department: 'Physical Education',
    type: 'Compulsory',
    classes: ['S1', 'S2'],
    teacher: 'Mr. David Park',
  },
  {
    id: 9,
    name: 'Religious Education',
    code: 'RE',
    department: 'Religious Education',
    type: 'Compulsory',
    classes: ['S1', 'S2'],
    teacher: 'Rev. John Smith',
  },
  {
    id: 10,
    name: 'Entrepreneurship',
    code: 'ENT',
    department: 'Business Studies',
    type: 'Compulsory',
    classes: ['S1', 'S2'],
    teacher: 'Mrs. Mary Johnson',
  },
  {
    id: 11,
    name: 'Kiswahili',
    code: 'KIS',
    department: 'Languages',
    type: 'Compulsory',
    classes: ['S1', 'S2'],
    teacher: 'Mr. Hassan Ali',
  },
  // Elective Subjects
  {
    id: 12,
    name: 'Agriculture',
    code: 'AGR',
    department: 'Practical (Pre-vocational)',
    type: 'Elective',
    classes: ['S1', 'S2', 'S3', 'S4'],
    teacher: 'Mr. Peter Ochieng',
  },
  {
    id: 13,
    name: 'Information Communication Technology',
    code: 'ICT',
    department: 'Practical (Pre-vocational)',
    type: 'Elective',
    classes: ['S1', 'S2', 'S3', 'S4'],
    teacher: 'Mr. Tech Expert',
  },
  {
    id: 14,
    name: 'Art and Design',
    code: 'ART',
    department: 'Practical (Pre-vocational)',
    type: 'Elective',
    classes: ['S1', 'S2', 'S3', 'S4'],
    teacher: 'Ms. Creative Artist',
  },
  {
    id: 15,
    name: 'Performing Arts',
    code: 'PA',
    department: 'Practical (Pre-vocational)',
    type: 'Elective',
    classes: ['S1', 'S2', 'S3', 'S4'],
    teacher: 'Ms. Drama Teacher',
  },
  {
    id: 16,
    name: 'Technology and Design',
    code: 'TD',
    department: 'Practical (Pre-vocational)',
    type: 'Elective',
    classes: ['S1', 'S2', 'S3', 'S4'],
    teacher: 'Mr. Design Expert',
  },
  {
    id: 17,
    name: 'Nutrition & Food Technology',
    code: 'NFT',
    department: 'Practical (Pre-vocational)',
    type: 'Elective',
    classes: ['S1', 'S2', 'S3', 'S4'],
    teacher: 'Mrs. Food Expert',
  },
  {
    id: 18,
    name: 'Literature in English',
    code: 'LIT',
    department: 'Language Electives',
    type: 'Elective',
    classes: ['S1', 'S2', 'S3', 'S4'],
    teacher: 'Ms. Literature Teacher',
  },
  {
    id: 19,
    name: 'Foreign Languages',
    code: 'FL',
    department: 'Language Electives',
    type: 'Elective',
    classes: ['S1', 'S2', 'S3', 'S4'],
    teacher: 'Mr. Language Expert',
  },
  {
    id: 20,
    name: 'Local Languages',
    code: 'LL',
    department: 'Language Electives',
    type: 'Elective',
    classes: ['S1', 'S2', 'S3', 'S4'],
    teacher: 'Mr. Local Language',
  },
  {
    id: 21,
    name: 'Christian Religious Education',
    code: 'CRE',
    department: 'Religious Education Electives',
    type: 'Elective',
    classes: ['S3', 'S4'],
    teacher: 'Rev. Christian Teacher',
  },
  {
    id: 22,
    name: 'Islamic Religious Education',
    code: 'IRE',
    department: 'Religious Education Electives',
    type: 'Elective',
    classes: ['S3', 'S4'],
    teacher: 'Sheikh Islamic Teacher',
  },
]

const classes = ['S1', 'S2', 'S3', 'S4']
const departments = [
  'Science & Mathematics',
  'Languages',
  'Social Studies',
  'Physical Education',
  'Religious Education',
  'Business Studies',
  'Practical (Pre-vocational)',
  'Language Electives',
  'Religious Education Electives',
]

export default function Subjects() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newSubject, setNewSubject] = useState({
    name: '',
    code: '',
    department: '',
    assignedClasses: [] as string[],
  })

  const filteredSubjects = subjects.filter(
    (subject) =>
      (searchTerm === '' ||
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.code.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedDepartment === '' || subject.department === selectedDepartment)
  )

  const compulsorySubjects = filteredSubjects.filter((s) => s.type === 'Compulsory')
  const electiveSubjects = filteredSubjects.filter((s) => s.type === 'Elective')

  const handleAddSubject = () => {
    // Here you would typically send data to backend
    console.log('New subject:', newSubject)
    alert('Subject added successfully!')
    setShowAddModal(false)
    setNewSubject({ name: '', code: '', department: '', assignedClasses: [] })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subjects</h1>
          <p className="text-gray-600 mt-1">Manage subjects and class assignments</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Subject</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search subjects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="input-field"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Compulsory Subjects */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Compulsory Subjects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {compulsorySubjects.map((subject) => (
          <div key={subject.id} className="card hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex items-center space-x-2">
                <button className="text-primary-600 hover:text-primary-700">
                  <Edit className="w-5 h-5" />
                </button>
                <button className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{subject.name}</h3>
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                {subject.type}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-2">Code: {subject.code}</p>
            <p className="text-sm text-gray-600 mb-4">{subject.department}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2 text-gray-400" />
                <span className="font-medium">Teacher:</span>
                <span className="ml-1">{subject.teacher}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Assigned Classes:</p>
                <div className="flex flex-wrap gap-1">
                  {subject.classes.map((cls) => (
                    <span key={cls} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                      {cls}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          ))}
        </div>
      </div>

      {/* Elective Subjects */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Elective Subjects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {electiveSubjects.map((subject) => (
            <div key={subject.id} className="card hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-primary-600 hover:text-primary-700">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{subject.name}</h3>
                <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  {subject.type}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-2">Code: {subject.code}</p>
              <p className="text-sm text-gray-600 mb-4">{subject.department}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="font-medium">Teacher:</span>
                  <span className="ml-1">{subject.teacher}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Assigned Classes:</p>
                  <div className="flex flex-wrap gap-1">
                    {subject.classes.map((cls) => (
                      <span key={cls} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                        {cls}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Subject Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Add New Subject</h2>
            <div className="space-y-4">
              <div>
                <label className="label">Subject Name *</label>
                <input
                  type="text"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="label">Subject Code *</label>
                <input
                  type="text"
                  value={newSubject.code}
                  onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value.toUpperCase() })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="label">Department *</label>
                <select
                  value={newSubject.department}
                  onChange={(e) => setNewSubject({ ...newSubject, department: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Assign to Classes</label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {classes.map((cls) => (
                    <label key={cls} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newSubject.assignedClasses.includes(cls)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewSubject({
                              ...newSubject,
                              assignedClasses: [...newSubject.assignedClasses, cls],
                            })
                          } else {
                            setNewSubject({
                              ...newSubject,
                              assignedClasses: newSubject.assignedClasses.filter((c) => c !== cls),
                            })
                          }
                        }}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">{cls}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-4 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setNewSubject({ name: '', code: '', department: '', assignedClasses: [] })
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button onClick={handleAddSubject} className="btn-primary">
                Add Subject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

