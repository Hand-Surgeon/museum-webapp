import { memo } from 'react'
import { categories, periods, museums, culturalPropertyGrades } from '../data'
import { useLanguage } from '../contexts/LanguageContext'
import './FilterControls.css'

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

interface FilterControlsProps {
  filters: FilterState
  actions: FilterActions
  showAdvancedFilters: boolean
  onToggleAdvancedFilters: () => void
}

function FilterControls({
  filters,
  actions,
  showAdvancedFilters,
  onToggleAdvancedFilters
}: FilterControlsProps) {
  const { t } = useLanguage()

  return (
    <div className="search-filters" role="search" aria-label={t('gallery.filterControls')}>
      <div className="container">
        <div className="filter-group">
          <label htmlFor="artwork-search" className="visually-hidden">
            {t('gallery.searchLabel')}
          </label>
          <input
            id="artwork-search"
            type="search"
            placeholder={t('gallery.searchPlaceholder')}
            value={filters.searchTerm}
            onChange={(e) => actions.setSearchTerm(e.target.value)}
            className="search-input"
            aria-label={t('gallery.searchPlaceholder')}
          />
        </div>
        
        <div className="filter-group" role="group" aria-labelledby="category-label">
          <span className="filter-label" id="category-label">{t('gallery.category')}:</span>
          <div className="filter-buttons" role="radiogroup" aria-labelledby="category-label">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => actions.setSelectedCategory(category)}
                className={`filter-btn ${filters.selectedCategory === category ? 'active' : ''}`}
                role="radio"
                aria-checked={filters.selectedCategory === category}
                aria-label={`${t('gallery.category')}: ${category}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group" role="group" aria-labelledby="period-label">
          <span className="filter-label" id="period-label">{t('gallery.period')}:</span>
          <div className="filter-buttons" role="radiogroup" aria-labelledby="period-label">
            {periods.map((period) => (
              <button
                key={period}
                onClick={() => actions.setSelectedPeriod(period)}
                className={`filter-btn ${filters.selectedPeriod === period ? 'active' : ''}`}
                role="radio"
                aria-checked={filters.selectedPeriod === period}
                aria-label={`${t('gallery.period')}: ${period}`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group" role="group" aria-labelledby="museum-label">
          <span className="filter-label" id="museum-label">{t('gallery.museum')}:</span>
          <div className="filter-buttons" role="radiogroup" aria-labelledby="museum-label">
            {museums.map((museum) => (
              <button
                key={museum}
                onClick={() => actions.setSelectedMuseum(museum)}
                className={`filter-btn ${filters.selectedMuseum === museum ? 'active' : ''}`}
                role="radio"
                aria-checked={filters.selectedMuseum === museum}
                aria-label={`${t('gallery.museum')}: ${museum}`}
              >
                {museum}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={onToggleAdvancedFilters}
          className="toggle-advanced-btn"
        >
          {showAdvancedFilters ? t('gallery.hideAdvanced') : t('gallery.showAdvanced')}
        </button>

        {showAdvancedFilters && (
          <div className="advanced-filters">
            <div className="filter-group">
              <span className="filter-label">{t('gallery.culturalGrade')}:</span>
              <div className="filter-buttons">
                {culturalPropertyGrades.map((grade) => (
                  <button
                    key={grade}
                    onClick={() => actions.setSelectedGrade(grade)}
                    className={`filter-btn ${filters.selectedGrade === grade ? 'active' : ''}`}
                  >
                    {grade}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(FilterControls)