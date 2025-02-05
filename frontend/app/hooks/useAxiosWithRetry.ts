import { useState } from 'react';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { api } from '../api/client';
import { RetryConfig } from '@/app/types/hooks/axios';

export const useAxiosWithRetry = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = async <T>(
    config: AxiosRequestConfig,
    retryConfig: RetryConfig = {}
  ): Promise<T> => {
    const {
      maxRetries = 3,
      retryDelay = 1000,
      shouldRetry = (error: AxiosError) => {
        return !error.response || (error.response.status >= 500 && error.response.status < 600);
      }
    } = retryConfig;

    setLoading(true);
    setError(null);

    let retries = 0;

    while (retries < maxRetries) {
      try {
        const response = await api.request<T, AxiosResponse<T>>(config);
        setLoading(false);
        return response.data;
      } catch (err) {
        const error = err as AxiosError;
        
        if (retries === maxRetries - 1 || !shouldRetry(error)) {
          setError(error.message);
          setLoading(false);
          throw error;
        }

        retries++;
        console.log(`リクエスト失敗 (${retries}回目): ${error.message}`);
        
        await new Promise(resolve => 
          setTimeout(resolve, retryDelay * Math.pow(2, retries - 1))
        );
      }
    }

    throw new Error('リトライ回数超過');
  };

  return { request, loading, error };
};
