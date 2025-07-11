import { IArtworkRepository, ArtworkFilters } from './artworkRepository'
import { Artwork } from '../data/types'
import artworksData from '../data/artworks.json'

export class LocalArtworkRepository implements IArtworkRepository {
  private artworks: Artwork[] = artworksData as Artwork[]

  async findAll(): Promise<Artwork[]> {
    return Promise.resolve([...this.artworks])
  }

  async findById(id: number): Promise<Artwork | null> {
    const artwork = this.artworks.find((a) => a.id === id)
    return Promise.resolve(artwork || null)
  }

  async findFeatured(): Promise<Artwork[]> {
    return Promise.resolve(this.artworks.filter((a) => a.featured))
  }

  async findByCategory(category: string): Promise<Artwork[]> {
    return Promise.resolve(this.artworks.filter((a) => a.category === category))
  }

  async findByMuseum(museum: string): Promise<Artwork[]> {
    return Promise.resolve(this.artworks.filter((a) => a.museum === museum))
  }

  async findByPeriod(period: string): Promise<Artwork[]> {
    return Promise.resolve(this.artworks.filter((a) => a.period === period))
  }

  async search(query: string): Promise<Artwork[]> {
    const lowerQuery = query.toLowerCase()
    return Promise.resolve(
      this.artworks.filter(
        (a) =>
          a.title.toLowerCase().includes(lowerQuery) ||
          a.description.toLowerCase().includes(lowerQuery) ||
          (a.titleEn && a.titleEn.toLowerCase().includes(lowerQuery))
      )
    )
  }

  async findByFilters(filters: ArtworkFilters): Promise<Artwork[]> {
    let filtered = [...this.artworks]

    if (filters.category) {
      filtered = filtered.filter((a) => a.category === filters.category)
    }

    if (filters.period) {
      filtered = filtered.filter((a) => a.period === filters.period)
    }

    if (filters.museum) {
      filtered = filtered.filter((a) => a.museum === filters.museum)
    }

    if (filters.featured !== undefined) {
      filtered = filtered.filter((a) => a.featured === filters.featured)
    }

    if (filters.search) {
      const lowerSearch = filters.search.toLowerCase()
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(lowerSearch) ||
          a.description.toLowerCase().includes(lowerSearch)
      )
    }

    return Promise.resolve(filtered)
  }
}

export const localArtworkRepository = new LocalArtworkRepository()
