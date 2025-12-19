/**
 * Home Page Utils
 * Utility functions for data fetching, mapping, and transformations
 */

import { Vendor, VendorFilters, VendorListResponse } from './types';
import { vendorsAPI } from '../../services/api';

/**
 * Fetch nearby vendors from API
 */
export async function fetchNearbyVendors(
  latitude: number,
  longitude: number,
  filters: VendorFilters
): Promise<Vendor[]> {
  try {
    const response = await vendorsAPI.getNearby(
      latitude,
      longitude,
      filters.radius || 3000,
      filters.category || null,
      filters.searchQuery || null
    );
    
    return response.data.vendors || [];
  } catch (error) {
    console.error('Error fetching nearby vendors:', error);
    throw error;
  }
}

/**
 * Filter vendors locally (for client-side filtering)
 */
export function filterVendors(
  vendors: Vendor[],
  filters: VendorFilters
): Vendor[] {
  return vendors.filter((vendor) => {
    const matchesSearch = !filters.searchQuery || 
      vendor.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      vendor.description?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      vendor.tags?.some(tag => 
        tag.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    
    const matchesCategory = !filters.category || vendor.category === filters.category;
    
    return matchesSearch && matchesCategory;
  });
}

/**
 * Sort vendors by distance (closest first)
 */
export function sortVendorsByDistance(vendors: Vendor[]): Vendor[] {
  return [...vendors].sort((a, b) => {
    const distanceA = a.distance || Infinity;
    const distanceB = b.distance || Infinity;
    return distanceA - distanceB;
  });
}

/**
 * Format distance for display
 */
export function formatDistance(distanceInMeters: number): string {
  if (distanceInMeters < 1000) {
    return `${Math.round(distanceInMeters)}m away`;
  }
  return `${(distanceInMeters / 1000).toFixed(1)}km away`;
}

/**
 * Get category color (for UI)
 */
export function getCategoryColor(category: string): string {
  const colorMap: Record<string, string> = {
    'Food & Beverages': 'bg-orange-100 text-orange-700',
    'Groceries': 'bg-green-100 text-green-700',
    'Electronics': 'bg-blue-100 text-blue-700',
    'Clothing': 'bg-pink-100 text-pink-700',
    'Hardware': 'bg-gray-100 text-gray-700',
    'Stationery': 'bg-purple-100 text-purple-700',
    'Pharmacy': 'bg-red-100 text-red-700',
    'Other': 'bg-gray-100 text-gray-700',
  };
  
  return colorMap[category] || colorMap['Other'];
}



