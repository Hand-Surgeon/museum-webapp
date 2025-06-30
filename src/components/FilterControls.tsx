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

export default function FilterControls({
  filters,
  actions,
  showAdvancedFilters,
  onToggleAdvancedFilters
}: FilterControlsProps) {
  const { t } = useLanguage()

  return (
    <div className="search-filters">
      <div className="container">
        <div className="filter-group">
          <input
            type="text"
            placeholder={t('gallery.searchPlaceholder')}
            value={filters.searchTerm}
            onChange={(e) => actions.setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-group">
          <span className="filter-label">{t('gallery.category')}:</span>
          <div className="filter-buttons">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => actions.setSelectedCategory(category)}
                className={`filter-btn ${filters.selectedCategory === category ? 'active' : ''}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <span className="filter-label">{t('gallery.period')}:</span>
          <div className="filter-buttons">
            {periods.map((period) => (
              <button
                key={period}
                onClick={() => actions.setSelectedPeriod(period)}
                className={`filter-btn ${filters.selectedPeriod === period ? 'active' : ''}`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <span className="filter-label">{t('gallery.museum')}:</span>
          <div className="filter-buttons">
            {museums.map((museum) => (
              <button
                key={museum}
                onClick={() => actions.setSelectedMuseum(museum)}
                className={`filter-btn ${filters.selectedMuseum === museum ? 'active' : ''}`}
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