import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Users, GraduationCap, BookOpen } from 'lucide-react'

// Lower Secondary Classes (S1-S4)
const classes = [
  {
    id: 1,
    name: 'S1',
    description: 'Senior 1 - 11 Compulsory + 1 Elective',
    students: 35,
    classTeacher: 'Mr. John Smith',
    room: 'Room 101',
  },
  {
    id: 2,
    name: 'S2',
    description: 'Senior 2 - 11 Compulsory + 1 Elective',
    students: 32,
    classTeacher: 'Mrs. Jane Doe',
    room: 'Room 102',
  },
  {
    id: 3,
    name: 'S3',
    description: 'Senior 3 - 7 Compulsory + 2 Electives',
    students: 30,
    classTeacher: 'Mr. Michael Brown',
    room: 'Room 201',
  },
  {
    id: 4,
    name: 'S4',
    description: 'Senior 4 - 7 Compulsory + 2 Electives',
    students: 28,
    classTeacher: 'Ms. Sarah Johnson',
    room: 'Room 202',
  },
]

export default function Classes() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredClasses = classes.filter(
    (cls) =>
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.classTeacher.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Classes</h1>
          <p className="text-gray-600 mt-1">Manage all classes and courses</p>
        </div>
        <Link to="/classes/new" className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add Class</span>
        </Link>
      </div>

      {/* Search */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search classes by name, subject, or teacher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((cls) => (
          <Link
            key={cls.id}
            to={`/classes/${cls.id}`}
            className="card hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{cls.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{cls.description}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <GraduationCap className="w-4 h-4 mr-2 text-gray-400" />
                <span className="font-medium">Class Teacher:</span>
                <span className="ml-1">{cls.classTeacher}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2 text-gray-400" />
                <span>{cls.students} students</span>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Room:</span> {cls.room}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <span className="text-sm text-primary-600 font-medium hover:text-primary-700">
                View Details →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

