export type Language = 'ko' | 'en' | 'zh' | 'ja'

export interface TranslationData {
  common: {
    home: string
    gallery: string
    search: string
    filter: string
    all: string
    featured: string
    more: string
    back: string
    loading: string
    error: string
    noResults: string
  }
  header: {
    title: string
    subtitle: string
  }
  navigation: {
    home: string
    gallery: string
    about: string
  }
  home: {
    welcomeTitle: string
    welcomeDescription: string
    featuredWorks: string
    viewAllWorks: string
    museumsTitle: string
    archaeologyHall: string
    artHall: string
    donationHall: string
    historyHall: string
    asianArtHall: string
  }
  gallery: {
    title: string
    description: string
    searchPlaceholder: string
    category: string
    period: string
    museum: string
    culturalGrade: string
    detailedPeriod: string
    showAdvanced: string
    hideAdvanced: string
    filterHelp: string
    nationalTreasure: string
    treasure: string
    general: string
    totalWorks: string
    filtered: string
    resetFilters: string
    noResults: string
    results: string
  }
  artwork: {
    period: string
    category: string
    material: string
    dimensions: string
    museum: string
    inventoryNumber: string
    description: string
    detailedDescription: string
    historicalBackground: string
    artisticFeatures: string
    significance: string
    relatedWorks: string
    viewAllWorks: string
    backToGallery: string
    notFound: string
  }
  footer: {
    address: string
    phone: string
    website: string
    copyright: string
  }
}

// 기본 언어(한국어)는 동기적으로 import
import koTranslation from './ko.json'

export const loadTranslation = async (language: Language): Promise<TranslationData> => {
  try {
    switch (language) {
      case 'ko':
        // 한국어는 이미 로드된 상태이므로 즉시 반환
        return koTranslation
      case 'en':
        return (await import('./en.json')).default
      case 'zh':
        return (await import('./zh.json')).default
      case 'ja':
        return (await import('./ja.json')).default
      default:
        return koTranslation
    }
  } catch {
    console.warn(`Failed to load translation for ${language}, falling back to Korean`)
    return koTranslation
  }
}
