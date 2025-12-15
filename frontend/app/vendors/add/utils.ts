/**
 * Add Vendor Page Utils
 */

import { VendorFormData, VendorSubmissionResponse } from './types';
import { vendorsAPI } from '../../../services/api';

/**
 * Validate vendor form data
 */
export function validateVendorForm(data: VendorFormData): { isValid: boolean; error?: string } {
  if (!data.name.trim()) {
    return { isValid: false, error: 'Vendor name is required' };
  }

  if (!data.category) {
    return { isValid: false, error: 'Please select a category' };
  }

  if (!data.location || !data.location.latitude || !data.location.longitude) {
    return { isValid: false, error: 'Please set the vendor location' };
  }

  return { isValid: true };
}

/**
 * Submit vendor to API
 */
export async function submitVendor(
  formData: VendorFormData
): Promise<{ success: boolean; data?: VendorSubmissionResponse; error?: string }> {
  try {
    const validation = validateVendorForm(formData);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    const vendorData = {
      name: formData.name.trim(),
      category: formData.category,
      description: formData.description?.trim() || '',
      tags: formData.tags || [],
      address: formData.address?.trim() || '',
      phone: formData.phone?.trim() || '',
      openingHours: formData.openingHours || {},
      photo: formData.photo || '',
      location: {
        lat: formData.location.latitude,
        lng: formData.location.longitude,
      },
    };

    const response = await vendorsAPI.submitVendor(vendorData);
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || 'Failed to submit vendor. Please try again.';
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Process tags from comma-separated string
 */
export function processTags(tagsString: string): string[] {
  return tagsString
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);
}

