import { memo, useCallback, useRef, useEffect, useState } from 'react'
import { FixedSizeGrid as Grid } from 'react-window'
import type { Artwork } from '../data'
import { useLanguage } from '../contexts/LanguageContext'
import ArtworkCard from './ArtworkCard'
import './VirtualizedArtworkGrid.css'

interface VirtualizedArtworkGridProps {
  artworks: Artwork[]
  onEndReached?: () => void
}

function VirtualizedArtworkGrid({ artworks, onEndReached }: VirtualizedArtworkGridProps) {
  const { t } = useLanguage()
  const gridRef = useRef<any>(null)
  
  // 반응형 그리드 계산
  const getGridDimensions = useCallback(() => {
    const width = window.innerWidth
    const padding = 40 // container padding
    const gap = 20 // grid gap
    const minCardWidth = 280
    
    let columns = Math.floor((width - padding) / (minCardWidth + gap))
    columns = Math.max(1, Math.min(columns, 4)) // 1-4 columns
    
    const cardWidth = (width - padding - (gap * (columns - 1))) / columns
    const cardHeight = cardWidth * 1.4 // aspect ratio
    
    return { columns, cardWidth, cardHeight, width: width - padding }
  }, [])

  const [dimensions, setDimensions] = useState(getGridDimensions())

  useEffect(() => {
    const handleResize = () => {
      setDimensions(getGridDimensions())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [getGridDimensions])

  const rowCount = Math.ceil(artworks.length / dimensions.columns)

  const Cell = ({ columnIndex, rowIndex, style }: any) => {
    const index = rowIndex * dimensions.columns + columnIndex
    
    if (index >= artworks.length) {
      return null
    }

    const artwork = artworks[index]
    
    // 마지막 행에 도달했을 때 콜백 호출
    if (rowIndex === rowCount - 1 && onEndReached) {
      onEndReached()
    }

    return (
      <div style={{ ...style, padding: '10px' }}>
        <ArtworkCard artwork={artwork} />
      </div>
    )
  }

  if (artworks.length === 0) {
    return (
      <div className="no-results">
        <p>{t('gallery.noResults')}</p>
      </div>
    )
  }

  return (
    <div className="virtualized-grid-container">
      <div className="container">
        <div className="results-info">
          <p>{t('gallery.results', { count: artworks.length })}</p>
        </div>
        
        <Grid
          ref={gridRef}
          className="virtualized-artwork-grid"
          columnCount={dimensions.columns}
          columnWidth={dimensions.cardWidth}
          height={800} // 고정 높이
          rowCount={rowCount}
          rowHeight={dimensions.cardHeight}
          width={dimensions.width}
          overscanRowCount={2}
        >
          {Cell}
        </Grid>
      </div>
    </div>
  )
}

export default memo(VirtualizedArtworkGrid)