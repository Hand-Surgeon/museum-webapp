// HTML 태그 및 스크립트 인젝션 방지를 위한 sanitization 함수

// 기본 HTML 엔티티 이스케이프
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// 검색어 sanitization
export function sanitizeSearchInput(input: string): string {
  // 1. 트림
  let sanitized = input.trim()

  // 2. 최대 길이 제한 (100자)
  sanitized = sanitized.substring(0, 100)

  // 3. 특수 문자 제거 (한글, 영문, 숫자, 공백만 허용)
  sanitized = sanitized.replace(/[^\w\s가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9]/g, '')

  // 4. 연속된 공백을 단일 공백으로
  sanitized = sanitized.replace(/\s+/g, ' ')

  return sanitized
}

// URL 파라미터 sanitization
export function sanitizeUrlParam(param: string): string {
  // URL 인코딩된 문자열만 허용
  const decoded = decodeURIComponent(param)
  return encodeURIComponent(sanitizeSearchInput(decoded))
}

// 숫자 파라미터 검증
export function sanitizeNumberParam(param: string, min: number = 1, max: number = 999999): number {
  const num = parseInt(param, 10)

  if (isNaN(num)) {
    return min
  }

  return Math.max(min, Math.min(max, num))
}

// 카테고리/필터 값 검증 (화이트리스트 방식)
export function sanitizeFilterValue<T extends string>(
  value: string,
  allowedValues: readonly T[],
  defaultValue: T
): T {
  if (allowedValues.includes(value as T)) {
    return value as T
  }
  return defaultValue
}
