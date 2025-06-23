import { useState } from 'react'
import { Link } from 'react-router-dom'
import { artworks, categories, periods } from '../data/artworks'

function Gallery() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [selectedPeriod, setSelectedPeriod] = useState('전체')

  const filteredArtworks = artworks.filter((artwork) => {
    const matchesSearch = artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artwork.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === '전체' || artwork.category === selectedCategory
    const matchesPeriod = selectedPeriod === '전체' || artwork.period.includes(selectedPeriod)
    
    return matchesSearch && matchesCategory && matchesPeriod
  })

  return (
    <div>
      <div className="gallery-header">
        <div className="container">
          <h1 className="gallery-title">소장품</h1>
          <p>국립중앙박물관의 귀중한 문화유산을 감상해보세요</p>
        </div>
      </div>

      <div className="search-filters">
        <div className="container">
          <div className="filter-group">
            <input
              type="text"
              placeholder="작품명이나 설명으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-group">
            <span style={{ marginRight: '1rem', fontWeight: '600' }}>분류:</span>
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
            <span style={{ marginRight: '1rem', fontWeight: '600' }}>시대:</span>
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
        </div>
      </div>

      <div className="gallery-content">
        <div className="container">
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
                  <h3 className="artwork-title">{artwork.title}</h3>
                  <p className="artwork-period">{artwork.period}</p>
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
              <p>검색 조건에 맞는 작품이 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Gallery