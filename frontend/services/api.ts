import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// API Configuration
const getBaseURL = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:5000/api';
    }
    return 'http://localhost:5000/api';
  }
  return 'https://your-production-api.com/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
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
  register: (email: string, password: string, name: string) =>
    api.post('/auth/register', { email, password, name }),
  
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  getMe: () =>
    api.get('/auth/me'),
  
  createAnonymous: () =>
    api.post('/auth/anonymous'),
};

// Vendors API
export const vendorsAPI = {
  getNearby: (lat: number, lng: number, radius = 3000, category: string | null = null, search: string | null = null) => {
    const params: any = { lat, lng, radius };
    if (category) params.category = category;
    if (search) params.search = search;
    return api.get('/vendors/nearby', { params });
  },
  
  getById: (id: string) =>
    api.get(`/vendors/${id}`),
  
  submitVendor: (vendorData: any) =>
    api.post('/vendors/user-submissions', vendorData),
  
  getMySubmissions: () =>
    api.get('/vendors/my-submissions'),
  
  getCategories: () =>
    api.get('/vendors/categories/list'),
  
  incrementClick: (id: string) =>
    api.post(`/vendors/${id}/click`),
};

// Admin API
export const adminAPI = {
  getSubmissions: (status = 'pending') =>
    api.get('/admin/submissions', { params: { status } }),
  
  approveSubmission: (id: string) =>
    api.post(`/admin/submissions/${id}/approve`),
  
  rejectSubmission: (id: string, reason = '') =>
    api.post(`/admin/submissions/${id}/reject`, { reason }),
  
  editAndApprove: (id: string, data: any) =>
    api.put(`/admin/submissions/${id}`, data),
  
  createVendor: (vendorData: any) =>
    api.post('/admin/vendors', vendorData),
  
  getAnalytics: () =>
    api.get('/admin/analytics'),
};

export default api;

