/**
 * Login Page Types
 */

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
  };
}

export interface LoginError {
  error: string;
  errors?: Array<{ msg: string; param: string }>;
}

