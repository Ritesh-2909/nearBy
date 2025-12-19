/**
 * Add Vendor Page Types
 */

export interface VendorFormData {
  name: string;
  category: string;
  description?: string;
  tags?: string[];
  address?: string;
  phone?: string;
  openingHours?: Record<string, string>;
  photo?: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface VendorSubmissionResponse {
  vendor: {
    _id: string;
    name: string;
    category: string;
    status: 'pending' | 'approved' | 'rejected';
  };
  message: string;
  duplicate?: boolean;
  existingVendor?: {
    _id: string;
    name: string;
  };
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



