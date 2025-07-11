import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useArtworkFilter } from '../useArtworkFilter'
import { Artwork } from '../../data/types'

const mockArtworks: Artwork[] = [
  {
    id: 1,
    title: '청자 상감운학문 매병',
    titleEn: 'Celadon Vase',
    period: '고려시대',
    category: '도자기',
    material: '청자',
    dimensions: '높이 30cm',
    description: '고려시대 청자',
    detailedDescription: '',
    historicalBackground: '',
    artisticFeatures: '',
    imageUrl: '/image1.jpg',
    featured: true,
    culturalProperty: '국보',
    nationalTreasureNumber: 68,
    museum: '국립중앙박물관',
    inventoryNumber: 'NMK-001',
    era: '12세기',
    significance: '',
    displayLocation: '',
  },
  {
    id: 2,
    title: '백자 달항아리',
    titleEn: 'White Porcelain Jar',
    period: '조선시대',
    category: '도자기',
    material: '백자',
    dimensions: '높이 45cm',
    description: '조선시대 백자',
    detailedDescription: '',
    historicalBackground: '',
    artisticFeatures: '',
    imageUrl: '/image2.jpg',
    featured: false,
    culturalProperty: '보물',
    nationalTreasureNumber: null,
    museum: '국립중앙박물관',
    inventoryNumber: 'NMK-002',
    era: '18세기',
    significance: '',
    displayLocation: '',
  },
]

describe('useArtworkFilter', () => {
  it('returns all artworks initially', () => {
    const { result } = renderHook(() => useArtworkFilter(mockArtworks))

    expect(result.current.filteredArtworks).toHaveLength(2)
    expect(result.current.filters.searchTerm).toBe('')
    expect(result.current.filters.selectedCategory).toBe('전체')
  })

  it('filters by search term', () => {
    const { result } = renderHook(() => useArtworkFilter(mockArtworks))

    act(() => {
      result.current.actions.setSearchTerm('청자')
    })

    expect(result.current.filteredArtworks).toHaveLength(1)
    expect(result.current.filteredArtworks[0].title).toContain('청자')
  })

  it('filters by category', () => {
    const { result } = renderHook(() => useArtworkFilter(mockArtworks))

    act(() => {
      result.current.actions.setSelectedCategory('도자기')
    })

    expect(result.current.filteredArtworks).toHaveLength(2)
  })

  it('filters by period', () => {
    const { result } = renderHook(() => useArtworkFilter(mockArtworks))

    act(() => {
      result.current.actions.setSelectedPeriod('고려시대')
    })

    expect(result.current.filteredArtworks).toHaveLength(1)
    expect(result.current.filteredArtworks[0].period).toBe('고려시대')
  })

  it('filters by museum', () => {
    const { result } = renderHook(() => useArtworkFilter(mockArtworks))

    act(() => {
      result.current.actions.setSelectedMuseum('국립중앙박물관')
    })

    expect(result.current.filteredArtworks).toHaveLength(2)
  })

  it('filters by cultural property grade', () => {
    const { result } = renderHook(() => useArtworkFilter(mockArtworks))

    act(() => {
      result.current.actions.setSelectedGrade('국보')
    })

    expect(result.current.filteredArtworks).toHaveLength(1)
    expect(result.current.filteredArtworks[0].culturalProperty).toBe('국보')
  })

  it('combines multiple filters', () => {
    const { result } = renderHook(() => useArtworkFilter(mockArtworks))

    act(() => {
      result.current.actions.setSearchTerm('청자')
      result.current.actions.setSelectedPeriod('고려시대')
    })

    expect(result.current.filteredArtworks).toHaveLength(1)
  })

  it('resets all filters', () => {
    const { result } = renderHook(() => useArtworkFilter(mockArtworks))

    act(() => {
      result.current.actions.setSearchTerm('청자')
      result.current.actions.setSelectedCategory('도자기')
      result.current.actions.resetFilters()
    })

    expect(result.current.filters.searchTerm).toBe('')
    expect(result.current.filters.selectedCategory).toBe('전체')
    expect(result.current.filteredArtworks).toHaveLength(2)
  })
})
