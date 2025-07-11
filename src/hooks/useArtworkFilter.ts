import { useState, useMemo } from 'react'
import type { Artwork } from '../data'
import { applyAllFilters } from '../utils/artworkFilters'

export interface FilterState {
  searchTerm: string
  selectedCategory: string
  selectedPeriod: string
  selectedMuseum: string
  selectedGrade: string
}

export interface FilterActions {
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
  selectedGrade: '전체',
}

export const useArtworkFilter = (artworks: Artwork[]) => {
  const [filters, setFilters] = useState<FilterState>(initialFilterState)

  const filteredArtworks = useMemo(() => {
    return applyAllFilters(artworks, filters)
  }, [artworks, filters])

  const actions: FilterActions = {
    setSearchTerm: (term: string) => setFilters((prev) => ({ ...prev, searchTerm: term })),
    setSelectedCategory: (category: string) =>
      setFilters((prev) => ({ ...prev, selectedCategory: category })),
    setSelectedPeriod: (period: string) =>
      setFilters((prev) => ({ ...prev, selectedPeriod: period })),
    setSelectedMuseum: (museum: string) =>
      setFilters((prev) => ({ ...prev, selectedMuseum: museum })),
    setSelectedGrade: (grade: string) => setFilters((prev) => ({ ...prev, selectedGrade: grade })),
    resetFilters: () => setFilters(initialFilterState),
  }

  return {
    filters,
    filteredArtworks,
    actions,
  }
}
