import { IArtworkRepository } from '../repositories/artworkRepository'
import {
  GetAllArtworksUseCase,
  GetArtworkByIdUseCase,
  GetFeaturedArtworksUseCase,
  SearchArtworksUseCase,
  GetArtworksByCategoryUseCase,
  GetArtworksByPeriodUseCase,
  GetArtworksByMuseumUseCase,
  GetArtworkStats
} from './artworkUseCases'

export interface ArtworkUseCases {
  getAllArtworks: GetAllArtworksUseCase
  getArtworkById: GetArtworkByIdUseCase
  getFeaturedArtworks: GetFeaturedArtworksUseCase
  searchArtworks: SearchArtworksUseCase
  getArtworksByCategory: GetArtworksByCategoryUseCase
  getArtworksByPeriod: GetArtworksByPeriodUseCase
  getArtworksByMuseum: GetArtworksByMuseumUseCase
  getArtworkStats: GetArtworkStats
}

export function createArtworkUseCases(repository: IArtworkRepository): ArtworkUseCases {
  return {
    getAllArtworks: new GetAllArtworksUseCase(repository),
    getArtworkById: new GetArtworkByIdUseCase(repository),
    getFeaturedArtworks: new GetFeaturedArtworksUseCase(repository),
    searchArtworks: new SearchArtworksUseCase(repository),
    getArtworksByCategory: new GetArtworksByCategoryUseCase(repository),
    getArtworksByPeriod: new GetArtworksByPeriodUseCase(repository),
    getArtworksByMuseum: new GetArtworksByMuseumUseCase(repository),
    getArtworkStats: new GetArtworkStats(repository)
  }
}