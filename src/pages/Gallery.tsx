import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { museums } from '../data'
import { useLanguage } from '../contexts/LanguageContext'
import { useArtworkFilter, type FilterActions } from '../hooks/useArtworkFilter'
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation'
import { useDeferredSearch } from '../hooks/useDeferredSearch'
import { useTransitionedActions } from '../hooks/useTransitionedActions'
import { getAllArtworks } from '../services/artworkService'
import { Artwork } from '../data/types'
import FilterControls from '../components/FilterControls'
import ArtworkGrid from '../components/ArtworkGrid'
import VirtualizedArtworkGrid from '../components/VirtualizedArtworkGrid'
import Pagination from '../components/Pagination'
import SkeletonLoader from '../components/SkeletonLoader'
import { sanitizeNumberParam, sanitizeFilterValue } from '../utils/sanitize'

function Gallery() {
  const { t } = useLanguage()
  const [searchParams, setSearchParams] = useSearchParams()
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  const { filters, filteredArtworks, actions } = useArtworkFilter(artworks)

  // Use deferred search for better performance
  const { isSearching } = useDeferredSearch(filters.searchTerm)

  // Wrap filter actions with transitions for better UX
  const { isPending, ...transitionedActions } = useTransitionedActions(actions)

  useEffect(() => {
    async function loadArtworks() {
      try {
        setLoading(true)
        const data = await getAllArtworks()
        setArtworks(data)
      } catch (error) {
        console.error('Failed to load artworks:', error)
      } finally {
        setLoading(false)
      }
    }

    loadArtworks()
  }, [])

  // URL 파라미터에서 초기값 설정
  useEffect(() => {
    const museum = searchParams.get('museum')
    if (museum) {
      const sanitizedMuseum = sanitizeFilterValue(museum, museums, '전체')
      actions.setSelectedMuseum(sanitizedMuseum)
    }

    const page = searchParams.get('page')
    if (page) {
      const pageNum = sanitizeNumberParam(page, 1, 1000)
      setCurrentPage(pageNum)
    }
  }, [searchParams, actions])

  // 페이지네이션 계산
  const paginatedArtworks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredArtworks.slice(startIndex, endIndex)
  }, [filteredArtworks, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredArtworks.length / itemsPerPage)

  // 필터가 변경되면 첫 페이지로 이동
  useEffect(() => {
    setCurrentPage(1)
    const newParams = new URLSearchParams(searchParams)
    newParams.delete('page')
    setSearchParams(newParams)
  }, [filters, searchParams, setSearchParams])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    const newParams = new URLSearchParams(searchParams)
    if (page === 1) {
      newParams.delete('page')
    } else {
      newParams.set('page', page.toString())
    }
    setSearchParams(newParams)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 키보드 네비게이션
  useKeyboardNavigation({
    onArrowLeft: () => {
      if (currentPage > 1) {
        handlePageChange(currentPage - 1)
      }
    },
    onArrowRight: () => {
      if (currentPage < totalPages) {
        handlePageChange(currentPage + 1)
      }
    },
  })

  return (
    <div>
      <div className="gallery-header">
        <div className="container">
          <h1 className="gallery-title">{t('gallery.title')}</h1>
          <p>{t('gallery.description')}</p>
        </div>
      </div>

      <FilterControls
        filters={filters}
        actions={transitionedActions as FilterActions}
        showAdvancedFilters={showAdvancedFilters}
        onToggleAdvancedFilters={() => setShowAdvancedFilters(!showAdvancedFilters)}
      />

      {(isPending || isSearching) && (
        <div className="transition-indicator">
          <span>검색 중...</span>
        </div>
      )}

      {loading ? (
        <div className="container">
          <div className="artwork-grid">
            <SkeletonLoader type="card" count={itemsPerPage} />
          </div>
        </div>
      ) : (
        <>
          {filteredArtworks.length > 100 ? (
            <VirtualizedArtworkGrid artworks={filteredArtworks} />
          ) : (
            <>
              <ArtworkGrid artworks={paginatedArtworks} />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </>
      )}
    </div>
  )
}

export default Gallery
