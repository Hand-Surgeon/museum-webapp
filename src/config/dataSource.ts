// 데이터 소스 설정
export const DATA_SOURCE = {
  // 'local' | 'supabase'
  type: import.meta.env.VITE_DATA_SOURCE || 'supabase',
  
  // 개발 환경에서는 로컬 데이터 사용 가능
  isDevelopment: import.meta.env.DEV,
  
  // 로컬 데이터 사용 시 fallback
  useLocalFallback: import.meta.env.VITE_USE_LOCAL_FALLBACK === 'true'
} as const

export const isUsingSupabase = () => DATA_SOURCE.type === 'supabase'
export const isUsingLocal = () => DATA_SOURCE.type === 'local'