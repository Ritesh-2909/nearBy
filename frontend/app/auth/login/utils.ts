/**
 * Login Page Utils
 * API calls and data transformations for login
 */

import { LoginFormData, LoginResponse, LoginError } from './types';
import { authAPI } from '../../../services/api';

/**
 * Validate login form data
 */
export function validateLoginForm(data: LoginFormData): { isValid: boolean; error?: string } {
  console.log('🔍 [LoginUtils] Starting form validation');
  console.log('📧 [LoginUtils] Email provided:', !!data.email);
  console.log('🔑 [LoginUtils] Password provided:', !!data.password);
  
  if (!data.email || !data.password) {
    console.log('❌ [LoginUtils] Validation failed: Missing fields');
    return { isValid: false, error: 'Please fill in all fields' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    console.log('❌ [LoginUtils] Validation failed: Invalid email format');
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  console.log('✅ [LoginUtils] Email format valid');

  if (data.password.length < 6) {
    console.log('❌ [LoginUtils] Validation failed: Password too short');
    return { isValid: false, error: 'Password must be at least 6 characters' };
  }
  console.log('✅ [LoginUtils] Password length valid');

  console.log('✅ [LoginUtils] All validations passed');
  return { isValid: true };
}

/**
 * Login API call
 */
export async function loginUser(
  credentials: LoginFormData
): Promise<{ success: boolean; data?: LoginResponse; error?: string }> {
  console.log('🚀 [LoginUtils] loginUser function called');
  console.log('📧 [LoginUtils] Email:', credentials.email);
  console.log('🔑 [LoginUtils] Password length:', credentials.password.length);
  console.log('🔑 [LoginUtils] Password value (first 3 chars):', credentials.password.substring(0, 3));
  
  try {
    console.log('🔍 [LoginUtils] Validating form data...');
    const validation = validateLoginForm(credentials);
    if (!validation.isValid) {
      console.log('❌ [LoginUtils] Validation failed:', validation.error);
      return { success: false, error: validation.error };
    }
    console.log('✅ [LoginUtils] Form validation passed');

    console.log('📡 [LoginUtils] Making API call to /auth/login...');
    console.log('📡 [LoginUtils] Request payload:', {
      email: credentials.email,
      password: credentials.password, // Logging full password for debugging - REMOVE IN PRODUCTION
      passwordLength: credentials.password.length,
    });
    
    const startTime = Date.now();
    const response = await authAPI.login(credentials.email, credentials.password);
    const duration = Date.now() - startTime;
    console.log(`✅ [LoginUtils] API call successful (${duration}ms)`);
    console.log('📥 [LoginUtils] Full response:', JSON.stringify(response.data, null, 2));
    console.log('📥 [LoginUtils] Response data:', {
      hasToken: !!response.data?.token,
      hasUser: !!response.data?.user,
      userId: response.data?.user?.id || response.data?.user?._id,
      userName: response.data?.user?.name,
      userEmail: response.data?.user?.email,
      tokenLength: response.data?.token?.length,
    });
    
    if (!response.data?.token) {
      console.log('⚠️ [LoginUtils] No token in response!');
      return {
        success: false,
        error: 'No token received from server',
      };
    }
    
    if (!response.data?.user) {
      console.log('⚠️ [LoginUtils] No user data in response!');
      return {
        success: false,
        error: 'No user data received from server',
      };
    }
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.log('❌ [LoginUtils] API call failed');
    console.log('⚠️ [LoginUtils] Error type:', error.name);
    console.log('⚠️ [LoginUtils] Error message:', error.message);
    console.log('⚠️ [LoginUtils] Error code:', error.code);
    console.log('⚠️ [LoginUtils] Response status:', error.response?.status);
    console.log('⚠️ [LoginUtils] Response status text:', error.response?.statusText);
    console.log('⚠️ [LoginUtils] Response data:', JSON.stringify(error.response?.data, null, 2));
    console.log('⚠️ [LoginUtils] Request config:', {
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      method: error.config?.method,
      data: error.config?.data,
    });
    
    // More detailed error messages
    let errorMessage = 'Login failed. Please try again.';
    
    if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error') || error.message?.includes('network')) {
      errorMessage = 'Network error. Please check your internet connection and ensure the backend server is running.';
      console.log('🌐 [LoginUtils] Network error detected');
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      errorMessage = 'Cannot connect to server. Please check if the backend is running on port 5005.';
      console.log('🔌 [LoginUtils] Connection refused/timeout');
    } else if (error.response?.status === 401) {
      errorMessage = error.response?.data?.error || 'Invalid email or password';
      console.log('🔐 [LoginUtils] Authentication failed');
    } else if (error.response?.status === 400) {
      errorMessage = error.response?.data?.error || error.response?.data?.errors?.[0]?.msg || 'Invalid request';
      console.log('📝 [LoginUtils] Bad request');
    } else if (error.response?.status === 500) {
      errorMessage = 'Server error. Please try again later.';
      console.log('⚠️ [LoginUtils] Server error');
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    }
    
    console.log('📝 [LoginUtils] Final error message:', errorMessage);
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}



