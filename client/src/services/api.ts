import axios from 'axios';
import { handleMockApi } from './mockApi';

export const isCloudEnvironment = (): boolean => {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  return (
    host.includes('vercel.app') ||
    host.includes('netlify.app') ||
    host.includes('github.io') ||
    host.includes('onrender.com') ||
    (host !== 'localhost' && host !== '127.0.0.1' && !import.meta.env.VITE_API_URL)
  );
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Configure Axios adapter to provide automatic seamless cloud demo fallback
api.defaults.adapter = async (config) => {
  // If hosted on cloud without explicit external API URL, use instant in-browser mock engine
  if (isCloudEnvironment() && !import.meta.env.VITE_API_URL) {
    return handleMockApi(config);
  }

  try {
    const rawAdapter: any = axios.getAdapter(axios.defaults.adapter as any);
    const res: any = await rawAdapter(config);
    // If the server returned HTML (e.g. Vercel SPA rewrite fallback returning index.html for API paths)
    if (
      typeof res?.data === 'string' &&
      res.data.trim().toLowerCase().startsWith('<!doctype html')
    ) {
      console.warn('[HMS Bridge] Received HTML response for API request; falling back to mock engine.');
      return handleMockApi(config);
    }
    return res;
  } catch (err: any) {
    // If network failure, connection refused, 404, or 50x server errors:
    console.warn('[HMS Bridge] Network request failed; routing to mock engine.', err?.message);
    return handleMockApi(config);
  }
};

// Request interceptor: attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hms_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If unauthorized and not already on /login or /register, clear token and redirect
      if (
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/register')
      ) {
        localStorage.removeItem('hms_auth_token');
        localStorage.removeItem('hms_auth_user');
        window.location.href = '/login?expired=1';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// API Service Functions
export const authService = {
  login: (credentials: { email: string; password: string }) => api.post('/auth/login', credentials),
  register: (userData: any) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  changePassword: (data: { currentPassword: string; newPassword: string }) => api.post('/auth/change-password', data),
};

export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
  getCharts: () => api.get('/dashboard/charts'),
  getRecentActivity: () => api.get('/dashboard/recent-activity'),
};

export const studentService = {
  getStudents: (params?: any) => api.get('/students', { params }),
  getStudentById: (id: number | string) => api.get(`/students/${id}`),
  createStudent: (data: any) => api.post('/students', data),
  updateStudent: (id: number | string, data: any) => api.put(`/students/${id}`, data),
  deleteStudent: (id: number | string) => api.delete(`/students/${id}`),
  exportCsvUrl: () => '/api/students/export/csv',
};

export const hostelService = {
  getHostels: () => api.get('/hostels'),
  createHostel: (data: any) => api.post('/hostels', data),
  updateHostel: (id: number | string, data: any) => api.put(`/hostels/${id}`, data),
};

export const roomService = {
  getRooms: (params?: any) => api.get('/rooms', { params }),
  getRoomById: (id: number | string) => api.get(`/rooms/${id}`),
  createRoom: (data: any) => api.post('/rooms', data),
  updateRoom: (id: number | string, data: any) => api.put(`/rooms/${id}`, data),
};

export const allocationService = {
  getAllocations: (params?: any) => api.get('/allocations', { params }),
  allocateRoom: (data: any) => api.post('/allocations', data),
  checkOut: (id: number | string, data?: any) => api.post(`/allocations/${id}/check-out`, data),
  transferRoom: (id: number | string, data: any) => api.post(`/allocations/${id}/transfer`, data),
};

export const feeService = {
  getFees: (params?: any) => api.get('/fees', { params }),
  createFee: (data: any) => api.post('/fees', data),
};

export const paymentService = {
  getPayments: (params?: any) => api.get('/payments', { params }),
  recordPayment: (data: any) => api.post('/payments', data),
  getReceiptDetails: (id: number | string) => api.get(`/payments/receipt/${id}`),
  exportCsvUrl: () => '/api/payments/export/csv',
};

export const visitorService = {
  getVisitorLogs: (params?: any) => api.get('/visitors', { params }),
  checkIn: (data: any) => api.post('/visitors/check-in', data),
  checkOut: (id: number | string, data?: any) => api.post(`/visitors/${id}/check-out`, data),
  exportCsvUrl: () => '/api/visitors/export/csv',
};

export const maintenanceService = {
  getRequests: (params?: any) => api.get('/maintenance', { params }),
  createRequest: (data: any) => api.post('/maintenance', data),
  updateRequest: (id: number | string, data: any) => api.put(`/maintenance/${id}`, data),
};

export const attendanceService = {
  getAttendance: (params?: any) => api.get('/attendance', { params }),
  markAttendance: (data: any) => api.post('/attendance', data),
  markBulkAttendance: (data: any) => api.post('/attendance/bulk', data),
};

export const reportService = {
  getOccupancyReport: () => api.get('/reports/occupancy'),
  getFeeReport: (params?: any) => api.get('/reports/fees', { params }),
  getMaintenanceReport: () => api.get('/reports/maintenance'),
  exportCsvUrl: (type: string) => `/api/reports/export/${type}`,
};

export const userService = {
  getUsers: (params?: any) => api.get('/users', { params }),
  createUser: (data: any) => api.post('/users', data),
  updateUserStatus: (id: number | string, data: any) => api.put(`/users/${id}`, data),
  resetPassword: (id: number | string, data: any) => api.post(`/users/${id}/reset-password`, data),
};
