/**
 * Register Page Types
 */

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
  };
}

export interface RegisterError {
  error: string;
  errors?: Array<{ msg: string; param: string }>;
}

