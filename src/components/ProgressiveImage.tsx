import { useState, useEffect, memo } from 'react'
import './ProgressiveImage.css'

interface ProgressiveImageProps {
  src: string
  alt: string
  placeholderSrc?: string
  className?: string
  loading?: 'lazy' | 'eager'
  onLoad?: () => void
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void
}

function ProgressiveImage({
  src,
  alt,
  placeholderSrc,
  className = '',
  loading = 'lazy',
  onLoad,
  onError,
}: ProgressiveImageProps) {
  const [imgSrc, setImgSrc] = useState(placeholderSrc || '')
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const img = new Image()

    const handleLoad = () => {
      setImgSrc(src)
      setIsLoading(false)
      onLoad?.()
    }

    const handleError = () => {
      setIsError(true)
      setIsLoading(false)
    }

    img.addEventListener('load', handleLoad)
    img.addEventListener('error', handleError)
    img.src = src

    return () => {
      img.removeEventListener('load', handleLoad)
      img.removeEventListener('error', handleError)
    }
  }, [src, onLoad])

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setIsError(true)
    onError?.(e)
  }

  return (
    <div className={`progressive-image-wrapper ${className}`}>
      <img
        src={imgSrc || placeholderSrc}
        alt={alt}
        loading={loading}
        className={`progressive-image ${isLoading ? 'loading' : 'loaded'} ${isError ? 'error' : ''}`}
        onError={handleImageError}
      />
      {isLoading && placeholderSrc && <div className="progressive-image-placeholder" />}
    </div>
  )
}

export default memo(ProgressiveImage)
