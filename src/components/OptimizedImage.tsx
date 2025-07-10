import { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import './OptimizedImage.css'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  loading?: 'lazy' | 'eager'
  sizes?: string
  onLoad?: () => void
  onError?: () => void
}

// Helper to generate optimized image URLs
function getOptimizedSrc(src: string, format: 'webp' | 'avif' | 'original'): string {
  // In production, this would point to an image optimization service
  // For now, we'll use the original images
  if (format === 'original') return src
  
  // Check if it's already an external URL
  if (src.startsWith('http')) return src
  
  // For local images, we would need a build process to generate WebP/AVIF
  // This is a placeholder for the optimization logic
  const basePath = src.substring(0, src.lastIndexOf('.'))
  const extension = format === 'webp' ? '.webp' : '.avif'
  
  // Return original for now - in production, use generated optimized images
  return src // Would be: `${basePath}${extension}`
}

export default function OptimizedImage({
  src,
  alt,
  className = '',
  width,
  height,
  loading = 'lazy',
  sizes,
  onLoad,
  onError
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '50px'
  })

  // Only load images when in viewport
  const shouldLoad = loading === 'eager' || inView

  useEffect(() => {
    if (shouldLoad && src) {
      const img = new Image()
      img.onload = () => {
        setIsLoaded(true)
        onLoad?.()
      }
      img.onerror = () => {
        setHasError(true)
        onError?.()
      }
      img.src = src
    }
  }, [shouldLoad, src, onLoad, onError])

  if (hasError) {
    return (
      <div 
        ref={ref}
        className={`optimized-image-error ${className}`}
        style={{ width, height }}
        role="img"
        aria-label={alt}
      >
        <span>이미지를 불러올 수 없습니다</span>
      </div>
    )
  }

  return (
    <div 
      ref={ref}
      className={`optimized-image-wrapper ${className}`}
      style={{ width, height }}
    >
      {shouldLoad && (
        <picture>
          {/* Future: Add AVIF support when images are generated */}
          {/* <source 
            srcSet={getOptimizedSrc(src, 'avif')} 
            type="image/avif" 
          /> */}
          
          {/* Future: Add WebP support when images are generated */}
          {/* <source 
            srcSet={getOptimizedSrc(src, 'webp')} 
            type="image/webp" 
          /> */}
          
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            loading={loading}
            className={`optimized-image ${isLoaded ? 'loaded' : 'loading'}`}
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
          />
        </picture>
      )}
      
      {!isLoaded && shouldLoad && (
        <div className="optimized-image-placeholder" aria-hidden="true">
          <div className="shimmer"></div>
        </div>
      )}
    </div>
  )
}