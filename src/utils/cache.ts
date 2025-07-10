interface CacheEntry<T> {
  data: T
  timestamp: number
}

class SimpleCache {
  private cache: Map<string, CacheEntry<unknown>> = new Map()
  private defaultTTL: number = 5 * 60 * 1000 // 5분

  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now() + (ttl || this.defaultTTL)
    })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return null
    }

    if (Date.now() > entry.timestamp) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  clear(): void {
    this.cache.clear()
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  has(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false
    
    if (Date.now() > entry.timestamp) {
      this.cache.delete(key)
      return false
    }
    
    return true
  }
}

export const artworkCache = new SimpleCache()

// 캐시 키 생성 헬퍼
export function createCacheKey(prefix: string, params?: Record<string, unknown>): string {
  if (!params) return prefix
  
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}:${params[key]}`)
    .join('_')
  
  return `${prefix}_${sortedParams}`
}