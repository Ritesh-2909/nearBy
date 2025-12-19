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
  if (!data.email || !data.password) {
    return { isValid: false, error: 'Please fill in all fields' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  if (data.password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters' };
  }

  return { isValid: true };
}

/**
 * Login API call
 */
export async function loginUser(
  credentials: LoginFormData
): Promise<{ success: boolean; data?: LoginResponse; error?: string }> {
  try {
    const validation = validateLoginForm(credentials);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    const response = await authAPI.login(credentials.email, credentials.password);
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || 'Login failed. Please try again.';
    return {
      success: false,
      error: errorMessage,
    };
  }
}



