interface PerformanceMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  timestamp: number
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: PerformanceMetric[] = []
  private isEnabled: boolean

  private constructor() {
    this.isEnabled = import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true'
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  measureWebVitals(): void {
    if (!this.isEnabled || typeof window === 'undefined') return

    // First Contentful Paint (FCP)
    this.observePaint('first-contentful-paint', 'FCP', {
      good: 1800,
      poor: 3000
    })

    // Largest Contentful Paint (LCP)
    this.observeLCP()

    // First Input Delay (FID)
    this.observeFID()

    // Cumulative Layout Shift (CLS)
    this.observeCLS()

    // Time to First Byte (TTFB)
    this.measureTTFB()
  }

  private observePaint(entryType: string, metricName: string, thresholds: { good: number; poor: number }): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === entryType) {
            const value = entry.startTime
            const rating = this.getRating(value, thresholds.good, thresholds.poor)
            this.addMetric({
              name: metricName,
              value,
              rating,
              timestamp: Date.now()
            })
          }
        }
      })
      observer.observe({ entryTypes: ['paint'] })
    }
  }

  private observeLCP(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        const value = lastEntry.startTime
        const rating = this.getRating(value, 2500, 4000)
        this.addMetric({
          name: 'LCP',
          value,
          rating,
          timestamp: Date.now()
        })
        observer.disconnect()
      })
      observer.observe({ entryTypes: ['largest-contentful-paint'] })
    }
  }

  private observeFID(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const value = entry.processingStart - entry.startTime
          const rating = this.getRating(value, 100, 300)
          this.addMetric({
            name: 'FID',
            value,
            rating,
            timestamp: Date.now()
          })
          observer.disconnect()
        }
      })
      observer.observe({ entryTypes: ['first-input'] })
    }
  }

  private observeCLS(): void {
    if ('PerformanceObserver' in window) {
      let clsValue = 0
      let clsEntries: PerformanceEntry[] = []

      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsEntries.push(entry)
            clsValue += (entry as any).value
          }
        }
      })
      observer.observe({ entryTypes: ['layout-shift'] })

      // Report CLS when page is hidden
      window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          const rating = this.getRating(clsValue, 0.1, 0.25)
          this.addMetric({
            name: 'CLS',
            value: clsValue,
            rating,
            timestamp: Date.now()
          })
        }
      })
    }
  }

  private measureTTFB(): void {
    if ('performance' in window && 'getEntriesByType' in window.performance) {
      const navigationEntries = window.performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
      if (navigationEntries.length > 0) {
        const navigation = navigationEntries[0]
        const value = navigation.responseStart - navigation.fetchStart
        const rating = this.getRating(value, 800, 1800)
        this.addMetric({
          name: 'TTFB',
          value,
          rating,
          timestamp: Date.now()
        })
      }
    }
  }

  private getRating(value: number, goodThreshold: number, poorThreshold: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= goodThreshold) return 'good'
    if (value <= poorThreshold) return 'needs-improvement'
    return 'poor'
  }

  private addMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric)
    
    // Log to console in development
    if (import.meta.env.DEV) {
      const emoji = metric.rating === 'good' ? '✅' : metric.rating === 'needs-improvement' ? '⚠️' : '❌'
      console.log(`${emoji} ${metric.name}: ${metric.value.toFixed(2)}ms (${metric.rating})`)
    }

    // Send to analytics if enabled
    this.sendToAnalytics(metric)
  }

  private sendToAnalytics(metric: PerformanceMetric): void {
    // Placeholder for analytics integration
    // This could send data to Google Analytics, Sentry, or custom endpoint
    if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
      // Example: Send to Google Analytics
      if ((window as any).gtag) {
        (window as any).gtag('event', 'web_vitals', {
          event_category: 'Performance',
          event_label: metric.name,
          value: Math.round(metric.value),
          metric_rating: metric.rating
        })
      }
    }
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics]
  }

  getMetricsSummary(): Record<string, { value: number; rating: string }> {
    const summary: Record<string, { value: number; rating: string }> = {}
    const latestMetrics = new Map<string, PerformanceMetric>()

    // Get latest value for each metric
    for (const metric of this.metrics) {
      latestMetrics.set(metric.name, metric)
    }

    for (const [name, metric] of latestMetrics) {
      summary[name] = {
        value: metric.value,
        rating: metric.rating
      }
    }

    return summary
  }

  measureComponentRender(componentName: string): () => void {
    if (!this.isEnabled) return () => {}

    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      const renderTime = endTime - startTime
      
      if (import.meta.env.DEV && renderTime > 16) {
        console.warn(`⚠️ Slow render detected for ${componentName}: ${renderTime.toFixed(2)}ms`)
      }
    }
  }
}