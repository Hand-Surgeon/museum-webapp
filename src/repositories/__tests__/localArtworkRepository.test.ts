import { describe, it, expect, beforeEach } from 'vitest'
import { LocalArtworkRepository } from '../localArtworkRepository'
import { Artwork } from '../../data/types'

describe('LocalArtworkRepository', () => {
  let repository: LocalArtworkRepository
  
  beforeEach(() => {
    repository = new LocalArtworkRepository()
  })

  it('returns all artworks', async () => {
    const artworks = await repository.findAll()
    expect(Array.isArray(artworks)).toBe(true)
    expect(artworks.length).toBeGreaterThan(0)
  })

  it('finds artwork by id', async () => {
    const artworks = await repository.findAll()
    const firstArtwork = artworks[0]
    
    const found = await repository.findById(firstArtwork.id)
    expect(found).toEqual(firstArtwork)
  })

  it('returns null for non-existent id', async () => {
    const found = await repository.findById(999999)
    expect(found).toBeNull()
  })

  it('finds featured artworks', async () => {
    const featured = await repository.findFeatured()
    expect(Array.isArray(featured)).toBe(true)
    
    featured.forEach(artwork => {
      expect(artwork.featured).toBe(true)
    })
  })

  it('finds artworks by category', async () => {
    const category = '도자기'
    const artworks = await repository.findByCategory(category)
    
    artworks.forEach(artwork => {
      expect(artwork.category).toBe(category)
    })
  })

  it('finds artworks by museum', async () => {
    const museum = '국립중앙박물관'
    const artworks = await repository.findByMuseum(museum)
    
    artworks.forEach(artwork => {
      expect(artwork.museum).toBe(museum)
    })
  })

  it('finds artworks by period', async () => {
    const period = '조선시대'
    const artworks = await repository.findByPeriod(period)
    
    artworks.forEach(artwork => {
      expect(artwork.period).toBe(period)
    })
  })

  it('searches artworks by query', async () => {
    const query = '청자'
    const results = await repository.search(query)
    
    expect(results.length).toBeGreaterThan(0)
    results.forEach(artwork => {
      const hasQuery = 
        artwork.title.includes(query) ||
        artwork.description.includes(query) ||
        (artwork.titleEn && artwork.titleEn.toLowerCase().includes(query.toLowerCase()))
      
      expect(hasQuery).toBe(true)
    })
  })

  it('filters by multiple criteria', async () => {
    const filters = {
      category: '도자기',
      period: '고려시대',
      featured: true
    }
    
    const results = await repository.findByFilters(filters)
    
    results.forEach(artwork => {
      expect(artwork.category).toBe(filters.category)
      expect(artwork.period).toBe(filters.period)
      expect(artwork.featured).toBe(filters.featured)
    })
  })

  it('handles empty search results', async () => {
    const results = await repository.search('xyz123notfound')
    expect(results).toEqual([])
  })
})