import { useParams, Link } from 'react-router-dom'
import { artworks } from '../data'
import { useLanguage } from '../contexts/LanguageContext'
import InfoItem from '../components/InfoItem'
import DescriptionSection from '../components/DescriptionSection'
import './ArtworkDetail.css'

function ArtworkDetail() {
  const { t } = useLanguage()
  const { id } = useParams<{ id: string }>()
  const artwork = artworks.find(a => a.id === parseInt(id || '0'))

  if (!artwork) {
    return (
      <div className="container artwork-not-found">
        <h2>{t('artwork.notFound')}</h2>
        <Link to="/gallery" className="btn btn-primary back-button">
          {t('artwork.backToGallery')}
        </Link>
      </div>
    )
  }

  return (
    <div className="artwork-detail">
      <div className="container">
        <Link to="/gallery" className="btn btn-secondary back-to-gallery">
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
              <div className="cultural-property-badge">
                {artwork.culturalProperty}
              </div>
            )}
            
            <InfoItem label={t('artwork.museum')} value={artwork.museum} />
            <InfoItem label={t('artwork.period')} value={artwork.period} />
            <InfoItem label={t('artwork.category')} value={artwork.category} />
            <InfoItem label={t('artwork.material')} value={artwork.material} />
            {artwork.dimensions && (
              <InfoItem label={t('artwork.dimensions')} value={artwork.dimensions} />
            )}
            <InfoItem label={t('artwork.inventoryNumber')} value={artwork.inventoryNumber} />
            
            <div className="artwork-description">
              <h3 className="description-title">{t('artwork.description')}</h3>
              <p>{artwork.description}</p>
              
              {artwork.detailedDescription && (
                <DescriptionSection 
                  title={t('artwork.detailedDescription')} 
                  content={artwork.detailedDescription} 
                />
              )}
              
              {artwork.historicalBackground && (
                <DescriptionSection 
                  title={t('artwork.historicalBackground')} 
                  content={artwork.historicalBackground} 
                />
              )}
              
              {artwork.artisticFeatures && (
                <DescriptionSection 
                  title={t('artwork.artisticFeatures')} 
                  content={artwork.artisticFeatures} 
                />
              )}
              
              {artwork.significance && (
                <DescriptionSection 
                  title={t('artwork.significance')} 
                  content={artwork.significance} 
                  isSignificance={true}
                />
              )}
            </div>
          </div>
        </div>
        
        <div className="related-works-section">
          <h3 className="related-works-title">{t('artwork.relatedWorks')}</h3>
          <div className="related-works-buttons">
            <Link to="/gallery" className="btn btn-primary">
              {t('artwork.viewAllWorks')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArtworkDetail