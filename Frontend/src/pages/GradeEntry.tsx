import { useState } from 'react'
import { Save, Calculator } from 'lucide-react'

const students = [
  { id: 1, name: 'John Doe', studentId: 'STU001' },
  { id: 2, name: 'Jane Smith', studentId: 'STU002' },
  { id: 3, name: 'Mike Johnson', studentId: 'STU003' },
]

const calculateTotal = (ca1: number, ca2: number, midterm: number, finals: number) => {
  // CA1 (10%) + CA2 (10%) + Midterm (20%) + Finals (60%) = 100%
  return Math.round(ca1 * 0.1 + ca2 * 0.1 + midterm * 0.2 + finals * 0.6)
}

const calculateGrade = (total: number) => {
  if (total >= 90) return 'A+'
  if (total >= 85) return 'A'
  if (total >= 80) return 'A-'
  if (total >= 75) return 'B+'
  if (total >= 70) return 'B'
  if (total >= 65) return 'B-'
  if (total >= 60) return 'C+'
  if (total >= 55) return 'C'
  if (total >= 50) return 'C-'
  if (total >= 45) return 'D'
  return 'F'
}

export default function GradeEntry() {
  const [selectedClass, setSelectedClass] = useState('S1')
  const [selectedSubject, setSelectedSubject] = useState('Mathematics')
  const [term, setTerm] = useState('First Term')
  const [grades, setGrades] = useState<Record<number, { ca1: number; ca2: number; midterm: number; finals: number }>>({
    1: { ca1: 85, ca2: 88, midterm: 82, finals: 90 },
    2: { ca1: 92, ca2: 90, midterm: 95, finals: 93 },
    3: { ca1: 78, ca2: 75, midterm: 80, finals: 77 },
  })

  const handleGradeChange = (studentId: number, field: 'ca1' | 'ca2' | 'midterm' | 'finals', value: number) => {
    setGrades((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], [field]: Math.min(100, Math.max(0, value)) },
    }))
  }

  const handleSave = () => {
    // Here you would typically send data to backend
    console.log('Grades saved:', { class: selectedClass, subject: selectedSubject, term, grades })
    alert('Grades saved successfully!')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Grade Entry</h1>
        <p className="text-gray-600 mt-1">Enter marks for Continuous Assessment and Exams</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="label">Class</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="input-field">
              <option value="S1">S1</option>
              <option value="S2">S2</option>
              <option value="S3">S3</option>
              <option value="S4">S4</option>
            </select>
          </div>
          <div>
            <label className="label">Subject</label>
            <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="input-field">
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="English">English</option>
            </select>
          </div>
          <div>
            <label className="label">Term</label>
            <select value={term} onChange={(e) => setTerm(e.target.value)} className="input-field">
              <option value="First Term">First Term</option>
              <option value="Second Term">Second Term</option>
              <option value="Third Term">Third Term</option>
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={handleSave} className="btn-primary w-full flex items-center justify-center space-x-2">
              <Save className="w-5 h-5" />
              <span>Save Grades</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grade Entry Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">CA1 (10%)</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">CA2 (10%)</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Midterm (20%)</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Finals (60%)</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Grade</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => {
                const studentGrades = grades[student.id] || { ca1: 0, ca2: 0, midterm: 0, finals: 0 }
                const total = calculateTotal(
                  studentGrades.ca1,
                  studentGrades.ca2,
                  studentGrades.midterm,
                  studentGrades.finals
                )
                const grade = calculateGrade(total)

                return (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.studentId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={studentGrades.ca1}
                        onChange={(e) => handleGradeChange(student.id, 'ca1', parseInt(e.target.value) || 0)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={studentGrades.ca2}
                        onChange={(e) => handleGradeChange(student.id, 'ca2', parseInt(e.target.value) || 0)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={studentGrades.midterm}
                        onChange={(e) => handleGradeChange(student.id, 'midterm', parseInt(e.target.value) || 0)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={studentGrades.finals}
                        onChange={(e) => handleGradeChange(student.id, 'finals', parseInt(e.target.value) || 0)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-lg font-bold text-gray-900">{total}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`px-3 py-1 text-sm font-medium rounded-full ${
                          grade.startsWith('A')
                            ? 'bg-green-100 text-green-800'
                            : grade.startsWith('B')
                            ? 'bg-blue-100 text-blue-800'
                            : grade.startsWith('C')
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {grade}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grade Calculation Info */}
      <div className="card bg-blue-50 border border-blue-200">
        <div className="flex items-start space-x-3">
          <Calculator className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-900 mb-1">Grade Calculation</h3>
            <p className="text-sm text-blue-700">
              Total = (CA1 × 10%) + (CA2 × 10%) + (Midterm × 20%) + (Finals × 60%)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

