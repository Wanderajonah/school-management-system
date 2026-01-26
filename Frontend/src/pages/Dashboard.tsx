import { Users, GraduationCap, Grid3x3, DollarSign, Plus, MoreVertical, Eye, ChevronLeft, ChevronRight, Edit2, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api, { getImageUrl } from '../utils/api'
import { formatDistanceToNow } from 'date-fns'
import EventFormModal from '../components/EventFormModal'
import { useNotifications } from '../context/NotificationContext'

interface DashboardStats {
  totalStudents: number
  totalTeachers: number
  totalClasses: number
  todayAttendance: number
}

interface Activity {
  id: string
  type: string
  action: string
  name: string
  time: string
}

type AttendanceOverviewPoint = {
  date: string
  present: number
  absent: number
  late: number
  total: number
  rate: number
}

// Helper function to format time ago
const formatTimeAgo = (date: Date): string => {
  try {
    return formatDistanceToNow(date, { addSuffix: true })
  } catch {
    return 'Recently'
  }
}

export default function Dashboard() {
  const { addNotification } = useNotifications()
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    todayAttendance: 0,
  })
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [attendanceDays, setAttendanceDays] = useState<7 | 14 | 30>(14)
  const [attendanceSeries, setAttendanceSeries] = useState<AttendanceOverviewPoint[]>([])
  const [attendanceLoading, setAttendanceLoading] = useState(true)
  const [genderData, setGenderData] = useState<{
    Male: number
    Female: number
    Other: number
    total: number
    malePercentage: number
    femalePercentage: number
    otherPercentage: number
  } | null>(null)
  const [genderLoading, setGenderLoading] = useState(true)
  const [events, setEvents] = useState<any[]>([])
  const [eventsLoading, setEventsLoading] = useState(true)
  const [showEventModal, setShowEventModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<any | null>(null)
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const [statsData, activitiesData] = await Promise.all([
          api.getDashboardStats(),
          api.getDashboardActivities(),
        ])

        if (statsData.success) {
          // Map the API response structure to our state
          setStats({
            totalStudents: statsData.data?.students?.total || 0,
            totalTeachers: statsData.data?.teachers?.total || 0,
            totalClasses: statsData.data?.classes?.active || statsData.data?.classes?.total || 0,
            todayAttendance: statsData.data?.attendance?.todayRate || 0,
          })
        }

        if (activitiesData.success) {
          // Format activities with time display
          const formattedActivities = (activitiesData.data || []).map((activity: any) => ({
            id: activity.timestamp || activity.id || Math.random().toString(),
            type: activity.type,
            action: activity.action,
            name: activity.name,
            time: activity.timestamp
              ? formatTimeAgo(new Date(activity.timestamp))
              : activity.time || 'Recently',
          }))
          setActivities(formattedActivities)
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        // Keep default values on error
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  useEffect(() => {
    const fetchAttendanceOverview = async () => {
      try {
        setAttendanceLoading(true)
        const res = await api.getAttendanceOverview({ days: attendanceDays })
        if (res.success) {
          setAttendanceSeries(res.data || [])
        } else {
          setAttendanceSeries([])
        }
      } catch (e) {
        console.error('Error fetching attendance overview:', e)
        setAttendanceSeries([])
      } finally {
        setAttendanceLoading(false)
      }
    }
    fetchAttendanceOverview()
  }, [attendanceDays])

  useEffect(() => {
    const fetchGenderDistribution = async () => {
      try {
        console.log('Fetching gender distribution...')
        setGenderLoading(true)
        const res = await api.getGenderDistribution()
        console.log('Gender distribution response:', res)
        if (res.success) {
          setGenderData(res.data)
        } else {
          console.warn('Gender distribution response not successful:', res)
          setGenderData(null)
        }
      } catch (e) {
        console.error('Error fetching gender distribution:', e)
        setGenderData(null)
      } finally {
        setGenderLoading(false)
      }
    }
    fetchGenderDistribution()
  }, [])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setEventsLoading(true)
        const response = await api.getEvents({ limit: 10 })
        if (response.success) {
          setEvents(response.data || [])
        }
      } catch (error) {
        console.error('Error fetching events:', error)
        setEvents([])
      } finally {
        setEventsLoading(false)
      }
    }

    fetchEvents()
  }, [showEventModal, editingEvent])

  const handleEditEvent = (event: any) => {
    setEditingEvent(event)
    setShowEventModal(true)
  }

  const handleDeleteEvent = async (eventId: string) => {
    try {
      setDeleting(true)
      const response = await api.deleteEvent(eventId)
      if (response.success) {
        // Remove event from local state
        setEvents((prev) => prev.filter((e) => (e._id || e.id) !== eventId))
        setDeleteEventId(null)
        addNotification({
          title: 'Success',
          message: 'Event deleted successfully',
          type: 'success',
        })
      }
    } catch (error: any) {
      console.error('Error deleting event:', error)
      addNotification({
        title: 'Error',
        message: error.message || 'Failed to delete event',
        type: 'error',
      })
    } finally {
      setDeleting(false)
    }
  }

  const handleCloseEventModal = () => {
    setShowEventModal(false)
    setEditingEvent(null)
  }

  const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))

  const isoDay = (d: Date) => {
    const x = new Date(d)
    x.setHours(0, 0, 0, 0)
    return x.toISOString().slice(0, 10)
  }

  const buildEmptySeries = (days: number): AttendanceOverviewPoint[] => {
    const out: AttendanceOverviewPoint[] = []
    const end = new Date()
    end.setHours(0, 0, 0, 0)
    for (let i = days - 1; i >= 0; i--) {
      const dt = new Date(end)
      dt.setDate(dt.getDate() - i)
      out.push({ date: isoDay(dt), present: 0, absent: 0, late: 0, total: 0, rate: 0 })
    }
    return out
  }

  const filledAttendanceSeries = (() => {
    const base = buildEmptySeries(attendanceDays)
    const byDate = new Map<string, AttendanceOverviewPoint>()
    attendanceSeries.forEach((p) => byDate.set(p.date, p))
    return base.map((b) => byDate.get(b.date) || b)
  })()

  const isAttendanceAllZero = filledAttendanceSeries.every((d) => (d.total || 0) === 0)

  const AttendanceChart = ({
    data,
    height = 260,
  }: {
    data: AttendanceOverviewPoint[]
    height?: number
  }) => {
    const width = 920
    const padding = { t: 18, r: 18, b: 36, l: 42 }
    const innerW = width - padding.l - padding.r
    const innerH = height - padding.t - padding.b

    const maxTotal = Math.max(1, ...data.map((d) => d.total || 0))
    const stepX = data.length > 1 ? innerW / (data.length - 1) : innerW

    const x = (i: number) => padding.l + i * stepX
    const yCount = (v: number) => padding.t + (1 - v / maxTotal) * innerH
    const yRate = (p: number) => padding.t + (1 - clamp(p, 0, 100) / 100) * innerH

    const mkLine = (get: (d: AttendanceOverviewPoint) => number) =>
      data
        .map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${yCount(get(d)).toFixed(1)}`)
        .join(' ')

    const mkRate = () =>
      data
        .map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${yRate(d.rate).toFixed(1)}`)
        .join(' ')

    const labelEvery = data.length <= 8 ? 1 : data.length <= 14 ? 2 : 4
    const formatDay = (iso: string) => {
      const dt = new Date(iso)
      if (Number.isNaN(dt.getTime())) return iso
      return dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    }

    const presentLine = mkLine((d) => d.present)
    const absentLine = mkLine((d) => d.absent)
    const lateLine = mkLine((d) => d.late)
    const rateLine = mkRate()

    return (
      <div className="w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          {/* Grid */}
          {[0.25, 0.5, 0.75, 1].map((p) => {
            const yy = padding.t + (1 - p) * innerH
            return (
              <g key={p}>
                <line
                  x1={padding.l}
                  x2={width - padding.r}
                  y1={yy}
                  y2={yy}
                  stroke="currentColor"
                  className="text-gray-100"
                />
                <text
                  x={padding.l - 8}
                  y={yy + 4}
                  textAnchor="end"
                  className="fill-gray-400"
                  fontSize="11"
                >
                  {Math.round(p * maxTotal)}
                </text>
              </g>
            )
          })}

          {/* Lines */}
          <path
            d={presentLine}
            fill="none"
            stroke="#7c3aed"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity={isAttendanceAllZero ? 0.35 : 1}
          />
          <path
            d={absentLine}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity={isAttendanceAllZero ? 0.35 : 1}
          />
          <path
            d={lateLine}
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity={isAttendanceAllZero ? 0.35 : 1}
          />
          <path
            d={rateLine}
            fill="none"
            stroke="#111827"
            strokeWidth="2"
            strokeDasharray="5 6"
            opacity={isAttendanceAllZero ? 0.25 : 1}
          />

          {/* Points + X labels */}
          {data.map((d, i) => {
            const cx = x(i)
            const showLabel = i % labelEvery === 0 || i === data.length - 1
            return (
              <g key={d.date}>
                <circle cx={cx} cy={yRate(d.rate)} r="3" fill="#111827" />
                <circle cx={cx} cy={yCount(d.present)} r="3" fill="#7c3aed" />
                <circle cx={cx} cy={yCount(d.absent)} r="3" fill="#f59e0b" />
                <circle cx={cx} cy={yCount(d.late)} r="3" fill="#0ea5e9" />

                {showLabel ? (
                  <text
                    x={cx}
                    y={height - 12}
                    textAnchor="middle"
                    className="fill-gray-400"
                    fontSize="11"
                  >
                    {formatDay(d.date)}
                  </text>
                ) : null}
              </g>
            )
          })}
        </svg>

        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-600" />
            <span className="text-gray-600">Present</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-gray-600">Absent</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <span className="text-gray-600">Late</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-0.5 bg-gray-900" />
            <span className="text-gray-600">Attendance rate (%)</span>
          </div>
        </div>
      </div>
    )
  }

  const GenderDonutChart = ({
    data,
    size = 220,
  }: {
    data: { Male: number; Female: number; Other: number; total: number }
    size?: number
  }) => {
    const centerX = size / 2
    const centerY = size / 2
    const radius = size * 0.35
    const innerRadius = size * 0.22
    const strokeWidth = 2

    // Calculate angles for donut slices
    const total = data.Male + data.Female + (data.Other || 0)
    if (total === 0) {
      return (
        <div className="flex items-center justify-center h-[220px] text-gray-500">
          No data available
        </div>
      )
    }

    // Use Male as "Boys" and Female as "Girls" for the image design
    const boys = data.Male
    const girls = data.Female
    const boysAngle = (boys / total) * 360
    const girlsAngle = (girls / total) * 360

    // Helper function to create donut arc path
    const createDonutArc = (startAngle: number, endAngle: number, outerR: number, innerR: number) => {
      const start = (startAngle * Math.PI) / 180
      const end = (endAngle * Math.PI) / 180
      
      const x1 = centerX + outerR * Math.cos(start)
      const y1 = centerY + outerR * Math.sin(start)
      const x2 = centerX + outerR * Math.cos(end)
      const y2 = centerY + outerR * Math.sin(end)
      
      const x3 = centerX + innerR * Math.cos(end)
      const y3 = centerY + innerR * Math.sin(end)
      const x4 = centerX + innerR * Math.cos(start)
      const y4 = centerY + innerR * Math.sin(start)
      
      const largeArc = endAngle - startAngle > 180 ? 1 : 0
      
      return `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4} Z`
    }

    let currentAngle = -90 // Start from top
    const boysPath = createDonutArc(currentAngle, currentAngle + boysAngle, radius, innerRadius)
    currentAngle += boysAngle
    const girlsPath = createDonutArc(currentAngle, currentAngle + girlsAngle, radius, innerRadius)

    return (
      <div className="w-full flex flex-col items-center">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto max-w-[220px]">
          {/* Boys slice - blue */}
          <path
            d={boysPath}
            fill="#3b82f6"
            stroke="white"
            strokeWidth={strokeWidth}
          />
          {/* Girls slice - teal */}
          <path
            d={girlsPath}
            fill="#14b8a6"
            stroke="white"
            strokeWidth={strokeWidth}
          />
          {/* Center text */}
          <text
            x={centerX}
            y={centerY}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-gray-900"
            fontSize="32"
            fontWeight="bold"
          >
            {total.toLocaleString()}
          </text>
        </svg>

        <div className="mt-6 flex flex-col gap-3 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm text-gray-700">Boys: {boys.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-teal-500" />
              <span className="text-sm text-gray-700">Girls: {girls.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Weekly Attendance Line Chart Component
  const WeeklyAttendanceChart = ({ data }: { data: AttendanceOverviewPoint[] }) => {
    // Get last 6 days (Monday to Saturday) or pad with empty data if less than 6 days
    const weekData = data.length >= 6 ? data.slice(-6) : [...Array(6 - data.length).fill({ present: 0, absent: 0, late: 0, rate: 0 }), ...data]
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    
    const maxTotal = Math.max(1, ...weekData.map(d => Math.max((d.present || 0), (d.absent || 0), (d.late || 0))))
    const width = 600
    const height = 260
    const padding = { t: 18, r: 18, b: 36, l: 42 }
    const innerW = width - padding.l - padding.r
    const innerH = height - padding.t - padding.b

    const stepX = weekData.length > 1 ? innerW / (weekData.length - 1) : innerW
    const x = (i: number) => padding.l + i * stepX
    const yCount = (v: number) => padding.t + (1 - v / maxTotal) * innerH
    const yRate = (p: number) => padding.t + (1 - clamp(p, 0, 100) / 100) * innerH

    const mkLine = (get: (d: AttendanceOverviewPoint) => number) =>
      weekData
        .map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${yCount(get(d)).toFixed(1)}`)
        .join(' ')

    const mkRate = () =>
      weekData
        .map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${yRate(d.rate).toFixed(1)}`)
        .join(' ')

    const presentLine = mkLine((d) => d.present || 0)
    const absentLine = mkLine((d) => d.absent || 0)
    const lateLine = mkLine((d) => d.late || 0)
    const rateLine = mkRate()

    const formatDay = (dayIndex: number) => {
      return days[dayIndex] || days[dayIndex % days.length]
    }

    return (
      <div className="w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          {/* Grid */}
          {[0.25, 0.5, 0.75, 1].map((p) => {
            const yy = padding.t + (1 - p) * innerH
            return (
              <g key={p}>
                <line
                  x1={padding.l}
                  x2={width - padding.r}
                  y1={yy}
                  y2={yy}
                  stroke="currentColor"
                  className="text-gray-100"
                />
                <text
                  x={padding.l - 8}
                  y={yy + 4}
                  textAnchor="end"
                  className="fill-gray-400"
                  fontSize="11"
                >
                  {Math.round(p * maxTotal)}
                </text>
              </g>
            )
          })}

          {/* Lines - using previous colors */}
          <path
            d={presentLine}
            fill="none"
            stroke="#7c3aed"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d={absentLine}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d={lateLine}
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d={rateLine}
            fill="none"
            stroke="#111827"
            strokeWidth="2"
            strokeDasharray="5 6"
          />

          {/* Points + X labels */}
          {weekData.map((d, i) => {
            const cx = x(i)
            return (
              <g key={i}>
                <circle cx={cx} cy={yRate(d.rate || 0)} r="3" fill="#111827" />
                <circle cx={cx} cy={yCount(d.present || 0)} r="3" fill="#7c3aed" />
                <circle cx={cx} cy={yCount(d.absent || 0)} r="3" fill="#f59e0b" />
                <circle cx={cx} cy={yCount(d.late || 0)} r="3" fill="#0ea5e9" />

                <text
                  x={cx}
                  y={height - 12}
                  textAnchor="middle"
                  className="fill-gray-400"
                  fontSize="11"
                >
                  {formatDay(i)}
                </text>
              </g>
            )
          })}
        </svg>

        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-600" />
            <span className="text-gray-600">Present</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-gray-600">Absent</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <span className="text-gray-600">Late</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-0.5 bg-gray-900" />
            <span className="text-gray-600">Attendance rate (%)</span>
          </div>
        </div>
      </div>
    )
  }

  // Event Calendar Component
  const EventCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [calendarEvents, setCalendarEvents] = useState<any[]>([])
    const [calendarLoading, setCalendarLoading] = useState(true)

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    // Convert Sunday (0) to 7, then adjust for Monday start
    let startingDayOfWeek = firstDay.getDay()
    startingDayOfWeek = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1

    const weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    // Fetch events for the current month
    useEffect(() => {
      const fetchCalendarEvents = async () => {
        try {
          setCalendarLoading(true)
          const startDate = new Date(year, month, 1).toISOString().split('T')[0]
          const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0]
          
          const response = await api.getEventsForCalendar({ startDate, endDate })
          if (response.success) {
            setCalendarEvents(response.data || [])
          }
        } catch (error) {
          console.error('Error fetching calendar events:', error)
          setCalendarEvents([])
        } finally {
          setCalendarLoading(false)
        }
      }

      fetchCalendarEvents()
    }, [year, month, showEventModal])

    const navigateMonth = (direction: 'prev' | 'next') => {
      setCurrentDate((prev) => {
        const newDate = new Date(prev)
        if (direction === 'prev') {
          newDate.setMonth(prev.getMonth() - 1)
        } else {
          newDate.setMonth(prev.getMonth() + 1)
        }
        return newDate
      })
    }

    const getEventsForDay = (day: number) => {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      return calendarEvents.filter((event) => {
        const eventDate = new Date(event.date).toISOString().split('T')[0]
        return eventDate === dateStr
      })
    }

    const today = new Date()
    const isToday = (day: number) => {
      return (
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear()
      )
    }

    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h3 className="text-sm font-semibold text-gray-900">
            {monthNames[month]} {year}
          </h3>
          <button
            onClick={() => navigateMonth('next')}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-gray-600 py-1">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: startingDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const dayEvents = getEventsForDay(day)
            const hasEvents = dayEvents.length > 0
            const todayClass = isToday(day) ? 'ring-2 ring-blue-500' : ''

            return (
              <div
                key={day}
                className={`aspect-square flex flex-col items-center justify-center text-sm relative ${
                  hasEvents
                    ? 'bg-blue-500 text-white rounded-full font-semibold'
                    : `text-gray-700 hover:bg-gray-100 rounded ${todayClass}`
                }`}
                title={hasEvents ? dayEvents.map((e) => e.title).join(', ') : ''}
              >
                <span>{day}</span>
                {hasEvents && dayEvents.length > 1 && (
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-600 rounded-full text-[8px] flex items-center justify-center">
                    {dayEvents.length}
                  </span>
                )}
              </div>
            )
          })}
        </div>
        {calendarLoading && (
          <div className="text-center text-xs text-gray-500 mt-2">Loading events...</div>
        )}
      </div>
    )
  }

  // Format event date for display
  const formatEventDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    } catch {
      return dateString
    }
  }

  // Get image URL for event
  const getEventImageUrl = (imagePath?: string) => {
    if (!imagePath) return 'https://via.placeholder.com/60x60?text=Event'
    if (imagePath.startsWith('http')) return imagePath
    const url = getImageUrl(imagePath)
    return url || 'https://via.placeholder.com/60x60?text=Event'
  }

  const dashboardStats = [
    {
      name: 'Total Students',
      value: stats.totalStudents.toLocaleString(),
      icon: GraduationCap,
      color: 'bg-blue-500',
      link: '/students',
    },
    {
      name: 'Total Teachers',
      value: stats.totalTeachers.toLocaleString(),
      icon: Users,
      color: 'bg-blue-500',
      link: '/teachers',
    },
    {
      name: 'Total Employee',
      value: '600', // Mock data - you can add this to API later
      icon: Grid3x3,
      color: 'bg-blue-500',
      link: '/teachers',
    },
    {
      name: 'Total Earnings',
      value: '$10,000', // Mock data - you can add this to API later
      icon: DollarSign,
      color: 'bg-blue-500',
      link: '/fees',
    },
  ]
  return (
    <div className="space-y-6">
      {/* Stats Grid - Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-4 text-center py-8 text-gray-500">Loading dashboard data...</div>
        ) : (
          dashboardStats.map((stat) => {
            const Icon = stat.icon
            return (
              <Link
                key={stat.name}
                to={stat.link}
                className="card hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                </div>
              </Link>
            )
          })
        )}
      </div>

      {/* Middle Row - Gender Chart and Attendance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Total Students by Gender - Donut Chart */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Total Students by Gender</h2>
          {genderLoading ? (
            <div className="h-[300px] flex items-center justify-center">
              <p className="text-gray-500 text-sm">Loading gender data...</p>
            </div>
          ) : genderData ? (
            <GenderDonutChart data={genderData} />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500 text-sm">
              No gender data available
            </div>
          )}
        </div>

        {/* Attendance - Weekly Bar Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Attendance</h2>
            <div className="flex items-center gap-3">
              <select className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>This week</option>
                <option>This month</option>
              </select>
              <select className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Class 10</option>
                <option>All Classes</option>
              </select>
            </div>
          </div>
          {attendanceLoading ? (
            <div className="h-[260px] flex items-center justify-center">
              <p className="text-gray-500 text-sm">Loading attendance chart...</p>
            </div>
          ) : (
            <WeeklyAttendanceChart data={filledAttendanceSeries} />
          )}
        </div>
      </div>

      {/* Bottom Row - Notice Board and Event Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notice Board */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Notice Board</h2>
            <button
              onClick={() => setShowEventModal(true)}
              className="text-blue-500 hover:text-blue-600 transition-colors"
              title="Add new event"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            {eventsLoading ? (
              <div className="text-center py-8 text-gray-500 text-sm">Loading events...</div>
            ) : events.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                No events yet. Click the + button to add one.
              </div>
            ) : (
              events.map((event) => (
                <div key={event._id || event.id} className="flex items-start gap-4 pb-4 border-b border-gray-200 last:border-0 last:pb-0 group">
                  <img
                    src={getEventImageUrl(event.image)}
                    alt={event.title}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/60x60?text=Event'
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                      {event.title}
                    </h3>
                    {event.description && (
                      <p className="text-xs text-gray-600 mb-2 line-clamp-1">{event.description}</p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{formatEventDate(event.date)}</span>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{event.views || 0} views</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="p-1.5 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit event"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteEventId(event._id || event.id)}
                          className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Event Calendar */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Event Calendar</h2>
            <button className="text-gray-500 hover:text-gray-600">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          <EventCalendar />
        </div>
      </div>

      {/* Event Form Modal */}
      <EventFormModal
        isOpen={showEventModal}
        onClose={handleCloseEventModal}
        onEventAdded={() => {
          // Events will be refetched automatically via useEffect
          setEditingEvent(null)
        }}
        event={editingEvent}
      />

      {/* Delete Confirmation Modal */}
      {deleteEventId && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => !deleting && setDeleteEventId(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Event</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this event? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteEventId(null)}
                disabled={deleting}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteEvent(deleteEventId)}
                disabled={deleting}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

