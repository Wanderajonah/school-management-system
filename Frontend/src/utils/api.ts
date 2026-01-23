const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get token from localStorage
const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// API request wrapper
const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = getToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Check if response is JSON
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(text || `Server returned ${response.status} ${response.statusText}`);
    }

    if (!response.ok) {
      // Handle 401 Unauthorized - redirect to login
      if (response.status === 401) {
        localStorage.removeItem('token');
        // Only redirect if we're not already on the login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
      throw new Error(data.message || data.error || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      // Check if it's a network error
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('Cannot connect to server. Please make sure the backend is running on http://localhost:5000');
      }
      throw error;
    }
    throw new Error('Network error occurred');
  }
};

// API methods
export const api = {
  // Auth
  login: (email: string, password: string) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (userData: { name: string; email: string; password: string; role?: string }) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  getMe: () => apiRequest('/auth/me'),

  logout: () => apiRequest('/auth/logout'),

  // Students
  getStudents: (params?: { page?: number; limit?: number; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.search) query.append('search', params.search);
    return apiRequest(`/students?${query.toString()}`);
  },

  getStudent: (id: string) => apiRequest(`/students/${id}`),

  createStudent: (studentData: any) =>
    apiRequest('/students', {
      method: 'POST',
      body: JSON.stringify(studentData),
    }),

  updateStudent: (id: string, studentData: any) =>
    apiRequest(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(studentData),
    }),

  deleteStudent: (id: string) =>
    apiRequest(`/students/${id}`, {
      method: 'DELETE',
    }),

  getStudentStats: () => apiRequest('/students/stats'),

  // Teachers
  getTeachers: (params?: { page?: number; limit?: number; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.search) query.append('search', params.search);
    return apiRequest(`/teachers?${query.toString()}`);
  },

  getTeacher: (id: string) => apiRequest(`/teachers/${id}`),

  createTeacher: (teacherData: any) =>
    apiRequest('/teachers', {
      method: 'POST',
      body: JSON.stringify(teacherData),
    }),

  updateTeacher: (id: string, teacherData: any) =>
    apiRequest(`/teachers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(teacherData),
    }),

  deleteTeacher: (id: string) =>
    apiRequest(`/teachers/${id}`, {
      method: 'DELETE',
    }),

  // Classes
  getClasses: (params?: { page?: number; limit?: number; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.search) query.append('search', params.search);
    return apiRequest(`/classes?${query.toString()}`);
  },

  getClass: (id: string) => apiRequest(`/classes/${id}`),

  createClass: (classData: any) =>
    apiRequest('/classes', {
      method: 'POST',
      body: JSON.stringify(classData),
    }),

  updateClass: (id: string, classData: any) =>
    apiRequest(`/classes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(classData),
    }),

  deleteClass: (id: string) =>
    apiRequest(`/classes/${id}`, {
      method: 'DELETE',
    }),

  // Subjects
  getSubjects: (params?: { page?: number; limit?: number; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.search) query.append('search', params.search);
    return apiRequest(`/subjects?${query.toString()}`);
  },

  getSubject: (id: string) => apiRequest(`/subjects/${id}`),

  createSubject: (subjectData: any) =>
    apiRequest('/subjects', {
      method: 'POST',
      body: JSON.stringify(subjectData),
    }),

  updateSubject: (id: string, subjectData: any) =>
    apiRequest(`/subjects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(subjectData),
    }),

  deleteSubject: (id: string) =>
    apiRequest(`/subjects/${id}`, {
      method: 'DELETE',
    }),

  // Attendance
  getAttendance: (params?: { date?: string; class?: string; student?: string }) => {
    const query = new URLSearchParams();
    if (params?.date) query.append('date', params.date);
    if (params?.class) query.append('class', params.class);
    if (params?.student) query.append('student', params.student);
    return apiRequest(`/attendance?${query.toString()}`);
  },

  markAttendance: (attendanceData: any) =>
    apiRequest('/attendance', {
      method: 'POST',
      body: JSON.stringify(attendanceData),
    }),

  updateAttendance: (id: string, attendanceData: any) =>
    apiRequest(`/attendance/${id}`, {
      method: 'PUT',
      body: JSON.stringify(attendanceData),
    }),

  getAttendanceStats: (params?: { class?: string; startDate?: string; endDate?: string }) => {
    const query = new URLSearchParams();
    if (params?.class) query.append('class', params.class);
    if (params?.startDate) query.append('startDate', params.startDate);
    if (params?.endDate) query.append('endDate', params.endDate);
    return apiRequest(`/attendance/stats?${query.toString()}`);
  },

  // Grades
  getGrades: (params?: { student?: string; subject?: string; class?: string }) => {
    const query = new URLSearchParams();
    if (params?.student) query.append('student', params.student);
    if (params?.subject) query.append('subject', params.subject);
    if (params?.class) query.append('class', params.class);
    return apiRequest(`/grades?${query.toString()}`);
  },

  createGrade: (gradeData: any) =>
    apiRequest('/grades', {
      method: 'POST',
      body: JSON.stringify(gradeData),
    }),

  updateGrade: (id: string, gradeData: any) =>
    apiRequest(`/grades/${id}`, {
      method: 'PUT',
      body: JSON.stringify(gradeData),
    }),

  deleteGrade: (id: string) =>
    apiRequest(`/grades/${id}`, {
      method: 'DELETE',
    }),

  // Fees
  getFeeStructures: () => apiRequest('/fees/structure'),

  createFeeStructure: (feeData: any) =>
    apiRequest('/fees/structure', {
      method: 'POST',
      body: JSON.stringify(feeData),
    }),

  getPayments: (params?: { student?: string; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.student) query.append('student', params.student);
    if (params?.status) query.append('status', params.status);
    return apiRequest(`/fees/payments?${query.toString()}`);
  },

  initializePayment: (paymentData: any) =>
    apiRequest('/fees/payments/initialize', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    }),

  recordPayment: (id: string, paymentData: any) =>
    apiRequest(`/fees/payments/${id}/pay`, {
      method: 'POST',
      body: JSON.stringify(paymentData),
    }),

  getFeeStats: () => apiRequest('/fees/stats'),

  // Dashboard
  getDashboardStats: () => apiRequest('/dashboard/stats'),

  getDashboardActivities: () => apiRequest('/dashboard/activities'),

  getAttendanceOverview: () => apiRequest('/dashboard/attendance-overview'),

  getClassDistribution: () => apiRequest('/dashboard/class-distribution'),
};

export default api;



