import { useState } from 'react'
import { Search, GraduationCap, Calendar, Award } from 'lucide-react'

const alumni = [
  {
    id: 1,
    name: 'Makwasi Paul',
    studentId: 'ALM001',
    graduationYear: 2023,
    finalClass: 'S4',
    currentStatus: 'University Student',
    university: 'State University',
    email: 'makwasi.p@example.com',
  },
  {
    id: 2,
    name: 'Wandera Miky',
    studentId: 'ALM002',
    graduationYear: 2022,
    finalClass: 'S4',
    currentStatus: 'Employed',
    company: 'Tech Corp',
    email: 'Wandera.M@example.com',
  },
  {
    id: 3,
    name: 'Nandudu Lydia',
    studentId: 'ALM003',
    graduationYear: 2023,
    finalClass: 'S4',
    currentStatus: 'University Student',
    university: 'National University',
    email: 'david.wilson@example.com',
  },
]

export default function Alumni() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterYear, setFilterYear] = useState('')

  const filteredAlumni = alumni.filter(
    (alumnus) =>
      (searchTerm === '' ||
        alumnus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alumnus.studentId.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterYear === '' || alumnus.graduationYear.toString() === filterYear)
  )

  const graduationYears = Array.from(new Set(alumni.map((a) => a.graduationYear))).sort((a, b) => b - a)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Alumni</h1>
        <p className="text-gray-600 mt-1">View and manage alumni records</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or student ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="input-field"
          >
            <option value="">All Graduation Years</option>
            {graduationYears.map((year) => (
              <option key={year} value={year.toString()}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Alumni Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlumni.map((alumnus) => (
          <div key={alumnus.id} className="card hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-purple-600" />
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                {alumnus.graduationYear}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-1">{alumnus.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{alumnus.studentId}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                <span>Class: {alumnus.finalClass}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Award className="w-4 h-4 mr-2 text-gray-400" />
                <span>Status: {alumnus.currentStatus}</span>
              </div>
              {alumnus.university && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">University:</span> {alumnus.university}
                </div>
              )}
              {alumnus.company && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Company:</span> {alumnus.company}
                </div>
              )}
              <div className="text-sm text-gray-600">
                <span className="font-medium">Email:</span> {alumnus.email}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAlumni.length === 0 && (
        <div className="card text-center py-12">
          <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">No alumni records found</p>
        </div>
      )}
    </div>
  )
}

