import { useEffect } from 'react'
import { PerformanceMonitor } from '../utils/performance'

export function usePerformanceMonitor() {
  useEffect(() => {
    const monitor = PerformanceMonitor.getInstance()
    monitor.measureWebVitals()

    // Report metrics when page is about to unload
    const handleUnload = () => {
      const metrics = monitor.getMetricsSummary()
      
      // Log final metrics
      if (import.meta.env.DEV) {
        console.log('Final Performance Metrics:', metrics)
      }

      // Could send to analytics endpoint here
      if (navigator.sendBeacon && import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
        const data = JSON.stringify({
          url: window.location.href,
          timestamp: Date.now(),
          metrics
        })
        // navigator.sendBeacon('/api/analytics/performance', data)
      }
    }

    window.addEventListener('beforeunload', handleUnload)
    
    return () => {
      window.removeEventListener('beforeunload', handleUnload)
    }
  }, [])
}

export function useComponentPerformance(componentName: string) {
  useEffect(() => {
    const monitor = PerformanceMonitor.getInstance()
    const endMeasure = monitor.measureComponentRender(componentName)
    
    return endMeasure
  })
}