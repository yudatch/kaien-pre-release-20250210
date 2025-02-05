import { LoginCredentials, AuthResponse } from '../types/auth';
import client from './client';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await client.post<AuthResponse>('/auth/login', credentials);
      if (response.data.success && response.data.data?.token) {
        localStorage.setItem('token', response.data.data.token);
        client.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;
      }
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'ログインに失敗しました。'
      };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    delete client.defaults.headers.common['Authorization'];
  },

  verifyToken: async (): Promise<AuthResponse> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('トークンが見つかりません。');
      }

      const response = await client.get<AuthResponse>('/auth/verify');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'トークンの検証に失敗しました。'
      };
    }
  }
}; 