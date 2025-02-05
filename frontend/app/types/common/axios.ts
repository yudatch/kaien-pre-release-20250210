import { AxiosError } from 'axios';

export interface RetryConfig {
  maxRetries?: number;
  retryDelay?: number;
  shouldRetry?: (error: AxiosError) => boolean;
} 