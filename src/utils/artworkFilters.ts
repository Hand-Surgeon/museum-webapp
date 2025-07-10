import type { Artwork } from '../data'
import { sanitizeSearchInput } from './sanitize'

// 검색어로 필터링
export const filterBySearchTerm = (artworks: Artwork[], searchTerm: string): Artwork[] => {
  const sanitizedTerm = sanitizeSearchInput(searchTerm)
  if (!sanitizedTerm) return artworks
  
  const lowerSearchTerm = sanitizedTerm.toLowerCase()
  
  return artworks.filter(artwork => 
    artwork.title.toLowerCase().includes(lowerSearchTerm) ||
    artwork.description.toLowerCase().includes(lowerSearchTerm) ||
    (artwork.detailedDescription && artwork.detailedDescription.toLowerCase().includes(lowerSearchTerm)) ||
    (artwork.titleEn && artwork.titleEn.toLowerCase().includes(lowerSearchTerm))
  )
}

// 카테고리로 필터링
export const filterByCategory = (artworks: Artwork[], category: string): Artwork[] => {
  if (category === '전체') return artworks
  return artworks.filter(artwork => artwork.category === category)
}

// 시대로 필터링
export const filterByPeriod = (artworks: Artwork[], period: string): Artwork[] => {
  if (period === '전체') return artworks
  return artworks.filter(artwork => artwork.period.includes(period))
}

// 전시관으로 필터링
export const filterByMuseum = (artworks: Artwork[], museum: string): Artwork[] => {
  if (museum === '전체') return artworks
  return artworks.filter(artwork => artwork.museum === museum)
}

// 문화재 등급으로 필터링
export const filterByGrade = (artworks: Artwork[], grade: string): Artwork[] => {
  if (grade === '전체') return artworks
  
  return artworks.filter(artwork => {
    switch (grade) {
      case '국보':
        return artwork.culturalProperty?.includes('국보')
      case '보물':
        return artwork.culturalProperty?.includes('보물')
      case '시도유형문화재':
        return artwork.culturalProperty?.includes('시도유형문화재')
      case '일반':
        return !artwork.culturalProperty || artwork.culturalProperty === ''
      default:
        return false
    }
  })
}

// 모든 필터를 조합하여 적용
export const applyAllFilters = (
  artworks: Artwork[],
  filters: {
    searchTerm: string
    selectedCategory: string
    selectedPeriod: string
    selectedMuseum: string
    selectedGrade: string
  }
): Artwork[] => {
  let filteredArtworks = artworks

  // 순차적으로 필터 적용
  filteredArtworks = filterBySearchTerm(filteredArtworks, filters.searchTerm)
  filteredArtworks = filterByCategory(filteredArtworks, filters.selectedCategory)
  filteredArtworks = filterByPeriod(filteredArtworks, filters.selectedPeriod)
  filteredArtworks = filterByMuseum(filteredArtworks, filters.selectedMuseum)
  filteredArtworks = filterByGrade(filteredArtworks, filters.selectedGrade)

  return filteredArtworks
}