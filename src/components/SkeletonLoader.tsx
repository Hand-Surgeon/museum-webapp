import { memo } from 'react'
import './SkeletonLoader.css'

interface SkeletonLoaderProps {
  type?: 'card' | 'list' | 'detail'
  count?: number
}

function SkeletonLoader({ type = 'card', count = 1 }: SkeletonLoaderProps) {
  const renderCard = () => (
    <div className="skeleton-card">
      <div className="skeleton-image"></div>
      <div className="skeleton-content">
        <div className="skeleton-title"></div>
        <div className="skeleton-subtitle"></div>
        <div className="skeleton-text"></div>
        <div className="skeleton-text skeleton-text-short"></div>
      </div>
    </div>
  )

  const renderList = () => (
    <div className="skeleton-list">
      <div className="skeleton-list-item">
        <div className="skeleton-thumbnail"></div>
        <div className="skeleton-list-content">
          <div className="skeleton-title"></div>
          <div className="skeleton-text"></div>
        </div>
      </div>
    </div>
  )

  const renderDetail = () => (
    <div className="skeleton-detail">
      <div className="skeleton-detail-image"></div>
      <div className="skeleton-detail-content">
        <div className="skeleton-title skeleton-title-large"></div>
        <div className="skeleton-subtitle"></div>
        <div className="skeleton-text"></div>
        <div className="skeleton-text"></div>
        <div className="skeleton-text skeleton-text-short"></div>
      </div>
    </div>
  )

  const renderSkeleton = () => {
    switch (type) {
      case 'list':
        return renderList()
      case 'detail':
        return renderDetail()
      case 'card':
      default:
        return renderCard()
    }
  }

  return (
    <div className="skeleton-loader">
      {Array.from({ length: count }, (_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </div>
  )
}

export default memo(SkeletonLoader)