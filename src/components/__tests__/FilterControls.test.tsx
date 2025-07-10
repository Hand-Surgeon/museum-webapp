import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import FilterControls from '../FilterControls'
import { useLanguage } from '../../contexts/LanguageContext'

// Mock LanguageContext
vi.mock('../../contexts/LanguageContext', () => ({
  useLanguage: vi.fn()
}))

describe('FilterControls', () => {
  const mockActions = {
    setSearchTerm: vi.fn(),
    setSelectedCategory: vi.fn(),
    setSelectedPeriod: vi.fn(),
    setSelectedMuseum: vi.fn(),
    setSelectedGrade: vi.fn(),
    resetFilters: vi.fn()
  }

  const mockFilters = {
    searchTerm: '',
    selectedCategory: '전체',
    selectedPeriod: '전체',
    selectedMuseum: '전체',
    selectedGrade: '전체'
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useLanguage as any).mockReturnValue({
      t: (key: string) => key,
      language: 'ko'
    })
  })

  it('renders search input', () => {
    render(
      <FilterControls
        filters={mockFilters}
        actions={mockActions}
        showAdvancedFilters={false}
        onToggleAdvancedFilters={() => {}}
      />
    )

    expect(screen.getByRole('search')).toBeInTheDocument()
    expect(screen.getByLabelText('gallery.searchPlaceholder')).toBeInTheDocument()
  })

  it('calls setSearchTerm on input change', () => {
    render(
      <FilterControls
        filters={mockFilters}
        actions={mockActions}
        showAdvancedFilters={false}
        onToggleAdvancedFilters={() => {}}
      />
    )

    const searchInput = screen.getByLabelText('gallery.searchPlaceholder')
    fireEvent.change(searchInput, { target: { value: '청자' } })

    expect(mockActions.setSearchTerm).toHaveBeenCalledWith('청자')
  })

  it('displays filter buttons', () => {
    render(
      <FilterControls
        filters={mockFilters}
        actions={mockActions}
        showAdvancedFilters={false}
        onToggleAdvancedFilters={() => {}}
      />
    )

    expect(screen.getByText('gallery.category')).toBeInTheDocument()
    expect(screen.getByText('gallery.period')).toBeInTheDocument()
    expect(screen.getByText('gallery.museum')).toBeInTheDocument()
  })

  it('calls resetFilters when reset button is clicked', () => {
    render(
      <FilterControls
        filters={{ ...mockFilters, searchTerm: 'test' }}
        actions={mockActions}
        showAdvancedFilters={false}
        onToggleAdvancedFilters={() => {}}
      />
    )

    const resetButton = screen.getByText('gallery.reset')
    fireEvent.click(resetButton)

    expect(mockActions.resetFilters).toHaveBeenCalled()
  })

  it('toggles advanced filters', () => {
    const onToggle = vi.fn()
    
    render(
      <FilterControls
        filters={mockFilters}
        actions={mockActions}
        showAdvancedFilters={false}
        onToggleAdvancedFilters={onToggle}
      />
    )

    const toggleButton = screen.getByText('gallery.showAdvanced')
    fireEvent.click(toggleButton)

    expect(onToggle).toHaveBeenCalled()
  })

  it('shows advanced filters when toggled', () => {
    render(
      <FilterControls
        filters={mockFilters}
        actions={mockActions}
        showAdvancedFilters={true}
        onToggleAdvancedFilters={() => {}}
      />
    )

    expect(screen.getByText('gallery.hideAdvanced')).toBeInTheDocument()
    expect(screen.getByText('gallery.culturalGrade')).toBeInTheDocument()
  })
})