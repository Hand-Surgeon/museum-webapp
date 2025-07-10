import { IArtworkRepository, ArtworkFilters } from '../repositories/artworkRepository'
import { Artwork } from '../data/types'
import { artworkCache, createCacheKey } from '../utils/cache'

export class GetAllArtworksUseCase {
  constructor(private repository: IArtworkRepository) {}

  async execute(): Promise<Artwork[]> {
    const cacheKey = 'all_artworks'
    
    const cached = artworkCache.get<Artwork[]>(cacheKey)
    if (cached) {
      return cached
    }
    
    const artworks = await this.repository.findAll()
    artworkCache.set(cacheKey, artworks)
    
    return artworks
  }
}

export class GetArtworkByIdUseCase {
  constructor(private repository: IArtworkRepository) {}

  async execute(id: number): Promise<Artwork | null> {
    const cacheKey = createCacheKey('artwork', { id })
    
    const cached = artworkCache.get<Artwork>(cacheKey)
    if (cached) {
      return cached
    }
    
    const artwork = await this.repository.findById(id)
    
    if (artwork) {
      artworkCache.set(cacheKey, artwork)
    }
    
    return artwork
  }
}

export class GetFeaturedArtworksUseCase {
  constructor(private repository: IArtworkRepository) {}

  async execute(): Promise<Artwork[]> {
    const cacheKey = 'featured_artworks'
    
    const cached = artworkCache.get<Artwork[]>(cacheKey)
    if (cached) {
      return cached
    }
    
    const artworks = await this.repository.findFeatured()
    artworkCache.set(cacheKey, artworks)
    
    return artworks
  }
}

export class SearchArtworksUseCase {
  constructor(private repository: IArtworkRepository) {}

  async execute(query: string): Promise<Artwork[]> {
    const cacheKey = createCacheKey('search', { query })
    
    const cached = artworkCache.get<Artwork[]>(cacheKey)
    if (cached) {
      return cached
    }
    
    const artworks = await this.repository.search(query)
    
    // 검색 결과는 짧은 TTL 적용
    artworkCache.set(cacheKey, artworks, 60000) // 1분
    
    return artworks
  }
}

export class FilterArtworksUseCase {
  constructor(private repository: IArtworkRepository) {}

  async execute(filters: ArtworkFilters): Promise<Artwork[]> {
    const cacheKey = createCacheKey('filtered_artworks', filters)
    
    const cached = artworkCache.get<Artwork[]>(cacheKey)
    if (cached) {
      return cached
    }
    
    const artworks = await this.repository.findByFilters(filters)
    
    // 검색이 포함된 필터는 짧은 TTL 적용
    const ttl = filters.search ? 60000 : undefined
    artworkCache.set(cacheKey, artworks, ttl)
    
    return artworks
  }
}

export class GetArtworksByCategoryUseCase {
  constructor(private repository: IArtworkRepository) {}

  async execute(category: string): Promise<Artwork[]> {
    const cacheKey = createCacheKey('artworks_by_category', { category })
    
    const cached = artworkCache.get<Artwork[]>(cacheKey)
    if (cached) {
      return cached
    }
    
    const artworks = await this.repository.findByCategory(category)
    artworkCache.set(cacheKey, artworks)
    
    return artworks
  }
}

export class GetArtworksByMuseumUseCase {
  constructor(private repository: IArtworkRepository) {}

  async execute(museum: string): Promise<Artwork[]> {
    const cacheKey = createCacheKey('artworks_by_museum', { museum })
    
    const cached = artworkCache.get<Artwork[]>(cacheKey)
    if (cached) {
      return cached
    }
    
    const artworks = await this.repository.findByMuseum(museum)
    artworkCache.set(cacheKey, artworks)
    
    return artworks
  }
}

export class GetArtworksByPeriodUseCase {
  constructor(private repository: IArtworkRepository) {}

  async execute(period: string): Promise<Artwork[]> {
    const cacheKey = createCacheKey('artworks_by_period', { period })
    
    const cached = artworkCache.get<Artwork[]>(cacheKey)
    if (cached) {
      return cached
    }
    
    const artworks = await this.repository.findByPeriod(period)
    artworkCache.set(cacheKey, artworks)
    
    return artworks
  }
}

export class InvalidateArtworkCacheUseCase {
  execute(key?: string): void {
    if (key) {
      artworkCache.delete(key)
    } else {
      artworkCache.clear()
    }
  }
}