import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// API Configuration
// For USB debugging: Use ADB port forwarding (localhost works after adb reverse)
// For WiFi: Use your computer's local IP address
const USE_ADB_FORWARDING = true; // Set to true if using USB debugging with ADB port forwarding
const DEVICE_IP = '172.16.7.155'; // Only used if USE_ADB_FORWARDING is false

const getBaseURL = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      if (USE_ADB_FORWARDING) {
        // When using ADB port forwarding, localhost works on the device
        return 'http://localhost:5005/api';
      } else {
        // For WiFi connection, use your computer's IP
        // Make sure your phone and computer are on the same WiFi network
        return `http://${DEVICE_IP}:5005/api`;
      }
    }
    // iOS simulator uses localhost
    return 'http://localhost:5005/api';
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


