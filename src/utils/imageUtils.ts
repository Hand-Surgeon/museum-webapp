/**
 * Image utility functions for handling artwork images
 */

export const getImageUrl = (originalUrl: string, category: string): string => {
  // If the original URL is not Unsplash, use it as is
  if (!originalUrl.includes('unsplash.com')) {
    return originalUrl;
  }
  
  // For Unsplash URLs, create more reliable category-based fallbacks
  const categoryImageMap: Record<string, string> = {
    '토기': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop&auto=format&q=80',
    '청동기': 'https://images.unsplash.com/photo-1594736797933-d0dc1b4cc0f0?w=500&h=600&fit=crop&auto=format&q=80',
    '석기': 'https://images.unsplash.com/photo-1574263867128-a3d5c1b1deaa?w=500&h=600&fit=crop&auto=format&q=80',
    '건축부재': 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=500&h=600&fit=crop&auto=format&q=80',
    '장신구': 'https://images.unsplash.com/photo-1594736797933-d0dc1b4cc0f0?w=500&h=600&fit=crop&auto=format&q=80',
    '불상': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop&auto=format&q=80',
    '회화': 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=600&fit=crop&auto=format&q=80',
    '도자기': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop&auto=format&q=80',
    '서예': 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=600&fit=crop&auto=format&q=80',
    '조각': 'https://images.unsplash.com/photo-1594736797933-d0dc1b4cc0f0?w=500&h=600&fit=crop&auto=format&q=80'
  };
  
  return categoryImageMap[category] || originalUrl;
};

export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>, category: string) => {
  const img = event.currentTarget;
  
  // If already showing placeholder, don't retry
  if (img.src.includes('placeholder-artwork.svg')) {
    return;
  }
  
  // Try category-based fallback first
  const fallbackUrl = getImageUrl('', category);
  if (img.src !== fallbackUrl && fallbackUrl) {
    img.src = fallbackUrl;
    return;
  }
  
  // Final fallback to placeholder
  img.src = '/placeholder-artwork.svg';
};