import { useState, useEffect } from 'react'
import { PerformanceMonitor } from '../utils/performance'
import './PerformanceIndicator.css'

interface PerformanceIndicatorProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

export default function PerformanceIndicator({
  position = 'bottom-right',
}: PerformanceIndicatorProps) {
  const [metrics, setMetrics] = useState<Record<string, { value: number; rating: string }>>({})
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!import.meta.env.DEV) return

    const updateMetrics = () => {
      const monitor = PerformanceMonitor.getInstance()
      setMetrics(monitor.getMetricsSummary())
    }

    // Update metrics every 2 seconds
    const interval = setInterval(updateMetrics, 2000)

    // Initial update after page load
    setTimeout(updateMetrics, 1000)

    return () => clearInterval(interval)
  }, [])

  if (!import.meta.env.DEV || Object.keys(metrics).length === 0) {
    return null
  }

  const getColorForRating = (rating: string) => {
    switch (rating) {
      case 'good':
        return '#4caf50'
      case 'needs-improvement':
        return '#ff9800'
      case 'poor':
        return '#f44336'
      default:
        return '#666'
    }
  }

  return (
    <div className={`performance-indicator ${position} ${isVisible ? 'visible' : ''}`}>
      <button
        className="performance-toggle"
        onClick={() => setIsVisible(!isVisible)}
        aria-label="Toggle performance metrics"
      >
        📊
      </button>

      {isVisible && (
        <div className="performance-metrics">
          <h3>Web Vitals</h3>
          {Object.entries(metrics).map(([name, { value, rating }]) => (
            <div key={name} className="metric">
              <span className="metric-name">{name}:</span>
              <span className="metric-value" style={{ color: getColorForRating(rating) }}>
                {value.toFixed(0)}ms
              </span>
              <span className="metric-rating">({rating})</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
