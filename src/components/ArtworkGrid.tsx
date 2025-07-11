import { memo } from 'react'
import type { Artwork } from '../data'
import { useLanguage } from '../contexts/LanguageContext'
import ArtworkCard from './ArtworkCard'
import './ArtworkGrid.css'

interface ArtworkGridProps {
  artworks: Artwork[]
  limit?: number
  showTitle?: boolean
}

function ArtworkGrid({ artworks, limit, showTitle = true }: ArtworkGridProps) {
  const { t } = useLanguage()
  const itemsToDisplay = limit ? artworks.slice(0, limit) : artworks

  if (itemsToDisplay.length === 0) {
    return (
      <div className="no-results">
        <p>{t('gallery.noResults')}</p>
      </div>
    )
  }

  return (
    <div className="gallery-grid-container">
      <div className="container">
        {showTitle && (
          <div className="results-info">
            <p>{t('gallery.results', { count: artworks.length })}</p>
          </div>
        )}
        <div className="artwork-grid">
          {itemsToDisplay.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default memo(ArtworkGrid)
