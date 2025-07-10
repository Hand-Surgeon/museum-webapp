// 이미지 URL에 크기 파라미터 추가
export function getOptimizedImageUrl(
  originalUrl: string,
  width?: number,
  height?: number,
  quality: number = 75
): string {
  // Supabase Storage URL인 경우 transform 파라미터 추가
  if (originalUrl.includes('supabase')) {
    const url = new URL(originalUrl)
    
    if (width) {
      url.searchParams.set('width', width.toString())
    }
    if (height) {
      url.searchParams.set('height', height.toString())
    }
    url.searchParams.set('quality', quality.toString())
    
    return url.toString()
  }
  
  // 로컬 이미지는 그대로 반환
  return originalUrl
}

// 디바이스 픽셀 비율에 따른 이미지 크기 계산
export function getResponsiveImageSize(
  baseWidth: number,
  baseHeight?: number
): { width: number; height?: number } {
  const dpr = window.devicePixelRatio || 1
  const width = Math.round(baseWidth * dpr)
  const height = baseHeight ? Math.round(baseHeight * dpr) : undefined
  
  return { width, height }
}

// 뷰포트 크기에 따른 이미지 크기 결정
export function getImageSizeForViewport(type: 'card' | 'detail' | 'thumbnail'): { width: number; height?: number } {
  const vw = window.innerWidth
  
  switch (type) {
    case 'thumbnail':
      return { width: 100, height: 100 }
      
    case 'card':
      if (vw < 640) return { width: 300 }
      if (vw < 1024) return { width: 400 }
      return { width: 500 }
      
    case 'detail':
      if (vw < 640) return { width: 600 }
      if (vw < 1024) return { width: 800 }
      return { width: 1200 }
      
    default:
      return { width: 400 }
  }
}

// Placeholder 이미지 생성 (Base64 블러 이미지)
export function generatePlaceholder(width: number = 10, height: number = 10): string {
  // 간단한 회색 placeholder
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect width='100%25' height='100%25' fill='%23f0f0f0'/%3E%3C/svg%3E`
}

// srcset 생성
export function generateSrcSet(baseUrl: string, sizes: number[]): string {
  return sizes
    .map(size => `${getOptimizedImageUrl(baseUrl, size)} ${size}w`)
    .join(', ')
}

// 이미지 프리로드
export function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = url
  })
}

// 다중 이미지 프리로드
export function preloadImages(urls: string[]): Promise<void[]> {
  return Promise.all(urls.map(preloadImage))
}