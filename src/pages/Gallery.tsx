import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { artworks, categories, periods, museums, culturalPropertyGrades, detailedPeriods } from '../data/artworks'
import { useLanguage } from '../contexts/LanguageContext'

function Gallery() {
  const { t } = useLanguage()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [selectedPeriod, setSelectedPeriod] = useState('전체')
  const [selectedMuseum, setSelectedMuseum] = useState('전체')
  const [selectedGrade, setSelectedGrade] = useState('전체')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  // URL 파라미터에서 초기값 설정
  useEffect(() => {
    const museum = searchParams.get('museum')
    if (museum && museums.includes(museum)) {
      setSelectedMuseum(museum)
    }
  }, [searchParams])

  const filteredArtworks = artworks.filter((artwork) => {
    const matchesSearch = artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artwork.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (artwork.detailedDescription && artwork.detailedDescription.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (artwork.titleEn && artwork.titleEn.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === '전체' || artwork.category === selectedCategory
    const matchesPeriod = selectedPeriod === '전체' || artwork.period.includes(selectedPeriod)
    const matchesMuseum = selectedMuseum === '전체' || artwork.museum === selectedMuseum
    const matchesGrade = selectedGrade === '전체' || 
                        (selectedGrade === '국보' && artwork.culturalProperty?.includes('국보')) ||
                        (selectedGrade === '보물' && artwork.culturalProperty?.includes('보물')) ||
                        (selectedGrade === '시도유형문화재' && artwork.culturalProperty?.includes('시도유형문화재')) ||
                        (selectedGrade === '일반' && (!artwork.culturalProperty || artwork.culturalProperty === ''))
    
    return matchesSearch && matchesCategory && matchesPeriod && matchesMuseum && matchesGrade
  })

  return (
    <div>
      <div className="gallery-header">
        <div className="container">
          <h1 className="gallery-title">{t('gallery.title')}</h1>
          <p>{t('gallery.description')}</p>
        </div>
      </div>

      <div className="search-filters">
        <div className="container">
          <div className="filter-group">
            <input
              type="text"
              placeholder={t('gallery.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-group">
            <span style={{ marginRight: '1rem', fontWeight: '600' }}>{t('gallery.category')}:</span>
            <div className="filter-buttons">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
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
                  onClick={() => setSelectedPeriod(period)}
                  className={`filter-btn ${selectedPeriod === period ? 'active' : ''}`}
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
                  onClick={() => setSelectedMuseum(museum)}
                  className={`filter-btn ${selectedMuseum === museum ? 'active' : ''}`}
                >
                  {museum}
                </button>
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button 
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="btn btn-secondary"
              style={{ marginBottom: '1rem' }}
            >
              {showAdvancedFilters ? t('gallery.hideAdvanced') : t('gallery.showAdvanced')}
            </button>
          </div>

          {showAdvancedFilters && (
            <div style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '0.5rem', marginTop: '1rem' }}>
              <div className="filter-group">
                <span style={{ marginRight: '1rem', fontWeight: '600' }}>{t('gallery.culturalGrade')}:</span>
                <div className="filter-buttons">
                  {culturalPropertyGrades.map((grade) => (
                    <button
                      key={grade}
                      onClick={() => setSelectedGrade(grade)}
                      className={`filter-btn ${selectedGrade === grade ? 'active' : ''}`}
                    >
                      {grade}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group" style={{ marginTop: '1rem' }}>
                <span style={{ marginRight: '1rem', fontWeight: '600' }}>{t('gallery.detailedPeriod')}:</span>
                <div className="filter-buttons">
                  {detailedPeriods.map((period) => (
                    <button
                      key={period}
                      onClick={() => setSelectedPeriod(period)}
                      className={`filter-btn ${selectedPeriod === period ? 'active' : ''}`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
                <p><strong>{t('gallery.filterHelp')}:</strong></p>
                <ul style={{ marginLeft: '1rem', marginTop: '0.5rem' }}>
                  <li>{t('gallery.nationalTreasure')}: 최고 등급의 문화재</li>
                  <li>{t('gallery.treasure')}: 중요한 문화재</li>
                  <li>{t('gallery.general')}: 일반 소장품</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="gallery-content">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '0.5rem' }}>
            <div>
              <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>
                {t('gallery.totalWorks').replace('{count}', filteredArtworks.length.toString())}
              </span>
              {(selectedCategory !== '전체' || selectedPeriod !== '전체' || selectedMuseum !== '전체' || selectedGrade !== '전체' || searchTerm) && (
                <span style={{ marginLeft: '1rem', color: '#666' }}>
                  ({t('gallery.filtered')})
                </span>
              )}
            </div>
            {(selectedCategory !== '전체' || selectedPeriod !== '전체' || selectedMuseum !== '전체' || selectedGrade !== '전체' || searchTerm) && (
              <button 
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('전체')
                  setSelectedPeriod('전체')
                  setSelectedMuseum('전체')
                  setSelectedGrade('전체')
                }}
                className="btn btn-outline-secondary"
                style={{ fontSize: '0.9rem' }}
              >
                {t('gallery.resetFilters')}
              </button>
            )}
          </div>

          <div className="artwork-grid">
            {filteredArtworks.map((artwork) => (
              <Link 
                key={artwork.id} 
                to={`/artwork/${artwork.id}`}
                className="artwork-card"
                style={{ textDecoration: 'none' }}
              >
                <img 
                  src={artwork.imageUrl} 
                  alt={artwork.title}
                  className="artwork-image"
                />
                <div className="artwork-info">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h3 className="artwork-title" style={{ margin: 0, flex: 1 }}>{artwork.title}</h3>
                    {artwork.culturalProperty && (
                      <span style={{
                        backgroundColor: artwork.culturalProperty.includes('국보') ? '#dc3545' : 
                                       artwork.culturalProperty.includes('보물') ? '#fd7e14' : '#6c757d',
                        color: 'white',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        marginLeft: '0.5rem',
                        whiteSpace: 'nowrap'
                      }}>
                        {artwork.culturalProperty.includes('국보') ? '국보' : 
                         artwork.culturalProperty.includes('보물') ? '보물' : 
                         artwork.culturalProperty}
                      </span>
                    )}
                  </div>
                  <p className="artwork-period">{artwork.period} · {artwork.museum}</p>
                  <p className="artwork-description">
                    {artwork.description.length > 100 
                      ? `${artwork.description.substring(0, 100)}...` 
                      : artwork.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          
          {filteredArtworks.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
              <p>{t('gallery.noResults')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Gallery