export interface Artwork {
  id: number
  title: string
  titleEn?: string
  period: string
  category: string
  material: string
  dimensions: string
  description: string
  detailedDescription?: string
  historicalBackground?: string
  artisticFeatures?: string
  imageUrl: string
  featured: boolean
  culturalProperty?: string
  nationalTreasureNumber?: string
  museum: string
  inventoryNumber: string
  era?: string
  significance?: string
  displayLocation?: string
}
