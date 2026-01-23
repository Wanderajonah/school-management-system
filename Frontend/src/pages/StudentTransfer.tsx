import { useState } from 'react'
import { ArrowRight, Search, FileText } from 'lucide-react'

const students = [
  { id: 1, name: 'John Doe', studentId: 'STU001', class: '10A', status: 'Active' },
  { id: 2, name: 'Jane Smith', studentId: 'STU002', class: '10B', status: 'Active' },
  { id: 3, name: 'Mike Johnson', studentId: 'STU003', class: '9A', status: 'Active' },
]

export default function StudentTransfer() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null)
  const [transferData, setTransferData] = useState({
    transferDate: new Date().toISOString().split('T')[0],
    destinationSchool: '',
    reason: '',
    transferCertificate: false,
  })

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleTransfer = () => {
    if (!selectedStudent) {
      alert('Please select a student')
      return
    }
    // Here you would typically send data to backend
    console.log('Transfer data:', { studentId: selectedStudent, ...transferData })
    alert('Transfer initiated successfully!')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Student Transfer</h1>
        <p className="text-gray-600 mt-1">Transfer students to other schools</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Selection */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Student</h2>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or student ID..."
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
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{student.name}</div>
                    <div className="text-sm text-gray-500">{student.studentId} • {student.class}</div>
                  </div>
                  {selectedStudent === student.id && (
                    <div className="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transfer Details */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Transfer Details</h2>
          {selectedStudent ? (
            <div className="space-y-4">
              <div>
                <label className="label">Transfer Date *</label>
                <input
                  type="date"
                  value={transferData.transferDate}
                  onChange={(e) =>
                    setTransferData({ ...transferData, transferDate: e.target.value })
                  }
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="label">Destination School *</label>
                <input
                  type="text"
                  value={transferData.destinationSchool}
                  onChange={(e) =>
                    setTransferData({ ...transferData, destinationSchool: e.target.value })
                  }
                  className="input-field"
                  placeholder="Enter school name"
                  required
                />
              </div>
              <div>
                <label className="label">Reason for Transfer *</label>
                <textarea
                  value={transferData.reason}
                  onChange={(e) =>
                    setTransferData({ ...transferData, reason: e.target.value })
                  }
                  className="input-field"
                  rows={4}
                  placeholder="Enter reason for transfer..."
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="transferCertificate"
                  checked={transferData.transferCertificate}
                  onChange={(e) =>
                    setTransferData({ ...transferData, transferCertificate: e.target.checked })
                  }
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="transferCertificate" className="text-sm text-gray-700">
                  Generate Transfer Certificate
                </label>
              </div>
              <button onClick={handleTransfer} className="btn-primary w-full flex items-center justify-center space-x-2">
                <ArrowRight className="w-5 h-5" />
                <span>Initiate Transfer</span>
              </button>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>Select a student to view transfer details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

