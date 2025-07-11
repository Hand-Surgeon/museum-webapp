/**
 * 안정적인 이미지 처리를 위한 유틸리티 함수들
 */

import { getImagePath } from './imageMapping';

// 카테고리별 로컬 플레이스홀더 이미지 매핑
const getCategoryPlaceholder = (category: string): string => {
  const categoryMap: Record<string, string> = {
    '토기': './images/placeholder-pottery.svg',
    '청동기': './images/placeholder-bronze.svg',
    '석기': './images/placeholder-default.svg',
    '건축부재': './images/placeholder-default.svg',
    '장신구': './images/placeholder-bronze.svg',
    '불상': './images/placeholder-default.svg',
    '회화': './images/placeholder-default.svg',
    '도자기': './images/placeholder-pottery.svg',
    '서예': './images/placeholder-default.svg',
    '조각': './images/placeholder-default.svg'
  };
  
  return categoryMap[category] || './images/placeholder-default.svg';
};

// 메인 이미지 URL 처리 함수 - 로컬 이미지 우선, 안전한 외부 이미지 차선
export const getImageUrl = (originalUrl: string, category: string, title?: string): string => {
  // 제목이 있으면 먼저 로컬 이미지 매핑 확인
  if (title) {
    const localImagePath = getImagePath(title);
    if (localImagePath) {
      return localImagePath;
    }
  }
  
  // Wikipedia나 안정적인 도메인의 이미지 확인
  const trustedDomains = [
    'upload.wikimedia.org',
    'commons.wikimedia.org'
  ];
  
  // 원본 URL이 신뢰할 수 있는 도메인인지 확인
  const isTrustedUrl = trustedDomains.some(domain => originalUrl.includes(domain));
  
  if (isTrustedUrl && originalUrl.startsWith('http')) {
    return originalUrl;
  }
  
  // 신뢰할 수 없는 URL이거나 외부 URL은 플레이스홀더 사용
  return getCategoryPlaceholder(category);
};

// 이미지 로딩 실패 처리 함수
export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>, category: string) => {
  const img = event.currentTarget;
  
  // 이미 플레이스홀더 이미지를 보여주고 있다면 더 이상 시도하지 않음
  if (img.src.includes('placeholder-') || img.src.includes('.svg')) {
    console.warn(`이미지 로딩 실패: ${img.src}`);
    return;
  }
  
  // 카테고리별 플레이스홀더로 즉시 대체
  const placeholderUrl = getCategoryPlaceholder(category);
  console.log(`이미지 로딩 실패, 플레이스홀더로 대체: ${img.src} -> ${placeholderUrl}`);
  img.src = placeholderUrl;
};

// 이미지 로딩 상태 확인을 위한 유틸리티
export const preloadImage = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};