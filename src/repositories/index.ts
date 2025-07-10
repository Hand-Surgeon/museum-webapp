import { IArtworkRepository } from './artworkRepository'
import { artworkRepository } from './artworkRepository'
import { localArtworkRepository } from './localArtworkRepository'
import { isUsingSupabase } from '../config/dataSource'

// 환경에 따라 적절한 repository 반환
export function getArtworkRepository(): IArtworkRepository {
  if (isUsingSupabase()) {
    return artworkRepository
  }
  return localArtworkRepository
}

export type { IArtworkRepository, ArtworkFilters } from './artworkRepository'