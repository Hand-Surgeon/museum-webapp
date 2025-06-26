import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'ko' | 'en' | 'zh' | 'ja'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

interface LanguageProviderProps {
  children: React.ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ko')

  // 브라우저 언어 감지 및 localStorage에서 저장된 언어 불러오기
  useEffect(() => {
    const savedLanguage = localStorage.getItem('museum-language') as Language
    if (savedLanguage && ['ko', 'en', 'zh', 'ja'].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    } else {
      // 브라우저 언어 감지
      const browserLang = navigator.language.toLowerCase()
      if (browserLang.startsWith('en')) setLanguage('en')
      else if (browserLang.startsWith('zh')) setLanguage('zh')
      else if (browserLang.startsWith('ja')) setLanguage('ja')
      else setLanguage('ko')
    }
  }, [])

  // 언어 변경 시 localStorage에 저장
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('museum-language', lang)
  }

  // 번역 함수
  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations[language]
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        // 번역이 없으면 한국어로 폴백
        value = translations.ko
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey]
          } else {
            return key // 키를 그대로 반환
          }
        }
        break
      }
    }
    
    return typeof value === 'string' ? value : key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleLanguageChange, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

// 번역 데이터
const translations = {
  ko: {
    common: {
      home: '홈',
      gallery: '소장품',
      search: '검색',
      filter: '필터',
      all: '전체',
      featured: '주요 작품',
      more: '더보기',
      back: '돌아가기',
      loading: '로딩 중...',
      error: '오류가 발생했습니다',
      noResults: '검색 결과가 없습니다'
    },
    header: {
      title: '국립중앙박물관',
      subtitle: '한국의 문화유산'
    },
    navigation: {
      home: '홈',
      gallery: '소장품',
      about: '소개'
    },
    home: {
      welcomeTitle: '국립중앙박물관에 오신 것을 환영합니다',
      welcomeDescription: '5,000년 한국 역사와 문화의 정수를 만나보세요',
      featuredWorks: '주요 소장품',
      viewAllWorks: '전체 소장품 보기',
      museumsTitle: '전시관 안내',
      archaeologyHall: '고고관',
      artHall: '미술관',
      donationHall: '기증관',
      historyHall: '역사관',
      asianArtHall: '아시아관'
    },
    gallery: {
      title: '소장품',
      description: '국립중앙박물관의 귀중한 문화유산을 감상해보세요',
      searchPlaceholder: '작품명이나 설명으로 검색...',
      category: '분류',
      period: '시대',
      museum: '전시관',
      culturalGrade: '문화재 등급',
      detailedPeriod: '상세 시대',
      showAdvanced: '고급 필터 보기',
      hideAdvanced: '고급 필터 숨기기',
      filterHelp: '필터 도움말',
      nationalTreasure: '국보',
      treasure: '보물',
      general: '일반',
      totalWorks: '총 {count}점',
      filtered: '필터 적용됨',
      resetFilters: '필터 초기화',
      noResults: '검색 조건에 맞는 작품이 없습니다.'
    },
    artwork: {
      period: '시대',
      category: '분류', 
      material: '재질',
      dimensions: '크기',
      museum: '전시관',
      inventoryNumber: '소장품번호',
      description: '작품 설명',
      detailedDescription: '상세 설명',
      historicalBackground: '역사적 배경',
      artisticFeatures: '예술적 특징',
      significance: '문화사적 의의',
      relatedWorks: '다른 소장품 보기',
      viewAllWorks: '전체 소장품 보기',
      backToGallery: '갤러리로 돌아가기',
      notFound: '작품을 찾을 수 없습니다'
    },
    footer: {
      address: '서울특별시 용산구 서빙고로 137',
      phone: '02-2077-9000',
      website: 'www.museum.go.kr',
      copyright: '© 2024 국립중앙박물관. All rights reserved.'
    }
  },
  en: {
    common: {
      home: 'Home',
      gallery: 'Collections',
      search: 'Search',
      filter: 'Filter',
      all: 'All',
      featured: 'Featured Works',
      more: 'More',
      back: 'Back',
      loading: 'Loading...',
      error: 'An error occurred',
      noResults: 'No search results found'
    },
    header: {
      title: 'National Museum of Korea',
      subtitle: 'Korean Cultural Heritage'
    },
    navigation: {
      home: 'Home',
      gallery: 'Collections',
      about: 'About'
    },
    home: {
      welcomeTitle: 'Welcome to the National Museum of Korea',
      welcomeDescription: 'Discover the essence of 5,000 years of Korean history and culture',
      featuredWorks: 'Featured Collections',
      viewAllWorks: 'View All Collections',
      museumsTitle: 'Exhibition Halls',
      archaeologyHall: 'Archaeology Hall',
      artHall: 'Art Hall',
      donationHall: 'Donation Hall',
      historyHall: 'History Hall',
      asianArtHall: 'Asian Art Hall'
    },
    gallery: {
      title: 'Collections',
      description: 'Explore the precious cultural heritage of the National Museum of Korea',
      searchPlaceholder: 'Search by artwork title or description...',
      category: 'Category',
      period: 'Period',
      museum: 'Hall',
      culturalGrade: 'Cultural Property Grade',
      detailedPeriod: 'Detailed Period',
      showAdvanced: 'Show Advanced Filters',
      hideAdvanced: 'Hide Advanced Filters',
      filterHelp: 'Filter Help',
      nationalTreasure: 'National Treasure',
      treasure: 'Treasure',
      general: 'General',
      totalWorks: 'Total {count} works',
      filtered: 'Filtered',
      resetFilters: 'Reset Filters',
      noResults: 'No artworks match your search criteria.'
    },
    artwork: {
      period: 'Period',
      category: 'Category',
      material: 'Material',
      dimensions: 'Dimensions',
      museum: 'Exhibition Hall',
      inventoryNumber: 'Inventory Number',
      description: 'Description',
      detailedDescription: 'Detailed Description',
      historicalBackground: 'Historical Background',
      artisticFeatures: 'Artistic Features',
      significance: 'Cultural Significance',
      relatedWorks: 'View Other Collections',
      viewAllWorks: 'View All Collections',
      backToGallery: 'Back to Gallery',
      notFound: 'Artwork not found'
    },
    footer: {
      address: '137 Seobinggo-ro, Yongsan-gu, Seoul, South Korea',
      phone: '+82-2-2077-9000',
      website: 'www.museum.go.kr',
      copyright: '© 2024 National Museum of Korea. All rights reserved.'
    }
  },
  zh: {
    common: {
      home: '首页',
      gallery: '馆藏',
      search: '搜索',
      filter: '筛选',
      all: '全部',
      featured: '精选作品',
      more: '更多',
      back: '返回',
      loading: '加载中...',
      error: '发生错误',
      noResults: '没有找到搜索结果'
    },
    header: {
      title: '韩国国立中央博物馆',
      subtitle: '韩国文化遗产'
    },
    navigation: {
      home: '首页',
      gallery: '馆藏',
      about: '关于'
    },
    home: {
      welcomeTitle: '欢迎来到韩国国立中央博物馆',
      welcomeDescription: '探索5000年韩国历史文化的精髓',
      featuredWorks: '精选馆藏',
      viewAllWorks: '查看全部馆藏',
      museumsTitle: '展览厅指南',
      archaeologyHall: '考古馆',
      artHall: '美术馆',
      donationHall: '捐赠馆',
      historyHall: '历史馆',
      asianArtHall: '亚洲馆'
    },
    gallery: {
      title: '馆藏',
      description: '欣赏韩国国立中央博物馆的珍贵文化遗产',
      searchPlaceholder: '按作品名称或描述搜索...',
      category: '分类',
      period: '时期',
      museum: '展厅',
      culturalGrade: '文化财等级',
      detailedPeriod: '详细时期',
      showAdvanced: '显示高级筛选',
      hideAdvanced: '隐藏高级筛选',
      filterHelp: '筛选帮助',
      nationalTreasure: '国宝',
      treasure: '宝物',
      general: '一般',
      totalWorks: '共{count}件',
      filtered: '已筛选',
      resetFilters: '重置筛选',
      noResults: '没有符合搜索条件的作品。'
    },
    artwork: {
      period: '时期',
      category: '分类',
      material: '材质',
      dimensions: '尺寸',
      museum: '展览厅',
      inventoryNumber: '馆藏编号',
      description: '作品说明',
      detailedDescription: '详细说明',
      historicalBackground: '历史背景',
      artisticFeatures: '艺术特色',
      significance: '文化意义',
      relatedWorks: '查看其他馆藏',
      viewAllWorks: '查看全部馆藏',
      backToGallery: '返回画廊',
      notFound: '未找到作品'
    },
    footer: {
      address: '韩国首尔龙山区西冰库路137号',
      phone: '+82-2-2077-9000',
      website: 'www.museum.go.kr',
      copyright: '© 2024 韩国国立中央博物馆。保留所有权利。'
    }
  },
  ja: {
    common: {
      home: 'ホーム',
      gallery: '所蔵品',
      search: '検索',
      filter: 'フィルター',
      all: '全て',
      featured: '主要作品',
      more: '詳細',
      back: '戻る',
      loading: '読み込み中...',
      error: 'エラーが発生しました',
      noResults: '検索結果が見つかりません'
    },
    header: {
      title: '韓国国立中央博物館',
      subtitle: '韓国の文化遺産'
    },
    navigation: {
      home: 'ホーム',
      gallery: '所蔵品',
      about: '概要'
    },
    home: {
      welcomeTitle: '韓国国立中央博物館へようこそ',
      welcomeDescription: '5000年の韓国の歴史と文化の精髄をご覧ください',
      featuredWorks: '主要所蔵品',
      viewAllWorks: '全所蔵品を見る',
      museumsTitle: '展示館案内',
      archaeologyHall: '考古館',
      artHall: '美術館',
      donationHall: '寄贈館',
      historyHall: '歴史館',
      asianArtHall: 'アジア館'
    },
    gallery: {
      title: '所蔵品',
      description: '韓国国立中央博物館の貴重な文化遺産をご鑑賞ください',
      searchPlaceholder: '作品名や説明で検索...',
      category: '分類',
      period: '時代',
      museum: '展示館',
      culturalGrade: '文化財等級',
      detailedPeriod: '詳細時代',
      showAdvanced: '高度フィルター表示',
      hideAdvanced: '高度フィルター非表示',
      filterHelp: 'フィルターヘルプ',
      nationalTreasure: '国宝',
      treasure: '重要文化財',
      general: '一般',
      totalWorks: '計{count}点',
      filtered: 'フィルター済み',
      resetFilters: 'フィルターリセット',
      noResults: '検索条件に一致する作品はありません。'
    },
    artwork: {
      period: '時代',
      category: '分類',
      material: '材質',
      dimensions: 'サイズ',
      museum: '展示館',
      inventoryNumber: '所蔵品番号',
      description: '作品説明',
      detailedDescription: '詳細説明',
      historicalBackground: '歴史的背景',
      artisticFeatures: '芸術的特徴',
      significance: '文化的意義',
      relatedWorks: '他の所蔵品を見る',
      viewAllWorks: '全所蔵品を見る',
      backToGallery: 'ギャラリーに戻る',
      notFound: '作品が見つかりません'
    },
    footer: {
      address: '韓国ソウル特別市龍山区西氷庫路137',
      phone: '+82-2-2077-9000',
      website: 'www.museum.go.kr',
      copyright: '© 2024 韓国国立中央博物館。全著作権所有。'
    }
  }
} as const