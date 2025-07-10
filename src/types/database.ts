// Supabase 데이터베이스 스키마 타입 정의
export interface DBArtwork {
  id: number
  title: string
  title_en: string | null
  period: string
  category: string
  material: string
  dimensions: string | null
  description: string
  detailed_description: string | null
  historical_background: string | null
  artistic_features: string | null
  image_url: string
  featured: boolean
  cultural_property: string | null
  national_treasure_number: number | null
  museum: string
  inventory_number: string
  era: string | null
  significance: string | null
  display_location: string | null
}