/**
 * Register Page Utils
 */

import { RegisterFormData, RegisterResponse } from './types';
import { authAPI } from '../../../services/api';

/**
 * Validate register form data
 */
export function validateRegisterForm(data: RegisterFormData): { isValid: boolean; error?: string } {
  if (!data.name || !data.email || !data.password) {
    return { isValid: false, error: 'Please fill in all fields' };
  }

  if (data.name.trim().length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters' };
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
 * Register API call
 */
export async function registerUser(
  formData: RegisterFormData
): Promise<{ success: boolean; data?: RegisterResponse; error?: string }> {
  try {
    const validation = validateRegisterForm(formData);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    const response = await authAPI.register(
      formData.email,
      formData.password,
      formData.name
    );
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || 'Registration failed. Please try again.';
    return {
      success: false,
      error: errorMessage,
    };
  }
}

