import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import StudentDetail from './pages/StudentDetail'
import StudentEnrollment from './pages/StudentEnrollment'
import ClassPromotion from './pages/ClassPromotion'
import StudentTransfer from './pages/StudentTransfer'
import Alumni from './pages/Alumni'
import Teachers from './pages/Teachers'
import TeacherForm from './pages/TeacherForm'
import TeacherDetail from './pages/TeacherDetail'
import Classes from './pages/Classes'
import ClassDetail from './pages/ClassDetail'
import Subjects from './pages/Subjects'
import Attendance from './pages/Attendance'
import Grades from './pages/Grades'
import GradeEntry from './pages/GradeEntry'
import ReportCards from './pages/ReportCards'
import Schedule from './pages/Schedule'
import Fees from './pages/Fees'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import { NotificationProvider } from './context/NotificationContext'

function App() {
  return (
    <NotificationProvider>
      <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="students" element={<ProtectedRoute><Students /></ProtectedRoute>} />
          <Route path="students/new" element={<ProtectedRoute><StudentEnrollment /></ProtectedRoute>} />
          <Route path="students/:id" element={<ProtectedRoute><StudentDetail /></ProtectedRoute>} />
          <Route path="students/promotion" element={<ProtectedRoute requireAdmin><ClassPromotion /></ProtectedRoute>} />
          <Route path="students/transfer" element={<ProtectedRoute requireAdmin><StudentTransfer /></ProtectedRoute>} />
          <Route path="students/alumni" element={<ProtectedRoute><Alumni /></ProtectedRoute>} />
          <Route path="teachers" element={<ProtectedRoute><Teachers /></ProtectedRoute>} />
          <Route path="teachers/new" element={<ProtectedRoute requireAdmin><TeacherForm /></ProtectedRoute>} />
          <Route path="teachers/:id" element={<ProtectedRoute><TeacherDetail /></ProtectedRoute>} />
          <Route path="classes" element={<ProtectedRoute><Classes /></ProtectedRoute>} />
          <Route path="classes/:id" element={<ProtectedRoute><ClassDetail /></ProtectedRoute>} />
          <Route path="subjects" element={<ProtectedRoute><Subjects /></ProtectedRoute>} />
          <Route path="attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
          <Route path="grades" element={<ProtectedRoute><Grades /></ProtectedRoute>} />
          <Route path="grades/entry" element={<ProtectedRoute><GradeEntry /></ProtectedRoute>} />
          <Route path="grades/report-cards" element={<ProtectedRoute><ReportCards /></ProtectedRoute>} />
          <Route path="schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
          <Route path="fees" element={<ProtectedRoute><Fees /></ProtectedRoute>} />
          <Route path="reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        </Route>
      </Routes>
    </Router>
    </NotificationProvider>
  )
}

export default App




