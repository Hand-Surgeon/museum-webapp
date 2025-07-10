import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { Language, TranslationData, loadTranslation } from '../locales'
import LoadingSpinner from '../components/LoadingSpinner'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, params?: Record<string, string | number>) => string
  isLoading: boolean
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
  const [translations, setTranslations] = useState<TranslationData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  // 번역 데이터 로드
  const loadLanguageData = async (lang: Language) => {
    // 초기 로딩이 아닌 경우에만 로딩 상태 표시
    if (isInitialized) {
      setIsLoading(true)
    }
    
    try {
      const translationData = await loadTranslation(lang)
      setTranslations(translationData)
    } catch (error) {
      console.error(`Failed to load translation for ${lang}:`, error)
    } finally {
      setIsLoading(false)
      setIsInitialized(true)
    }
  }

  // 브라우저 언어 감지 및 localStorage에서 저장된 언어 불러오기
  useEffect(() => {
    const initializeLanguage = async () => {
      const savedLanguage = localStorage.getItem('museum-language') as Language
      let targetLanguage: Language = 'ko'

      if (savedLanguage && ['ko', 'en', 'zh', 'ja'].includes(savedLanguage)) {
        targetLanguage = savedLanguage
      } else {
        // 브라우저 언어 감지
        const browserLang = navigator.language.toLowerCase()
        if (browserLang.startsWith('en')) targetLanguage = 'en'
        else if (browserLang.startsWith('zh')) targetLanguage = 'zh'
        else if (browserLang.startsWith('ja')) targetLanguage = 'ja'
        else targetLanguage = 'ko'
      }

      setLanguage(targetLanguage)
      await loadLanguageData(targetLanguage)
    }

    initializeLanguage()
  }, [])

  // 언어 변경 시 localStorage에 저장 및 번역 데이터 로드
  const handleLanguageChange = async (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('museum-language', lang)
    await loadLanguageData(lang)
  }

  // 번역 함수 - 파라미터 치환 지원
  const t = (key: string, params?: Record<string, string | number>): string => {
    if (!translations) return key

    const keys = key.split('.')
    let value: unknown = translations
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return key // 키를 그대로 반환
      }
    }
    
    let result = typeof value === 'string' ? value : key

    // 파라미터 치환 (예: {count} -> 실제 값)
    if (params && typeof result === 'string') {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        result = result.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramValue))
      })
    }

    return result
  }

  // 초기 로딩 중이면 로딩 스피너 표시
  if (!isInitialized || !translations) {
    return <LoadingSpinner message="언어 설정을 불러오는 중..." />
  }

  const contextValue = useMemo(() => ({
    language,
    setLanguage: handleLanguageChange,
    t,
    isLoading
  }), [language, isLoading, t, handleLanguageChange])

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
      {isLoading && isInitialized && (
        <LoadingSpinner message="언어를 변경하는 중..." />
      )}
    </LanguageContext.Provider>
  )
}