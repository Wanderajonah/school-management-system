import { useState } from 'react'
import { FileText, Download, Printer, Search } from 'lucide-react'

const students = [
  {
    id: 1,
    name: 'John Doe',
    studentId: 'STU001',
    class: 'S1',
    term: 'First Term',
    year: '2023/2024',
  },
  {
    id: 2,
    name: 'Jane Smith',
    studentId: 'STU002',
    class: 'S1',
    term: 'First Term',
    year: '2023/2024',
  },
]

const mockReportCard = {
  student: {
    name: 'John Doe',
    studentId: 'STU001',
    class: 'S1',
    term: 'First Term',
    year: '2023/2024',
  },
  subjects: [
    { name: 'Mathematics', ca1: 85, ca2: 88, midterm: 82, finals: 90, total: 87, grade: 'A', position: 5 },
    { name: 'Science', ca1: 90, ca2: 92, midterm: 88, finals: 95, total: 92, grade: 'A+', position: 2 },
    { name: 'English', ca1: 78, ca2: 80, midterm: 75, finals: 82, total: 79, grade: 'B+', position: 8 },
    { name: 'History', ca1: 88, ca2: 85, midterm: 90, finals: 87, total: 87, grade: 'A', position: 3 },
  ],
  attendance: {
    totalDays: 90,
    present: 85,
    absent: 5,
    percentage: 94.4,
  },
  summary: {
    totalScore: 345,
    average: 86.25,
    overallGrade: 'A',
    classPosition: 5,
    streamPosition: 12,
  },
  teacherRemarks: 'John has shown excellent progress this term. He is diligent and participates actively in class.',
  headTeacherRemarks: 'Keep up the good work. Continue to maintain this standard.',
}

export default function ReportCards() {
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleGeneratePDF = () => {
    // Here you would typically generate PDF
    alert('PDF generation would be implemented here')
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Report Cards</h1>
        <p className="text-gray-600 mt-1">Generate and view student report cards</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Selection */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Student</h2>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                onClick={() => setSelectedStudent(student.id)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedStudent === student.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-gray-900">{student.name}</div>
                <div className="text-sm text-gray-500">{student.studentId} • {student.class}</div>
                <div className="text-xs text-gray-400 mt-1">{student.term} - {student.year}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Report Card Preview */}
        <div className="lg:col-span-2">
          {selectedStudent ? (
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Report Card</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleGeneratePDF}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                  <button onClick={handlePrint} className="btn-primary flex items-center space-x-2">
                    <Printer className="w-4 h-4" />
                    <span>Print</span>
                  </button>
                </div>
              </div>

              {/* Report Card Content */}
              <div className="space-y-6 print:space-y-4">
                {/* Header */}
                <div className="text-center border-b-2 border-gray-200 pb-4">
                  <h1 className="text-2xl font-bold text-gray-900">EDUMANAGE SCHOOL</h1>
                  <p className="text-gray-600 mt-1">STUDENT REPORT CARD</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {mockReportCard.student.term} - {mockReportCard.student.year}
                  </p>
                </div>

                {/* Student Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Student Name</p>
                    <p className="font-medium text-gray-900">{mockReportCard.student.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Student ID</p>
                    <p className="font-medium text-gray-900">{mockReportCard.student.studentId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Class</p>
                    <p className="font-medium text-gray-900">{mockReportCard.student.class}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Term</p>
                    <p className="font-medium text-gray-900">{mockReportCard.student.term}</p>
                  </div>
                </div>

                {/* Grades Table */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">Subject</th>
                        <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium">CA1</th>
                        <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium">CA2</th>
                        <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium">Midterm</th>
                        <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium">Finals</th>
                        <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium">Total</th>
                        <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium">Grade</th>
                        <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium">Position</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockReportCard.subjects.map((subject) => (
                        <tr key={subject.name}>
                          <td className="border border-gray-300 px-4 py-2 text-sm">{subject.name}</td>
                          <td className="border border-gray-300 px-4 py-2 text-center text-sm">{subject.ca1}</td>
                          <td className="border border-gray-300 px-4 py-2 text-center text-sm">{subject.ca2}</td>
                          <td className="border border-gray-300 px-4 py-2 text-center text-sm">{subject.midterm}</td>
                          <td className="border border-gray-300 px-4 py-2 text-center text-sm">{subject.finals}</td>
                          <td className="border border-gray-300 px-4 py-2 text-center text-sm font-medium">{subject.total}</td>
                          <td className="border border-gray-300 px-4 py-2 text-center text-sm font-medium">{subject.grade}</td>
                          <td className="border border-gray-300 px-4 py-2 text-center text-sm">{subject.position}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500">Total Score</p>
                    <p className="text-lg font-bold text-gray-900">{mockReportCard.summary.totalScore}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Average</p>
                    <p className="text-lg font-bold text-gray-900">{mockReportCard.summary.average}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Overall Grade</p>
                    <p className="text-lg font-bold text-green-600">{mockReportCard.summary.overallGrade}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Class Position</p>
                    <p className="text-lg font-bold text-gray-900">{mockReportCard.summary.classPosition}</p>
                  </div>
                </div>

                {/* Attendance Summary */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Attendance Summary</h3>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Total Days</p>
                      <p className="font-medium">{mockReportCard.attendance.totalDays}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Present</p>
                      <p className="font-medium text-green-600">{mockReportCard.attendance.present}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Absent</p>
                      <p className="font-medium text-red-600">{mockReportCard.attendance.absent}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Percentage</p>
                      <p className="font-medium">{mockReportCard.attendance.percentage}%</p>
                    </div>
                  </div>
                </div>

                {/* Remarks */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Teacher's Remarks</h3>
                    <p className="text-sm text-gray-700 border border-gray-200 rounded p-3 bg-gray-50">
                      {mockReportCard.teacherRemarks}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Head Teacher's Remarks</h3>
                    <p className="text-sm text-gray-700 border border-gray-200 rounded p-3 bg-gray-50">
                      {mockReportCard.headTeacherRemarks}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card text-center py-12">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">Select a student to view report card</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

