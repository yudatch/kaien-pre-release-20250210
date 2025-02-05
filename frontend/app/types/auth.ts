export interface User {
  userId: number;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  permissions: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    token: string;
    user: User;
    permissions: string[];
  };
  message?: string;
} 