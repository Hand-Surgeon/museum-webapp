import { memo } from 'react'
import { Link } from 'react-router-dom'
import type { Artwork } from '../data'
import { useLanguage } from '../contexts/LanguageContext'
import { getImageUrl, handleImageError } from '../utils/imageUtils'
import ProgressiveImage from './ProgressiveImage'
import {
  getOptimizedImageUrl,
  generatePlaceholder,
  getImageSizeForViewport,
} from '../utils/imageOptimization'
import './ArtworkCard.css'

interface ArtworkCardProps {
  artwork: Artwork
}

function ArtworkCard({ artwork }: ArtworkCardProps) {
  const { t } = useLanguage()

  return (
    <article className="artwork-card" aria-label={`${artwork.title} - ${artwork.period}`}>
      <Link to={`/artwork/${artwork.id}`} aria-label={`${artwork.title} 상세보기`}>
        <div className="artwork-image-wrapper">
          <ProgressiveImage
            src={getOptimizedImageUrl(
              getImageUrl(artwork.imageUrl, artwork.category),
              getImageSizeForViewport('card').width
            )}
            alt={artwork.title}
            placeholderSrc={generatePlaceholder(400, 300)}
            loading="lazy"
            onError={(e) => handleImageError(e, artwork.category)}
          />
          {artwork.featured && <div className="featured-badge">{t('common.featured')}</div>}
          {artwork.culturalProperty && (
            <div className="cultural-property-badge">{artwork.culturalProperty}</div>
          )}
        </div>
        <div className="artwork-info">
          <h3 className="artwork-title">{artwork.title}</h3>
          {artwork.titleEn && <p className="artwork-title-en">{artwork.titleEn}</p>}
          <p className="artwork-period">{artwork.period}</p>
          <p className="artwork-museum">{artwork.museum}</p>
          <p className="artwork-description">
            {artwork.description.length > 100
              ? `${artwork.description.substring(0, 100)}...`
              : artwork.description}
          </p>
        </div>
      </Link>
    </article>
  )
}

export default memo(ArtworkCard)
