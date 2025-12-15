/**
 * Submissions Page Utils
 */

import { Submission, SubmissionsResponse } from './types';
import { vendorsAPI } from '../../services/api';

/**
 * Fetch user's submissions
 */
export async function fetchUserSubmissions(): Promise<Submission[]> {
  try {
    const response = await vendorsAPI.getMySubmissions();
    return response.data.vendors || [];
  } catch (error) {
    console.error('Error fetching submissions:', error);
    throw error;
  }
}

/**
 * Get status color for UI
 */
export function getStatusColor(status: Submission['status']): string {
  const colorMap: Record<Submission['status'], string> = {
    approved: '#34C759',
    pending: '#FFA500',
    rejected: '#FF3B30',
  };
  return colorMap[status];
}

/**
 * Format date for display
 */
export function formatSubmissionDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Sort submissions by date (newest first)
 */
export function sortSubmissionsByDate(submissions: Submission[]): Submission[] {
  return [...submissions].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

