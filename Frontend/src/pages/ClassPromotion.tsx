import { useState } from 'react'
import { ArrowUp, CheckCircle, Users } from 'lucide-react'

const students = [
  { id: 1, name: 'John Doe', studentId: 'STU001', currentClass: 'S1', newClass: 'S2', selected: false },
  { id: 2, name: 'Jane Smith', studentId: 'STU002', currentClass: 'S1', newClass: 'S2', selected: false },
  { id: 3, name: 'Mike Johnson', studentId: 'STU003', currentClass: 'S2', newClass: 'S3', selected: false },
  { id: 4, name: 'Sarah Williams', studentId: 'STU004', currentClass: 'S3', newClass: 'S4', selected: false },
]

const classMapping: Record<string, string> = {
  'S1': 'S2',
  'S2': 'S3',
  'S3': 'S4',
}

export default function ClassPromotion() {
  const [selectedClass, setSelectedClass] = useState('S1')
  const [selectedStudents, setSelectedStudents] = useState<number[]>([])
  const [promotionStatus, setPromotionStatus] = useState<'idle' | 'success'>('idle')

  const filteredStudents = students.filter((s) => s.currentClass === selectedClass)

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([])
    } else {
      setSelectedStudents(filteredStudents.map((s) => s.id))
    }
  }

  const handleSelectStudent = (id: number) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    )
  }

  const handlePromote = () => {
    if (selectedStudents.length === 0) {
      alert('Please select at least one student to promote')
      return
    }
    // Here you would typically send data to backend
    console.log('Promoting students:', selectedStudents)
    setPromotionStatus('success')
    setTimeout(() => {
      setPromotionStatus('idle')
      setSelectedStudents([])
    }, 3000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Class Promotion</h1>
        <p className="text-gray-600 mt-1">Promote students to the next class</p>
      </div>

      {promotionStatus === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-medium">Students promoted successfully!</span>
        </div>
      )}

      {/* Class Selection */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="label">Select Class to Promote</label>
              <select
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value)
                  setSelectedStudents([])
                }}
                className="input-field"
              >
                <option value="S1">S1 - Senior 1</option>
                <option value="S2">S2 - Senior 2</option>
                <option value="S3">S3 - Senior 3</option>
              </select>
          </div>
          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Will promote to:</span>{' '}
              <span className="text-primary-600 font-semibold">{classMapping[selectedClass] || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Students in {selectedClass} ({filteredStudents.length})
          </h2>
          <button
            onClick={handleSelectAll}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            {selectedStudents.length === filteredStudents.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-12">
                  <input
                    type="checkbox"
                    checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">New Class</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className={`hover:bg-gray-50 ${selectedStudents.includes(student.id) ? 'bg-primary-50' : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleSelectStudent(student.id)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{student.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.studentId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {student.currentClass}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      {classMapping[student.currentClass] || 'N/A'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>No students found in this class</p>
          </div>
        )}

        {selectedStudents.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{selectedStudents.length}</span> student(s) selected
            </div>
            <button onClick={handlePromote} className="btn-primary flex items-center space-x-2">
              <ArrowUp className="w-5 h-5" />
              <span>Promote Selected Students</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

