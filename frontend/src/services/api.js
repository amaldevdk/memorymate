import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('memorymate_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },
  demoLogin: async (role) => {
    const res = await api.post('/auth/demo-login', { role });
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  }
};

export const patientService = {
  getActive: async () => {
    const res = await api.get('/patient');
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/patient/${id}`);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/patient/${id}`, data);
    return res.data;
  }
};

export const familyService = {
  getAll: async (patientId) => {
    const res = await api.get('/family', { params: { patientId } });
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/family', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/family/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/family/${id}`);
    return res.data;
  }
};

export const memoryService = {
  getAll: async (patientId, category) => {
    const res = await api.get('/memories', { params: { patientId, category } });
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/memories', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/memories/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/memories/${id}`);
    return res.data;
  }
};

export const reminderService = {
  getAll: async (patientId) => {
    const res = await api.get('/reminders', { params: { patientId } });
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/reminders', data);
    return res.data;
  },
  toggleComplete: async (id, completed) => {
    const res = await api.put(`/reminders/${id}/complete`, { completed });
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/reminders/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/reminders/${id}`);
    return res.data;
  }
};

export const routineService = {
  getAll: async (patientId) => {
    const res = await api.get('/routines', { params: { patientId } });
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/routines', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/routines/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/routines/${id}`);
    return res.data;
  }
};

export const emergencyService = {
  getContacts: async (patientId) => {
    const res = await api.get('/emergency/contacts', { params: { patientId } });
    return res.data;
  },
  createContact: async (data) => {
    const res = await api.post('/emergency/contacts', data);
    return res.data;
  },
  deleteContact: async (id) => {
    const res = await api.delete(`/emergency/contacts/${id}`);
    return res.data;
  },
  triggerSOS: async (payload) => {
    const res = await api.post('/emergency/trigger', payload);
    return res.data;
  }
};

export const notificationService = {
  getAll: async (patientId) => {
    const res = await api.get('/notifications', { params: { patientId } });
    return res.data;
  },
  markRead: async (id) => {
    const res = await api.put(`/notifications/${id}/read`);
    return res.data;
  }
};

export const settingsService = {
  exportData: async (patientId) => {
    const res = await api.get('/settings/export', {
      params: { patientId },
      responseType: 'blob'
    });
    return res.data;
  },
  updateConsent: async (data) => {
    const res = await api.post('/settings/consent', data);
    return res.data;
  }
};

export default api;
