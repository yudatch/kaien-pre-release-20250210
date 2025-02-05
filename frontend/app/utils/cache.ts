import { CacheData } from '@/app/types/utils/cache';

const CACHE_DURATION = 5 * 60 * 1000; // 5分

// シンプルなメモリキャッシュの実装
const cache = new Map<string, CacheData>();

export const Cache = {
  set(key: string, data: any): void {
    cache.set(key, {
      data,
      timestamp: Date.now()
    });
  },

  get(key: string): any | null {
    const cached = cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > CACHE_DURATION) {
      cache.delete(key);
      return null;
    }

    return cached.data;
  },

  clear(key?: string): void {
    if (key) {
      cache.delete(key);
    } else {
      cache.clear();
    }
  }
}; 