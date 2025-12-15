// API Configuration
// For iOS Simulator: use 'http://localhost:5000/api'
// For Android Emulator: use 'http://10.0.2.2:5000/api'
// For Physical Device: use 'http://<your-computer-ip>:5000/api'
import { Platform } from 'react-native';

const getBaseURL = () => {
  if (__DEV__) {
    // For Android emulator, use 10.0.2.2 instead of localhost
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:5000/api';
    }
    // For iOS simulator and web, use localhost
    return 'http://localhost:5000/api';
  }
  return 'https://your-production-api.com/api';
};

export const API_BASE_URL = getBaseURL();

export const CATEGORIES = [
  'Food & Beverages',
  'Groceries',
  'Electronics',
  'Clothing',
  'Hardware',
  'Stationery',
  'Pharmacy',
  'Other'
];

export const MAX_SUBMISSIONS_PER_DAY = 5;

