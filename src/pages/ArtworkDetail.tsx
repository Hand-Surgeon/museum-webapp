import { useParams, Link } from 'react-router-dom'
import { artworks } from '../data'
import { useLanguage } from '../contexts/LanguageContext'

function ArtworkDetail() {
  const { t } = useLanguage()
  const { id } = useParams<{ id: string }>()
  const artwork = artworks.find(a => a.id === parseInt(id || '0'))

  if (!artwork) {
    return (
      <div className="container" style={{ padding: '3rem 0', textAlign: 'center' }}>
        <h2>{t('artwork.notFound')}</h2>
        <Link to="/gallery" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          {t('artwork.backToGallery')}
        </Link>
      </div>
    )
  }

  return (
    <div className="artwork-detail">
      <div className="container">
        <Link to="/gallery" className="btn btn-secondary" style={{ marginBottom: '2rem' }}>
          ← {t('artwork.backToGallery')}
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
            
            {artwork.culturalProperty && (
              <div className="cultural-property-badge" style={{ 
                backgroundColor: '#d4af37', 
                color: 'white', 
                padding: '0.5rem 1rem', 
                borderRadius: '1rem', 
                display: 'inline-block', 
                fontSize: '0.9rem', 
                fontWeight: '600', 
                marginBottom: '1.5rem'
              }}>
                {artwork.culturalProperty}
              </div>
            )}
            
            <div className="info-item">
              <span className="info-label">{t('artwork.museum')}:</span>
              <span className="info-value">{artwork.museum}</span>
            </div>
            
            <div className="info-item">
              <span className="info-label">{t('artwork.period')}:</span>
              <span className="info-value">{artwork.period}</span>
            </div>
            
            <div className="info-item">
              <span className="info-label">{t('artwork.category')}:</span>
              <span className="info-value">{artwork.category}</span>
            </div>
            
            <div className="info-item">
              <span className="info-label">{t('artwork.material')}:</span>
              <span className="info-value">{artwork.material}</span>
            </div>
            
            {artwork.dimensions && (
              <div className="info-item">
                <span className="info-label">{t('artwork.dimensions')}:</span>
                <span className="info-value">{artwork.dimensions}</span>
              </div>
            )}
            
            <div className="info-item">
              <span className="info-label">{t('artwork.inventoryNumber')}:</span>
              <span className="info-value">{artwork.inventoryNumber}</span>
            </div>
            
            <div className="artwork-description">
              <h3 style={{ marginBottom: '1rem', color: '#2c5530' }}>{t('artwork.description')}</h3>
              <p>{artwork.description}</p>
              
              {artwork.detailedDescription && (
                <div style={{ marginTop: '2rem' }}>
                  <h4 style={{ marginBottom: '1rem', color: '#2c5530' }}>{t('artwork.detailedDescription')}</h4>
                  <p style={{ lineHeight: '1.8' }}>{artwork.detailedDescription}</p>
                </div>
              )}
              
              {artwork.historicalBackground && (
                <div style={{ marginTop: '2rem' }}>
                  <h4 style={{ marginBottom: '1rem', color: '#2c5530' }}>{t('artwork.historicalBackground')}</h4>
                  <p style={{ lineHeight: '1.8' }}>{artwork.historicalBackground}</p>
                </div>
              )}
              
              {artwork.artisticFeatures && (
                <div style={{ marginTop: '2rem' }}>
                  <h4 style={{ marginBottom: '1rem', color: '#2c5530' }}>{t('artwork.artisticFeatures')}</h4>
                  <p style={{ lineHeight: '1.8' }}>{artwork.artisticFeatures}</p>
                </div>
              )}
              
              {artwork.significance && (
                <div style={{ marginTop: '2rem' }}>
                  <h4 style={{ marginBottom: '1rem', color: '#2c5530' }}>{t('artwork.significance')}</h4>
                  <p style={{ lineHeight: '1.8', fontStyle: 'italic', backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '0.5rem' }}>{artwork.significance}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <h3 style={{ marginBottom: '2rem', color: '#2c5530' }}>{t('artwork.otherWorks')}</h3>
          <Link to="/gallery" className="btn btn-primary">
            {t('artwork.viewAllWorks')}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ArtworkDetail