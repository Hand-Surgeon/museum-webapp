import { useState, useEffect, useCallback } from 'react'

interface GridDimensions {
  columns: number
  cardWidth: number
  cardHeight: number
  containerWidth: number
}

export function useResponsiveGrid(minCardWidth: number = 280, aspectRatio: number = 1.4) {
  const getGridDimensions = useCallback((): GridDimensions => {
    const width = window.innerWidth
    const padding = 40 // container padding
    const gap = 20 // grid gap
    
    let columns = Math.floor((width - padding) / (minCardWidth + gap))
    columns = Math.max(1, Math.min(columns, 4)) // 1-4 columns
    
    const cardWidth = (width - padding - (gap * (columns - 1))) / columns
    const cardHeight = cardWidth * aspectRatio
    
    return {
      columns,
      cardWidth,
      cardHeight,
      containerWidth: width - padding
    }
  }, [minCardWidth, aspectRatio])

  const [dimensions, setDimensions] = useState(getGridDimensions)

  useEffect(() => {
    const handleResize = () => {
      setDimensions(getGridDimensions())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [getGridDimensions])

  return dimensions
}