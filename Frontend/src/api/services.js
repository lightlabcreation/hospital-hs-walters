import api from './config';

// Helper to normalize person objects (patients, doctors, users)
// Handles _id/id mismatch and name/firstName/lastName formats
const normalizeData = (item) => {
  if (!item) return item;
  if (typeof item !== 'object') return item;

  const id = item.id || item._id;

  // Handle various name formats
  let firstName = item.firstName || item.first_name || '';
  let lastName = item.lastName || item.last_name || '';
  let name = item.name || '';

  // If we have name but no split names
  if (name && !firstName) {
    const parts = name.split(' ');
    firstName = parts[0];
    lastName = parts.slice(1).join(' ');
  }

  // If we have split names but no full name
  if (!name && firstName) {
    name = `${firstName} ${lastName}`.trim();
  }

  return {
    ...item,
    id,
    firstName,
    lastName,
    name
  };
};

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
  getAll: async (params) => {
    const response = await api.get('/users', { params });
    if (response.data && response.data.data) {
      response.data.data = response.data.data.map(normalizeData);
    }
    return response;
  },
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

// ============================================
// PATIENT API
// ============================================
export const patientAPI = {
  getAll: async (params) => {
    const response = await api.get('/patients', { params });
    if (response.data && response.data.data) {
      response.data.data = response.data.data.map(normalizeData);
    }
    return response;
  },
  getById: async (id) => {
    const response = await api.get(`/patients/${id}`);
    if (response.data) {
      if (response.data.data) response.data.data = normalizeData(response.data.data);
      else response.data = normalizeData(response.data);
    }
    return response;
  },
  create: (data) => api.post('/patients', data),
  update: (id, data) => api.put(`/patients/${id}`, data),
  delete: (id) => api.delete(`/patients/${id}`),
};

// ============================================
// APPOINTMENT API
// ============================================
export const appointmentAPI = {
  getAll: async (params) => {
    const response = await api.get('/appointments', { params });
    if (response.data && response.data.data) {
      response.data.data = response.data.data.map(apt => ({
        ...apt,
        id: apt.id || apt._id,
        patient: normalizeData(apt.patient),
        // Doctor might be nested, but we try to normalize the top level of the doctor object
        doctor: normalizeData(apt.doctor)
      }));
    }
    return response;
  },
  getById: async (id) => {
    const response = await api.get(`/appointments/${id}`);
    if (response.data) {
      const apt = response.data.data || response.data;
      const normalized = {
        ...apt,
        id: apt.id || apt._id,
        patient: normalizeData(apt.patient),
        doctor: normalizeData(apt.doctor)
      };
      if (response.data.data) response.data.data = normalized;
      else response.data = normalized;
    }
    return response;
  },
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
  getAll: async (params) => {
    const response = await api.get('/invoices', { params });
    if (response.data && response.data.data) {
      response.data.data = response.data.data.map(inv => ({
        ...inv,
        id: inv.id || inv._id,
        patient: normalizeData(inv.patient),
        doctor: normalizeData(inv.doctor)
      }));
    }
    return response;
  },
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

    if (response.data.data) {
      response.data.data = response.data.data.map(user => {
        // First normalize the user part
        const normalizedUser = normalizeData(user);

        // Handle nested doctor profile if it exists or use main user fields
        const doctorProfile = user.doctor || {};

        return {
          id: doctorProfile.id || normalizedUser.id, // Prefer doctor ID if available, else user ID
          doctorId: doctorProfile.doctorId,
          department: doctorProfile.department,
          specialization: doctorProfile.specialization,
          phone: doctorProfile.phone || user.phone,
          availability: doctorProfile.availability,
          user: {
            id: normalizedUser.id,
            firstName: normalizedUser.firstName,
            lastName: normalizedUser.lastName,
            email: user.email,
          },
          // Ensure top-level identifiers exist for dropdowns
          name: normalizedUser.name,
          firstName: normalizedUser.firstName,
          lastName: normalizedUser.lastName,

          isActive: user.isActive,
          createdAt: user.createdAt,
        };
      });
    }
    return response;
  },
};
