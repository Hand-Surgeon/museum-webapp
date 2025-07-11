import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PerformanceMonitor } from '../utils/performance'

describe('PerformanceMonitor', () => {
  let monitor: PerformanceMonitor

  beforeEach(() => {
    // Reset singleton instance
    // @ts-expect-error Accessing private property for testing
    ;(PerformanceMonitor as unknown as { instance: undefined }).instance = undefined
    monitor = PerformanceMonitor.getInstance()

    // Mock performance API
    vi.stubGlobal('performance', {
      now: vi.fn(() => 1000),
      getEntriesByType: vi.fn(() => [
        {
          name: 'navigation',
          fetchStart: 0,
          responseStart: 100,
        },
      ]),
    })
  })

  it('should be a singleton', () => {
    const monitor1 = PerformanceMonitor.getInstance()
    const monitor2 = PerformanceMonitor.getInstance()
    expect(monitor1).toBe(monitor2)
  })

  it('should measure component render time', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    // Mock slow render
    vi.stubGlobal('performance', {
      now: vi
        .fn()
        .mockReturnValueOnce(1000) // Start time
        .mockReturnValueOnce(1050), // End time (50ms render)
    })

    const endMeasure = monitor.measureComponentRender('TestComponent')
    endMeasure()

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Slow render detected for TestComponent: 50.00ms')
    )

    consoleWarnSpy.mockRestore()
  })

  it('should track metrics', () => {
    // Add some metrics manually
    // @ts-expect-error Accessing private method for testing
    ;(monitor as unknown as { addMetric: (metric: unknown) => void }).addMetric({
      name: 'FCP',
      value: 1500,
      rating: 'good',
      timestamp: Date.now(),
    })
    // @ts-expect-error Accessing private method for testing
    ;(monitor as unknown as { addMetric: (metric: unknown) => void }).addMetric({
      name: 'LCP',
      value: 3000,
      rating: 'needs-improvement',
      timestamp: Date.now(),
    })

    const metrics = monitor.getMetrics()
    expect(metrics).toHaveLength(2)
    expect(metrics[0].name).toBe('FCP')
    expect(metrics[1].name).toBe('LCP')
  })

  it('should provide metrics summary', () => {
    // Add metrics
    // @ts-expect-error Accessing private method for testing
    ;(monitor as unknown as { addMetric: (metric: unknown) => void }).addMetric({
      name: 'FCP',
      value: 1500,
      rating: 'good',
      timestamp: Date.now(),
    })
    // @ts-expect-error Accessing private method for testing
    ;(monitor as unknown as { addMetric: (metric: unknown) => void }).addMetric({
      name: 'FCP',
      value: 1800,
      rating: 'good',
      timestamp: Date.now() + 1000,
    })

    const summary = monitor.getMetricsSummary()
    expect(summary.FCP).toEqual({
      value: 1800, // Latest value
      rating: 'good',
    })
  })

  it('should rate metrics correctly', () => {
    // @ts-expect-error Accessing private method for testing
    const getRating = (
      monitor as unknown as { getRating: (value: number, good: number, poor: number) => string }
    ).getRating.bind(monitor)

    // Test good rating
    expect(getRating(50, 100, 300)).toBe('good')

    // Test needs-improvement rating
    expect(getRating(200, 100, 300)).toBe('needs-improvement')

    // Test poor rating
    expect(getRating(400, 100, 300)).toBe('poor')
  })
})
