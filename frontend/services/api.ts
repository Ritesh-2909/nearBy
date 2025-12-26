import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// API Configuration
// Base URL: http://172.16.11.55:5005/api (as per API documentation)
// For USB debugging: Use ADB port forwarding (localhost works after adb reverse)
// For WiFi: Use your computer's local IP address
const USE_ADB_FORWARDING = false; // Set to true if using USB debugging with ADB port forwarding
const BACKEND_IP = '172.16.11.55'; // Backend server IP address
const BACKEND_PORT = 5005; // Backend server port

const getBaseURL = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      if (USE_ADB_FORWARDING) {
        // When using ADB port forwarding, localhost works on the device
        // Make sure to run: adb reverse tcp:5005 tcp:5005
        return 'http://localhost:5005/api';
      } else {
        // For WiFi/LAN connection, use the backend server IP
        // Make sure your phone and computer are on the same network
        return `http://${BACKEND_IP}:${BACKEND_PORT}/api`;
      }
    }
    // iOS simulator uses localhost (or can use BACKEND_IP if needed)
    return `http://${BACKEND_IP}:${BACKEND_PORT}/api`;
  }
  return 'https://your-production-api.com/api';
};

const baseURL = getBaseURL();

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
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
    console.log('❌ [API] Request interceptor error:', error);
    console.log('❌ [API] Request error details:', {
      message: error.message,
      code: error.code,
      config: error.config,
    });
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const requestURL = error.config?.url || 'unknown';
    const status = error.response?.status || 'no-status';
    const statusText = error.response?.statusText || 'no-status-text';
    
    console.log('❌ [API] Response error for:', requestURL);
    console.log('❌ [API] Error status:', status, statusText);
    console.log('❌ [API] Error response data:', error.response?.data);
    console.log('❌ [API] Error message:', error.message);
    console.log('❌ [API] Error code:', error.code);
    
    if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
      console.log('🌐 [API] Network error detected - check connectivity');
      console.log('🌐 [API] Base URL was:', error.config?.baseURL);
    }
    
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth data
      console.log('🔐 [API] 401 Unauthorized - Token expired or invalid');
      console.log('🧹 [API] Clearing auth data...');
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      console.log('✅ [API] Auth data cleared - user needs to login again');
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (email: string, password: string, name: string) => {
    console.log('📡 [AuthAPI] Register request:', { email, name, passwordLength: password.length });
    return api.post('/auth/register', { email, password, name });
  },

  login: (email: string, password: string) => {
    console.log('📡 [AuthAPI] Login request URL:', `${baseURL}/auth/login`);
    console.log('📡 [AuthAPI] Login request payload:', { email, passwordLength: password.length });
    console.log('📡 [AuthAPI] Full request details:', {
      method: 'POST',
      url: `${baseURL}/auth/login`,
      headers: { 'Content-Type': 'application/json' },
      data: { email, password },
    });
    return api.post('/auth/login', { email, password });
  },

  getMe: () => {
    console.log('📡 [AuthAPI] GetMe request URL:', `${baseURL}/auth/me`);
    return api.get('/auth/me');
  },

  createAnonymous: () => {
    console.log('📡 [AuthAPI] CreateAnonymous request');
    return api.post('/auth/anonymous');
  },
};

// Vendors API
export const vendorsAPI = {
  getNearby: (lat: number, lng: number, radius = 50000, category: string | null = null, search: string | null = null) => {
    const params: any = { lat, lng, radius };
    if (category) params.category = category;
    if (search) params.search = search;
    return api.get('/vendors/nearby', { params });
  },

  getAll: (lat: number, lng: number, category: string | null = null, search: string | null = null) => {
    const params: any = { lat, lng };
    if (category) params.category = category;
    if (search) params.search = search;
    return api.get('/vendors/all', { params });
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


