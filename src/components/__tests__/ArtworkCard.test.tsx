import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ArtworkCard from '../ArtworkCard'
import { Artwork } from '../../data/types'

// Mock LanguageContext
vi.mock('../../contexts/LanguageContext', () => ({
  useLanguage: () => ({
    t: (key: string) => key,
    language: 'ko',
    setLanguage: vi.fn(),
  }),
}))

const mockArtwork: Artwork = {
  id: 1,
  title: '청자 상감운학문 매병',
  titleEn: 'Celadon Vase',
  period: '고려시대',
  category: '도자기',
  material: '청자',
  dimensions: '높이 30cm',
  description: '고려시대 대표적인 청자 작품',
  detailedDescription: '상세 설명',
  historicalBackground: '역사적 배경',
  artisticFeatures: '예술적 특징',
  imageUrl: '/images/artwork1.jpg',
  featured: true,
  culturalProperty: '국보',
  nationalTreasureNumber: 68,
  museum: '국립중앙박물관',
  inventoryNumber: 'NMK-001',
  era: '12세기',
  significance: '고려청자의 정수를 보여주는 작품',
  displayLocation: '도자기실',
}

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('ArtworkCard', () => {
  it('renders artwork information correctly', () => {
    renderWithRouter(<ArtworkCard artwork={mockArtwork} />)

    expect(screen.getByText(mockArtwork.title)).toBeInTheDocument()
    expect(screen.getByText(mockArtwork.titleEn!)).toBeInTheDocument()
    expect(screen.getByText(mockArtwork.period)).toBeInTheDocument()
    expect(screen.getByText(mockArtwork.museum)).toBeInTheDocument()
  })

  it('shows featured badge when artwork is featured', () => {
    renderWithRouter(<ArtworkCard artwork={mockArtwork} />)

    expect(screen.getByText('common.featured')).toBeInTheDocument()
  })

  it('shows cultural property badge when applicable', () => {
    renderWithRouter(<ArtworkCard artwork={mockArtwork} />)

    expect(screen.getByText(mockArtwork.culturalProperty!)).toBeInTheDocument()
  })

  it('truncates long descriptions', () => {
    const longDescription = 'a'.repeat(150)
    const artworkWithLongDesc = { ...mockArtwork, description: longDescription }

    renderWithRouter(<ArtworkCard artwork={artworkWithLongDesc} />)

    const description = screen.getByText(/^a+\.\.\./)
    expect(description.textContent).toHaveLength(103) // 100 chars + '...'
  })

  it('links to artwork detail page', () => {
    renderWithRouter(<ArtworkCard artwork={mockArtwork} />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', `/artwork/${mockArtwork.id}`)
  })
})
