import { useParams, Link } from 'react-router-dom'
import { artworks } from '../data/artworks'

function ArtworkDetail() {
  const { id } = useParams<{ id: string }>()
  const artwork = artworks.find(a => a.id === parseInt(id || '0'))

  if (!artwork) {
    return (
      <div className="container" style={{ padding: '3rem 0', textAlign: 'center' }}>
        <h2>작품을 찾을 수 없습니다</h2>
        <Link to="/gallery" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          갤러리로 돌아가기
        </Link>
      </div>
    )
  }

  return (
    <div className="artwork-detail">
      <div className="container">
        <Link to="/gallery" className="btn btn-secondary" style={{ marginBottom: '2rem' }}>
          ← 갤러리로 돌아가기
        </Link>
        
        <div className="artwork-detail-content">
          <div>
            <img 
              src={artwork.imageUrl} 
              alt={artwork.title}
              className="artwork-detail-image"
            />
          </div>
          
          <div className="artwork-detail-info">
            <h1>{artwork.title}</h1>
            
            <div className="info-item">
              <span className="info-label">시대:</span>
              <span className="info-value">{artwork.period}</span>
            </div>
            
            <div className="info-item">
              <span className="info-label">분류:</span>
              <span className="info-value">{artwork.category}</span>
            </div>
            
            <div className="info-item">
              <span className="info-label">재질:</span>
              <span className="info-value">{artwork.material}</span>
            </div>
            
            <div className="info-item">
              <span className="info-label">크기:</span>
              <span className="info-value">{artwork.dimensions}</span>
            </div>
            
            <div className="artwork-description">
              <h3 style={{ marginBottom: '1rem', color: '#2c5530' }}>작품 설명</h3>
              <p>{artwork.description}</p>
            </div>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <h3 style={{ marginBottom: '2rem', color: '#2c5530' }}>다른 소장품 보기</h3>
          <Link to="/gallery" className="btn btn-primary">
            전체 소장품 보기
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ArtworkDetail