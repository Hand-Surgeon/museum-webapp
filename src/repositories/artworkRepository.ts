import { supabase } from '../lib/supabase'
import { DBArtwork } from '../types/database'
import { Artwork } from '../data/types'

export interface IArtworkRepository {
  findAll(): Promise<Artwork[]>
  findById(id: number): Promise<Artwork | null>
  findFeatured(): Promise<Artwork[]>
  findByCategory(category: string): Promise<Artwork[]>
  findByMuseum(museum: string): Promise<Artwork[]>
  findByPeriod(period: string): Promise<Artwork[]>
  search(query: string): Promise<Artwork[]>
  findByFilters(filters: ArtworkFilters): Promise<Artwork[]>
}

export interface ArtworkFilters {
  category?: string
  period?: string
  museum?: string
  featured?: boolean
  search?: string
}

// 데이터베이스 필드명을 클라이언트 필드명으로 변환
function transformArtworkFromDB(dbArtwork: DBArtwork): Artwork {
  return {
    id: dbArtwork.id,
    title: dbArtwork.title,
    titleEn: dbArtwork.title_en,
    period: dbArtwork.period,
    category: dbArtwork.category,
    material: dbArtwork.material,
    dimensions: dbArtwork.dimensions || '',
    description: dbArtwork.description,
    detailedDescription: dbArtwork.detailed_description,
    historicalBackground: dbArtwork.historical_background,
    artisticFeatures: dbArtwork.artistic_features,
    imageUrl: dbArtwork.image_url,
    featured: dbArtwork.featured,
    culturalProperty: dbArtwork.cultural_property,
    nationalTreasureNumber: dbArtwork.national_treasure_number,
    museum: dbArtwork.museum,
    inventoryNumber: dbArtwork.inventory_number,
    era: dbArtwork.era,
    significance: dbArtwork.significance,
    displayLocation: dbArtwork.display_location
  }
}

export class ArtworkRepository implements IArtworkRepository {
  async findAll(): Promise<Artwork[]> {
    const { data, error } = await supabase
      .from('artworks')
      .select('*')
      .order('id', { ascending: true })
    
    if (error) {
      console.error('Error fetching artworks:', error)
      throw error
    }
    
    return (data as DBArtwork[] || []).map(transformArtworkFromDB)
  }

  async findById(id: number): Promise<Artwork | null> {
    const { data, error } = await supabase
      .from('artworks')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching artwork:', error)
      return null
    }
    
    return data ? transformArtworkFromDB(data as DBArtwork) : null
  }

  async findFeatured(): Promise<Artwork[]> {
    const { data, error } = await supabase
      .from('artworks')
      .select('*')
      .eq('featured', true)
      .order('id', { ascending: true })
    
    if (error) {
      console.error('Error fetching featured artworks:', error)
      throw error
    }
    
    return (data as DBArtwork[] || []).map(transformArtworkFromDB)
  }

  async findByCategory(category: string): Promise<Artwork[]> {
    const { data, error } = await supabase
      .from('artworks')
      .select('*')
      .eq('category', category)
      .order('id', { ascending: true })
    
    if (error) {
      console.error('Error fetching artworks by category:', error)
      throw error
    }
    
    return (data as DBArtwork[] || []).map(transformArtworkFromDB)
  }

  async findByMuseum(museum: string): Promise<Artwork[]> {
    const { data, error } = await supabase
      .from('artworks')
      .select('*')
      .eq('museum', museum)
      .order('id', { ascending: true })
    
    if (error) {
      console.error('Error fetching artworks by museum:', error)
      throw error
    }
    
    return (data as DBArtwork[] || []).map(transformArtworkFromDB)
  }

  async findByPeriod(period: string): Promise<Artwork[]> {
    const { data, error } = await supabase
      .from('artworks')
      .select('*')
      .eq('period', period)
      .order('id', { ascending: true })
    
    if (error) {
      console.error('Error fetching artworks by period:', error)
      throw error
    }
    
    return (data as DBArtwork[] || []).map(transformArtworkFromDB)
  }

  async search(query: string): Promise<Artwork[]> {
    const { data, error } = await supabase
      .from('artworks')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,detailed_description.ilike.%${query}%`)
      .order('id', { ascending: true })
    
    if (error) {
      console.error('Error searching artworks:', error)
      throw error
    }
    
    return (data as DBArtwork[] || []).map(transformArtworkFromDB)
  }

  async findByFilters(filters: ArtworkFilters): Promise<Artwork[]> {
    let query = supabase
      .from('artworks')
      .select('*')
    
    if (filters.category) {
      query = query.eq('category', filters.category)
    }
    
    if (filters.period) {
      query = query.eq('period', filters.period)
    }
    
    if (filters.museum) {
      query = query.eq('museum', filters.museum)
    }
    
    if (filters.featured !== undefined) {
      query = query.eq('featured', filters.featured)
    }
    
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,detailed_description.ilike.%${filters.search}%`)
    }
    
    const { data, error } = await query.order('id', { ascending: true })
    
    if (error) {
      console.error('Error fetching artworks with filters:', error)
      throw error
    }
    
    return (data as DBArtwork[] || []).map(transformArtworkFromDB)
  }
}

// Singleton instance
export const artworkRepository = new ArtworkRepository()