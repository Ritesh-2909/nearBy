/**
 * Onboarding Page Utils
 */

import * as Location from 'expo-location';
import { LocationPermissionStatus } from './types';

/**
 * Request location permission
 */
export async function requestLocationPermission(): Promise<LocationPermissionStatus> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      return {
        granted: false,
        message: 'Location permission is required to find nearby vendors',
      };
    }

    return { granted: true };
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return {
      granted: false,
      message: 'Failed to request location permission',
    };
  }
}

/**
 * Get current location
 */
export async function getCurrentLocation(): Promise<{
  success: boolean;
  location?: { latitude: number; longitude: number };
  error?: string;
}> {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      return {
        success: false,
        error: 'Location permission not granted',
      };
    }

    const location = await Location.getCurrentPositionAsync({});
    return {
      success: true,
      location: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
    };
  } catch (error) {
    console.error('Error getting location:', error);
    return {
      success: false,
      error: 'Failed to get current location',
    };
  }
}

