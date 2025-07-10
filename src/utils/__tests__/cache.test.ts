import { describe, it, expect, beforeEach, vi } from 'vitest'
import { artworkCache, createCacheKey } from '../cache'

describe('SimpleCache', () => {
  beforeEach(() => {
    artworkCache.clear()
  })

  it('stores and retrieves data correctly', () => {
    const testData = { id: 1, name: 'Test' }
    artworkCache.set('test-key', testData)
    
    const retrieved = artworkCache.get('test-key')
    expect(retrieved).toEqual(testData)
  })

  it('returns null for non-existent keys', () => {
    const result = artworkCache.get('non-existent')
    expect(result).toBeNull()
  })

  it('respects TTL and expires data', () => {
    vi.useFakeTimers()
    
    const testData = { id: 1, name: 'Test' }
    artworkCache.set('test-key', testData, 1000) // 1 second TTL
    
    // Data should exist immediately
    expect(artworkCache.get('test-key')).toEqual(testData)
    
    // Advance time by 1.1 seconds
    vi.advanceTimersByTime(1100)
    
    // Data should be expired
    expect(artworkCache.get('test-key')).toBeNull()
    
    vi.useRealTimers()
  })

  it('clears all cached data', () => {
    artworkCache.set('key1', 'data1')
    artworkCache.set('key2', 'data2')
    
    expect(artworkCache.has('key1')).toBe(true)
    expect(artworkCache.has('key2')).toBe(true)
    
    artworkCache.clear()
    
    expect(artworkCache.has('key1')).toBe(false)
    expect(artworkCache.has('key2')).toBe(false)
  })

  it('deletes specific keys', () => {
    artworkCache.set('key1', 'data1')
    artworkCache.set('key2', 'data2')
    
    artworkCache.delete('key1')
    
    expect(artworkCache.has('key1')).toBe(false)
    expect(artworkCache.has('key2')).toBe(true)
  })
})

describe('createCacheKey', () => {
  it('returns prefix when no params provided', () => {
    const key = createCacheKey('test')
    expect(key).toBe('test')
  })

  it('creates consistent keys for same params', () => {
    const params = { category: 'pottery', museum: 'NMK' }
    const key1 = createCacheKey('artworks', params)
    const key2 = createCacheKey('artworks', params)
    
    expect(key1).toBe(key2)
  })

  it('sorts params for consistent keys', () => {
    const params1 = { category: 'pottery', museum: 'NMK' }
    const params2 = { museum: 'NMK', category: 'pottery' }
    
    const key1 = createCacheKey('artworks', params1)
    const key2 = createCacheKey('artworks', params2)
    
    expect(key1).toBe(key2)
  })

  it('includes all params in the key', () => {
    const params = { category: 'pottery', museum: 'NMK', period: 'Joseon' }
    const key = createCacheKey('artworks', params)
    
    expect(key).toContain('category:pottery')
    expect(key).toContain('museum:NMK')
    expect(key).toContain('period:Joseon')
  })
})