import { useState, useMemo } from 'react'
import { artworks } from '../data'
import type { Artwork } from '../data'

interface FilterState {
  searchTerm: string
  selectedCategory: string
  selectedPeriod: string
  selectedMuseum: string
  selectedGrade: string
}

interface FilterActions {
  setSearchTerm: (term: string) => void
  setSelectedCategory: (category: string) => void
  setSelectedPeriod: (period: string) => void
  setSelectedMuseum: (museum: string) => void
  setSelectedGrade: (grade: string) => void
  resetFilters: () => void
}

const initialFilterState: FilterState = {
  searchTerm: '',
  selectedCategory: '전체',
  selectedPeriod: '전체',
  selectedMuseum: '전체',
  selectedGrade: '전체'
}

export const useArtworkFilter = () => {
  const [filters, setFilters] = useState<FilterState>(initialFilterState)

  const filteredArtworks = useMemo(() => {
    return artworks.filter((artwork: Artwork) => {
      const matchesSearch = artwork.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                           artwork.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                           (artwork.detailedDescription && artwork.detailedDescription.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
                           (artwork.titleEn && artwork.titleEn.toLowerCase().includes(filters.searchTerm.toLowerCase()))
      
      const matchesCategory = filters.selectedCategory === '전체' || artwork.category === filters.selectedCategory
      const matchesPeriod = filters.selectedPeriod === '전체' || artwork.period.includes(filters.selectedPeriod)
      const matchesMuseum = filters.selectedMuseum === '전체' || artwork.museum === filters.selectedMuseum
      const matchesGrade = filters.selectedGrade === '전체' || 
                          (filters.selectedGrade === '국보' && artwork.culturalProperty?.includes('국보')) ||
                          (filters.selectedGrade === '보물' && artwork.culturalProperty?.includes('보물')) ||
                          (filters.selectedGrade === '시도유형문화재' && artwork.culturalProperty?.includes('시도유형문화재')) ||
                          (filters.selectedGrade === '일반' && (!artwork.culturalProperty || artwork.culturalProperty === ''))
      
      return matchesSearch && matchesCategory && matchesPeriod && matchesMuseum && matchesGrade
    })
  }, [filters])

  const actions: FilterActions = {
    setSearchTerm: (term: string) => setFilters(prev => ({ ...prev, searchTerm: term })),
    setSelectedCategory: (category: string) => setFilters(prev => ({ ...prev, selectedCategory: category })),
    setSelectedPeriod: (period: string) => setFilters(prev => ({ ...prev, selectedPeriod: period })),
    setSelectedMuseum: (museum: string) => setFilters(prev => ({ ...prev, selectedMuseum: museum })),
    setSelectedGrade: (grade: string) => setFilters(prev => ({ ...prev, selectedGrade: grade })),
    resetFilters: () => setFilters(initialFilterState)
  }

  return {
    filters,
    filteredArtworks,
    ...actions
  }
}