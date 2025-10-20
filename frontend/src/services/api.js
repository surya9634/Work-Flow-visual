import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (stored separately)
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear all auth data
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Onboarding API
export const onboardingAPI = {
  complete: (data) => api.post('/onboarding/complete', data),
  uploadDocument: (formData) => api.post('/onboarding/upload-document', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getStatus: () => api.get('/onboarding/status'),
};

// Campaign API
export const campaignAPI = {
  getAll: () => api.get('/campaigns'),
  getOne: (id) => api.get(`/campaigns/${id}`),
  create: (data) => api.post('/campaigns', data),
  update: (id, data) => api.put(`/campaigns/${id}`, data),
  delete: (id) => api.delete(`/campaigns/${id}`),
  updateStatus: (id, status) => api.patch(`/campaigns/${id}/status`, { status }),
  getStats: (id) => api.get(`/campaigns/${id}/stats`),
};

// Integration API
export const integrationAPI = {
  getAll: () => api.get('/integrations'),
  connectFacebook: (data) => api.post('/integrations/facebook/connect', data),
  disconnectFacebook: () => api.post('/integrations/facebook/disconnect'),
  getFacebookAuthUrl: () => api.get('/integrations/facebook/auth'),
  getStatus: (platform) => api.get(`/integrations/${platform}/status`),
};

// Chat API
export const chatAPI = {
  getAll: (params) => api.get('/chats', { params }),
  getOne: (id) => api.get(`/chats/${id}`),
  sendMessage: (id, data) => api.post(`/chats/${id}/messages`, data),
  updateStatus: (id, status) => api.patch(`/chats/${id}/status`, { status }),
  recordConversion: (id, data) => api.post(`/chats/${id}/conversion`, data),
  getStats: () => api.get('/chats/stats/overview'),
};

// Analytics API
export const analyticsAPI = {
  getDashboard: (params) => api.get('/analytics/dashboard', { params }),
  getCampaigns: () => api.get('/analytics/campaigns'),
  getRealTime: () => api.get('/analytics/real-time'),
  getPerformance: (params) => api.get('/analytics/performance', { params }),
  getHourly: () => api.get('/analytics/hourly'),
};

// AI API
export const aiAPI = {
  chatWithLeo: (data) => api.post('/ai/leo/chat', data),
  getGlobalStatus: () => api.get('/ai/global/status'),
  retrainGlobal: () => api.post('/ai/global/retrain'),
  analyzeConversation: (data) => api.post('/ai/analyze-conversation', data),
  generateResponse: (data) => api.post('/ai/generate-response', data),
};

export default api;
