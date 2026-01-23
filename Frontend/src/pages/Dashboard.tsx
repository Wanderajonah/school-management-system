import { Users, GraduationCap, BookOpen, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../utils/api'
import { formatDistanceToNow } from 'date-fns'

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

// Helper function to format time ago
const formatTimeAgo = (date: Date): string => {
  try {
    return formatDistanceToNow(date, { addSuffix: true })
  } catch {
    return 'Recently'
  }
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    todayAttendance: 0,
  })
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

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

  const dashboardStats = [
    {
      name: 'Total Students',
      value: stats.totalStudents.toLocaleString(),
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'bg-blue-500',
      link: '/students',
    },
    {
      name: 'Total Teachers',
      value: stats.totalTeachers.toLocaleString(),
      change: '+5%',
      changeType: 'positive' as const,
      icon: GraduationCap,
      color: 'bg-green-500',
      link: '/teachers',
    },
    {
      name: 'Active Classes',
      value: stats.totalClasses.toLocaleString(),
      change: '+2',
      changeType: 'positive' as const,
      icon: BookOpen,
      color: 'bg-purple-500',
      link: '/classes',
    },
    {
      name: 'Today\'s Attendance',
      value: `${stats.todayAttendance}%`,
      change: '+2%',
      changeType: 'positive' as const,
      icon: Calendar,
      color: 'bg-orange-500',
      link: '/attendance',
    },
  ]
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
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
                  <p className={`text-sm mt-2 ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
              </div>
            </Link>
          )
        }))}
      </div>

      {/* Charts and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Placeholder */}
        <div className="lg:col-span-2 card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Attendance Overview</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Chart visualization would go here</p>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-4 text-gray-500">Loading activities...</div>
            ) : activities.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No recent activities</div>
            ) : (
              activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b border-gray-200 last:border-0">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/students" className="btn-primary text-center">
            Add Student
          </Link>
          <Link to="/teachers" className="btn-primary text-center">
            Add Teacher
          </Link>
          <Link to="/attendance" className="btn-primary text-center">
            Mark Attendance
          </Link>
          <Link to="/grades" className="btn-primary text-center">
            Enter Grades
          </Link>
        </div>
      </div>
    </div>
  )
}

