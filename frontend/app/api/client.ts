import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { UploadProgressEvent } from '@/app/types/components/features/expenses/forms';

interface ErrorResponse {
  message?: string;
  [key: string]: any;
}

interface ApiRequestConfig extends AxiosRequestConfig {
  onUploadProgress?: (progressEvent: UploadProgressEvent) => void;
}

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const client = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// リクエストインターセプター
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// レスポンスインターセプター
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// FormDataの場合はContent-Typeを自動設定
client.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
  }
  return config;
});

const handleError = (error: AxiosError<ErrorResponse>) => {
  if (error.response?.data) {
    return {
      success: false,
      message: error.response.data.message || 'エラーが発生しました。',
      ...error.response.data
    };
  }
  return {
    success: false,
    message: error.message || 'エラーが発生しました。'
  };
};

export const api = {
  get: async <T>(url: string, params?: any) => {
    try {
      const response = await client.get<T>(url, { params });
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        return { data: handleError(error) };
      }
      throw error;
    }
  },

  post: async <T>(url: string, data?: any, config?: ApiRequestConfig) => {
    try {
      const response = await client.post<T>(url, data, {
        ...config,
        onUploadProgress: config?.onUploadProgress ? 
          (progressEvent) => {
            config.onUploadProgress?.({
              loaded: progressEvent.loaded,
              total: progressEvent.total || 0
            });
          } : undefined
      });
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        return { data: handleError(error) };
      }
      throw error;
    }
  },

  put: async <T>(url: string, data?: any, config?: ApiRequestConfig) => {
    try {
      const response = await client.put<T>(url, data, {
        ...config,
        onUploadProgress: config?.onUploadProgress ? 
          (progressEvent) => {
            config.onUploadProgress?.({
              loaded: progressEvent.loaded,
              total: progressEvent.total || 0
            });
          } : undefined
      });
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        return { data: handleError(error) };
      }
      throw error;
    }
  },

  delete: async <T>(url: string) => {
    try {
      const response = await client.delete<T>(url);
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        return { data: handleError(error) };
      }
      throw error;
    }
  },

  patch: async <T>(url: string, data?: any, config?: ApiRequestConfig) => {
    try {
      const response = await client.patch<T>(url, data, {
        ...config,
        onUploadProgress: config?.onUploadProgress ? 
          (progressEvent) => {
            config.onUploadProgress?.({
              loaded: progressEvent.loaded,
              total: progressEvent.total || 0
            });
          } : undefined
      });
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        return { data: handleError(error) };
      }
      throw error;
    }
  },
};

export default client; 