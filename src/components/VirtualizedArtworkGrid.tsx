import { memo, useRef, useCallback } from 'react'
import { FixedSizeGrid as Grid } from 'react-window'
import type { FixedSizeGrid } from 'react-window'
import type { Artwork } from '../data'
import { useLanguage } from '../contexts/LanguageContext'
import { useResponsiveGrid } from '../hooks/useResponsiveGrid'
import ArtworkCard from './ArtworkCard'
import './VirtualizedArtworkGrid.css'

interface VirtualizedArtworkGridProps {
  artworks: Artwork[]
  onEndReached?: () => void
}

function VirtualizedArtworkGrid({ artworks, onEndReached }: VirtualizedArtworkGridProps) {
  const { t } = useLanguage()
  const gridRef = useRef<FixedSizeGrid>(null)
  
  // Custom hook for responsive grid dimensions
  const dimensions = useResponsiveGrid(280, 1.4)

  const rowCount = Math.ceil(artworks.length / dimensions.columns)

  interface CellProps {
    columnIndex: number
    rowIndex: number
    style: React.CSSProperties
  }

  const Cell = ({ columnIndex, rowIndex, style }: CellProps) => {
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