import { Artwork } from '../data/types'
import { getArtworkRepository } from '../repositories'
import {
  GetAllArtworksUseCase,
  GetArtworkByIdUseCase,
  GetFeaturedArtworksUseCase,
  GetArtworksByCategoryUseCase,
  GetArtworksByMuseumUseCase,
  GetArtworksByPeriodUseCase,
  SearchArtworksUseCase,
  FilterArtworksUseCase,
  InvalidateArtworkCacheUseCase,
} from '../useCases/artworkUseCases'

// Use Case instances
const repository = getArtworkRepository()
const getAllArtworksUseCase = new GetAllArtworksUseCase(repository)
const getArtworkByIdUseCase = new GetArtworkByIdUseCase(repository)
const getFeaturedArtworksUseCase = new GetFeaturedArtworksUseCase(repository)
const getArtworksByCategoryUseCase = new GetArtworksByCategoryUseCase(repository)
const getArtworksByMuseumUseCase = new GetArtworksByMuseumUseCase(repository)
const getArtworksByPeriodUseCase = new GetArtworksByPeriodUseCase(repository)
const searchArtworksUseCase = new SearchArtworksUseCase(repository)
const filterArtworksUseCase = new FilterArtworksUseCase(repository)
const invalidateArtworkCacheUseCase = new InvalidateArtworkCacheUseCase()

// 모든 작품 조회
export async function getAllArtworks(): Promise<Artwork[]> {
  return getAllArtworksUseCase.execute()
}

// 특정 작품 조회
export async function getArtworkById(id: number): Promise<Artwork | null> {
  return getArtworkByIdUseCase.execute(id)
}

// 주요 작품 조회
export async function getFeaturedArtworks(): Promise<Artwork[]> {
  return getFeaturedArtworksUseCase.execute()
}

// 카테고리별 작품 조회
export async function getArtworksByCategory(category: string): Promise<Artwork[]> {
  return getArtworksByCategoryUseCase.execute(category)
}

// 박물관별 작품 조회
export async function getArtworksByMuseum(museum: string): Promise<Artwork[]> {
  return getArtworksByMuseumUseCase.execute(museum)
}

// 시대별 작품 조회
export async function getArtworksByPeriod(period: string): Promise<Artwork[]> {
  return getArtworksByPeriodUseCase.execute(period)
}

// 검색 (제목, 설명 포함)
export async function searchArtworks(query: string): Promise<Artwork[]> {
  return searchArtworksUseCase.execute(query)
}

// 복합 필터 조회
export async function getArtworksByFilters(filters: {
  category?: string
  period?: string
  museum?: string
  featured?: boolean
  search?: string
}): Promise<Artwork[]> {
  return filterArtworksUseCase.execute(filters)
}

// 캐시 무효화 함수
export function invalidateArtworkCache(key?: string): void {
  return invalidateArtworkCacheUseCase.execute(key)
}
