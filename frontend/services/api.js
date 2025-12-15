import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (email, password, name) =>
    api.post('/auth/register', { email, password, name }),
  
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  
  getMe: () =>
    api.get('/auth/me'),
  
  createAnonymous: () =>
    api.post('/auth/anonymous'),
};

// Vendors API
export const vendorsAPI = {
  getNearby: (lat, lng, radius = 3000, category = null, search = null) => {
    const params = { lat, lng, radius };
    if (category) params.category = category;
    if (search) params.search = search;
    return api.get('/vendors/nearby', { params });
  },
  
  getById: (id) =>
    api.get(`/vendors/${id}`),
  
  submitVendor: (vendorData) =>
    api.post('/vendors/user-submissions', vendorData),
  
  getMySubmissions: () =>
    api.get('/vendors/my-submissions'),
  
  getCategories: () =>
    api.get('/vendors/categories/list'),
  
  incrementClick: (id) =>
    api.post(`/vendors/${id}/click`),
};

// Admin API
export const adminAPI = {
  getSubmissions: (status = 'pending') =>
    api.get('/admin/submissions', { params: { status } }),
  
  approveSubmission: (id) =>
    api.post(`/admin/submissions/${id}/approve`),
  
  rejectSubmission: (id, reason = '') =>
    api.post(`/admin/submissions/${id}/reject`, { reason }),
  
  editAndApprove: (id, data) =>
    api.put(`/admin/submissions/${id}`, data),
  
  createVendor: (vendorData) =>
    api.post('/admin/vendors', vendorData),
  
  getAnalytics: () =>
    api.get('/admin/analytics'),
};

export default api;

