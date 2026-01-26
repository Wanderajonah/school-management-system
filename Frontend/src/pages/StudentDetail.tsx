import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Edit, Eye, Mail, Phone, Calendar, BookOpen, GraduationCap } from 'lucide-react'
import api, { getImageUrl } from '../utils/api'

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

type AttendanceSummary = {
  present: number
  absent: number
  late: number
  excused: number
  total: number
  attendanceRate: number
}

type GradeRow = {
  _id: string
  assignment: string
  assignmentType?: string
  grade?: string
  date?: string
  subject?: { name?: string; code?: string }
  class?: { name?: string }
  student?: { studentId?: string; firstName?: string; lastName?: string }
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function Donut({
  percent,
  size = 176,
  stroke = 16,
  trackClassName = 'text-gray-100',
  valueClassName = 'text-primary-600',
}: {
  percent: number
  size?: number
  stroke?: number
  trackClassName?: string
  valueClassName?: string
}) {
  const p = clamp(percent, 0, 100)
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const dash = (p / 100) * c
  const gap = c - dash
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className={trackClassName}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${gap}`}
          className={valueClassName}
        />
      </g>
    </svg>
  )
}

export default function StudentDetail() {
  const { id } = useParams()
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [attendance, setAttendance] = useState<AttendanceSummary | null>(null)
  const [grades, setGrades] = useState<GradeRow[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const run = async () => {
      try {
        setLoading(true)
        setError(null)
        const [sRes, aRes, gRes] = await Promise.all([
          api.getStudent(id),
          api.getStudentAttendance(id),
          api.getGrades({ student: id }),
        ])

        if (sRes?.success) setStudent(sRes.data)
        if (aRes?.success) setAttendance(aRes.data?.summary)
        if (gRes?.success) setGrades(gRes.data || [])
      } catch (e: any) {
        setError(e?.message || 'Failed to load student profile')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [id])

  const fullName = useMemo(() => {
    if (!student) return ''
    return `${student.firstName} ${student.lastName}`.trim()
  }, [student])

  const attendanceRate = attendance?.attendanceRate ?? 0
  const presentLike = (attendance?.present ?? 0) + (attendance?.late ?? 0)
  const total = attendance?.total ?? 0
  const absent = attendance?.absent ?? 0
  const presentPct = total > 0 ? Math.round((presentLike / total) * 100) : 0
  const absentPct = total > 0 ? Math.round((absent / total) * 100) : 0

  const heroImg = student ? getImageUrl(student.photo, 'default-student.jpg') : null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/students" className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Students
        </Link>
        <Link to="/students" className="btn-primary flex items-center space-x-2">
          <Edit className="w-5 h-5" />
          <span>Edit in List</span>
        </Link>
      </div>

      {loading ? (
        <div className="card">
          <div className="py-10 text-center text-gray-500">Loading student profile...</div>
        </div>
      ) : error ? (
        <div className="card">
          <div className="py-10 text-center text-red-600">{error}</div>
        </div>
      ) : !student ? (
        <div className="card">
          <div className="py-10 text-center text-gray-500">Student not found</div>
        </div>
      ) : (
        <>
          {/* Hero + Attendance */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-gradient-to-r from-primary-700 via-primary-600 to-purple-600">
              <div className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                  <div className="flex items-center gap-5">
                    {heroImg ? (
                      <img
                        src={heroImg}
                        alt={fullName}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-white/30"
                        onError={(e) => {
                          const t = e.target as HTMLImageElement
                          t.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/20 flex items-center justify-center ring-4 ring-white/20">
                        <span className="text-3xl font-bold text-white">
                          {student.firstName?.charAt(0) || 'S'}
                        </span>
                      </div>
                    )}
                    <div className="text-white">
                      <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-2xl sm:text-3xl font-bold leading-tight">{fullName}</h1>
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/20">
                          {student.status}
                        </span>
                        {student.class?.name ? (
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/20">
                            {student.class.name}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-white/85 text-sm">Student ID: {student.studentId}</p>
                      <p className="mt-2 text-white/80 text-sm line-clamp-2">
                        {student.address
                          ? [student.address.street, student.address.city, student.address.state, student.address.country]
                              .filter(Boolean)
                              .join(', ')
                          : '—'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/students/${student._id}`}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white text-primary-700 font-semibold hover:bg-white/90 transition"
                    >
                      <Eye className="w-4 h-4" />
                      View Full Profile
                    </Link>
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-2xl bg-white/12 border border-white/15 p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-white text-xl font-bold">{grades.length}</div>
                        <div className="text-white/80 text-xs">Results recorded</div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white/12 border border-white/15 p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-white text-xl font-bold">{student.boardingStatus || 'Day'}</div>
                        <div className="text-white/80 text-xs">Boarding</div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white/12 border border-white/15 p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-white text-xl font-bold">{attendanceRate}%</div>
                        <div className="text-white/80 text-xs">Attendance rate</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Attendance</h2>
              </div>
              <div className="mt-4 flex items-center justify-center">
                <div className="relative">
                  <Donut percent={presentPct} valueClassName="text-primary-600" trackClassName="text-gray-100" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold text-gray-900">{attendanceRate}%</div>
                    <div className="text-xs text-gray-500">This term</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary-600" />
                  <span className="text-gray-600">Present</span>
                  <span className="font-semibold text-gray-900">{presentPct}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="text-gray-600">Absent</span>
                  <span className="font-semibold text-gray-900">{absentPct}%</span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-gray-600">
                <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
                  <div className="text-gray-500">Total days</div>
                  <div className="mt-1 text-sm font-semibold text-gray-900">{total}</div>
                </div>
                <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
                  <div className="text-gray-500">Late / Excused</div>
                  <div className="mt-1 text-sm font-semibold text-gray-900">
                    {(attendance?.late ?? 0) + (attendance?.excused ?? 0)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact + Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="card lg:col-span-2">
              <h2 className="text-lg font-semibold text-gray-900">Student Information</h2>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div className="text-gray-900 font-medium">{student.email}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">Phone</div>
                    <div className="text-gray-900 font-medium">{student.phone || '—'}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">Enrollment Date</div>
                    <div className="text-gray-900 font-medium">
                      {student.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString() : '—'}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">Date of Birth</div>
                    <div className="text-gray-900 font-medium">
                      {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : '—'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900">Guardian</h2>
              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <div className="text-gray-500">Name</div>
                  <div className="font-medium text-gray-900">{student.guardian?.name || '—'}</div>
                </div>
                <div>
                  <div className="text-gray-500">Relationship</div>
                  <div className="font-medium text-gray-900">{student.guardian?.relationship || '—'}</div>
                </div>
                <div>
                  <div className="text-gray-500">Phone</div>
                  <div className="font-medium text-gray-900">{student.guardian?.phone || '—'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* All Exam Results */}
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">All Exam Results</h2>
              <div className="text-sm text-gray-500">{grades.length} records</div>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Exam Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Class
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {grades.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                        No results yet.
                      </td>
                    </tr>
                  ) : (
                    grades.slice(0, 12).map((g) => (
                      <tr key={g._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{g.assignment}</div>
                          {g.assignmentType ? (
                            <div className="text-xs text-gray-500">{g.assignmentType}</div>
                          ) : null}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.studentId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {g.class?.name || student.class?.name || '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {g.subject?.name || '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-100">
                            {g.grade || '—'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {g.date ? new Date(g.date).toLocaleDateString() : '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}



