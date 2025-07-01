// Re-export all data and types from separate files
export type { Artwork } from './types'
export { 
  culturalPropertyGrades, 
  detailedPeriods, 
  categories, 
  periods, 
  museums 
} from './constants'
export { default as artworks } from './artworks.json'