import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { museums } from '../data'
import { useLanguage } from '../contexts/LanguageContext'
import { useArtworkFilter } from '../hooks/useArtworkFilter'
import { getAllArtworks } from '../services/artworkService'
import { Artwork } from '../data/types'
import FilterControls from '../components/FilterControls'
import ArtworkGrid from '../components/ArtworkGrid'

function Gallery() {
  const { t } = useLanguage()
  const [searchParams] = useSearchParams()
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  
  const {
    filters,
    filteredArtworks,
    actions
  } = useArtworkFilter(artworks)

  useEffect(() => {
    async function loadArtworks() {
      try {
        setLoading(true)
        const data = await getAllArtworks()
        setArtworks(data)
      } catch (error) {
        console.error('Failed to load artworks:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadArtworks()
  }, [])

  // URL 파라미터에서 초기값 설정
  useEffect(() => {
    const museum = searchParams.get('museum')
    if (museum && museums.includes(museum)) {
      actions.setSelectedMuseum(museum)
    }
  }, [searchParams, actions])

  return (
    <div>
      <div className="gallery-header">
        <div className="container">
          <h1 className="gallery-title">{t('gallery.title')}</h1>
          <p>{t('gallery.description')}</p>
        </div>
      </div>

      <FilterControls
        filters={filters}
        actions={actions}
        showAdvancedFilters={showAdvancedFilters}
        onToggleAdvancedFilters={() => setShowAdvancedFilters(!showAdvancedFilters)}
      />

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <ArtworkGrid artworks={filteredArtworks} />
      )}
    </div>
  )
}

export default Gallery