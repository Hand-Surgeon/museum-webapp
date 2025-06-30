import { categories, periods, museums, culturalPropertyGrades } from '../data'
import { useLanguage } from '../contexts/LanguageContext'

interface FilterControlsProps {
  filters: {
    searchTerm: string
    selectedCategory: string
    selectedPeriod: string
    selectedMuseum: string
    selectedGrade: string
  }
  onSearchChange: (term: string) => void
  onCategoryChange: (category: string) => void
  onPeriodChange: (period: string) => void
  onMuseumChange: (museum: string) => void
  onGradeChange: (grade: string) => void
  showAdvancedFilters: boolean
  onToggleAdvancedFilters: () => void
}

export default function FilterControls({
  filters,
  onSearchChange,
  onCategoryChange,
  onPeriodChange,
  onMuseumChange,
  onGradeChange,
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
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-group">
          <span style={{ marginRight: '1rem', fontWeight: '600' }}>{t('gallery.category')}:</span>
          <div className="filter-buttons">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`filter-btn ${filters.selectedCategory === category ? 'active' : ''}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <span style={{ marginRight: '1rem', fontWeight: '600' }}>{t('gallery.period')}:</span>
          <div className="filter-buttons">
            {periods.map((period) => (
              <button
                key={period}
                onClick={() => onPeriodChange(period)}
                className={`filter-btn ${filters.selectedPeriod === period ? 'active' : ''}`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <span style={{ marginRight: '1rem', fontWeight: '600' }}>{t('gallery.museum')}:</span>
          <div className="filter-buttons">
            {museums.map((museum) => (
              <button
                key={museum}
                onClick={() => onMuseumChange(museum)}
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
              <span style={{ marginRight: '1rem', fontWeight: '600' }}>{t('gallery.culturalGrade')}:</span>
              <div className="filter-buttons">
                {culturalPropertyGrades.map((grade) => (
                  <button
                    key={grade}
                    onClick={() => onGradeChange(grade)}
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