/**
 * Submissions Page Types
 */

export interface Submission {
  _id: string;
  name: string;
  category: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  moderatedAt?: string;
  rejectionReason?: string;
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
}

export interface SubmissionsResponse {
  vendors: Submission[];
}



