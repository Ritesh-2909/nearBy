/**
 * Home Page Types
 * Type definitions for the home screen
 */

export interface Vendor {
  _id: string;
  name: string;
  category: string;
  description?: string;
  tags?: string[];
  location: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  address?: string;
  phone?: string;
  openingHours?: Record<string, string>;
  photo?: string;
  distance?: number; // in meters
  status?: 'approved' | 'pending' | 'rejected';
  viewCount?: number;
  clickCount?: number;
  createdAt?: string; // ISO date string
}

export interface VendorListResponse {
  vendors: Vendor[];
}

export interface VendorFilters {
  searchQuery: string;
  category: string | null;
  radius?: number; // in meters, default 3000
}

export type Category = 
  | 'Food & Beverages'
  | 'Groceries'
  | 'Electronics'
  | 'Clothing'
  | 'Hardware'
  | 'Stationery'
  | 'Pharmacy'
  | 'Other';

