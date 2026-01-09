import api from './config';

// ============================================
// AUTH API
// ============================================
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

// ============================================
// USER API
// ============================================
export const userAPI = {
  getProfile: () => api.get('/users/me'),
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

// ============================================
// PATIENT API
// ============================================
export const patientAPI = {
  getAll: (params) => api.get('/patients', { params }),
  getById: (id) => api.get(`/patients/${id}`),
  create: (data) => api.post('/patients', data),
  update: (id, data) => api.put(`/patients/${id}`, data),
  delete: (id) => api.delete(`/patients/${id}`),
};

// ============================================
// APPOINTMENT API
// ============================================
export const appointmentAPI = {
  getAll: (params) => api.get('/appointments', { params }),
  getById: (id) => api.get(`/appointments/${id}`),
  create: (data) => api.post('/appointments', data),
  update: (id, data) => api.put(`/appointments/${id}`, data),
  delete: (id) => api.delete(`/appointments/${id}`),
  getDoctorSchedule: (doctorId, params) => api.get(`/appointments/schedule/${doctorId}`, { params }),
};

// ============================================
// PRESCRIPTION API
// ============================================
export const prescriptionAPI = {
  getAll: (params) => api.get('/prescriptions', { params }),
  getById: (id) => api.get(`/prescriptions/${id}`),
  create: (data) => api.post('/prescriptions', data),
  update: (id, data) => api.put(`/prescriptions/${id}`, data),
  delete: (id) => api.delete(`/prescriptions/${id}`),
};

// ============================================
// LAB RESULTS API
// ============================================
export const labAPI = {
  getAll: (params) => api.get('/lab-results', { params }),
  getById: (id) => api.get(`/lab-results/${id}`),
  create: (data) => api.post('/lab-results', data),
  update: (id, data) => api.put(`/lab-results/${id}`, data),
};

// ============================================
// MEDICAL NOTES API
// ============================================
export const medicalNotesAPI = {
  getAll: (params) => api.get('/medical-notes', { params }),
  getById: (id) => api.get(`/medical-notes/${id}`),
  create: (data) => api.post('/medical-notes', data),
  update: (id, data) => api.put(`/medical-notes/${id}`, data),
};

// ============================================
// BILLING/INVOICE API
// ============================================
export const billingAPI = {
  getAll: (params) => api.get('/invoices', { params }),
  getById: (id) => api.get(`/invoices/${id}`),
  create: (data) => api.post('/invoices', data),
  update: (id, data) => api.put(`/invoices/${id}`, data),
  getSummary: () => api.get('/invoices/summary'),
};

// ============================================
// REPORTS API
// ============================================
export const reportsAPI = {
  getOverview: () => api.get('/reports/overview'),
  getPatientStats: () => api.get('/reports/patients'),
  getAppointmentStats: () => api.get('/reports/appointments'),
  getRevenueStats: () => api.get('/reports/revenue'),
  getMetrics: () => api.get('/reports/metrics'),
};

// ============================================
// DOCTORS API (uses users API internally)
// ============================================
export const doctorAPI = {
  getAll: async (params) => {
    const response = await api.get('/users', { params: { ...params, role: 'doctor' } });
    // Transform data to match frontend expectations
    if (response.data.data) {
      response.data.data = response.data.data.map(user => ({
        id: user.doctor?.id || user.id,
        doctorId: user.doctor?.doctorId,
        department: user.doctor?.department,
        specialization: user.doctor?.specialization,
        phone: user.doctor?.phone,
        availability: user.doctor?.availability,
        user: {
          id: user.id,
          firstName: user.name?.split(' ')[0] || user.name,
          lastName: user.name?.split(' ').slice(1).join(' ') || '',
          email: user.email,
        },
        isActive: user.isActive,
        createdAt: user.createdAt,
      }));
    }
    return response;
  },
};
