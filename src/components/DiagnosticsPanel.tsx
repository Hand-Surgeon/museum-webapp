import { useState, useEffect } from 'react'
import { debugLog } from '../utils/debug'

interface DiagnosticInfo {
  timestamp: string
  browserInfo: string
  localStorage: Record<string, string>
  performanceEnabled: boolean
  translations: boolean
  errors: string[]
}

export default function DiagnosticsPanel() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticInfo | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (import.meta.env.DEV) {
      // Keyboard shortcut to toggle diagnostics (Ctrl+Shift+D)
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
          setIsVisible((prev) => !prev)
        }
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    if (isVisible) {
      const errors: string[] = []

      // Collect diagnostic info
      try {
        const localStorageData: Record<string, string> = {}
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key) {
            localStorageData[key] = localStorage.getItem(key) || ''
          }
        }

        setDiagnostics({
          timestamp: new Date().toISOString(),
          browserInfo: navigator.userAgent,
          localStorage: localStorageData,
          performanceEnabled: import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true',
          translations: !!window.localStorage.getItem('museum-language'),
          errors,
        })
      } catch (error) {
        errors.push(String(error))
        debugLog('Error collecting diagnostics', error)
      }
    }
  }, [isVisible])

  if (!import.meta.env.DEV || !isVisible) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        right: 0,
        width: '400px',
        maxHeight: '50vh',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        color: 'white',
        padding: '1rem',
        borderRadius: '8px 0 0 0',
        overflowY: 'auto',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 9999,
      }}
    >
      <h3 style={{ margin: '0 0 1rem 0' }}>Diagnostics Panel</h3>
      <button
        onClick={() => setIsVisible(false)}
        style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
      >
        ✕
      </button>

      {diagnostics && (
        <div>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Timestamp:</strong> {diagnostics.timestamp}
          </div>

          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Performance Monitoring:</strong>{' '}
            {diagnostics.performanceEnabled ? 'Enabled' : 'Disabled'}
          </div>

          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Language Set:</strong> {diagnostics.translations ? 'Yes' : 'No'}
          </div>

          <div style={{ marginBottom: '0.5rem' }}>
            <strong>LocalStorage:</strong>
            <pre style={{ margin: '0.25rem 0' }}>
              {JSON.stringify(diagnostics.localStorage, null, 2)}
            </pre>
          </div>

          {diagnostics.errors.length > 0 && (
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Errors:</strong>
              {diagnostics.errors.map((error, i) => (
                <div key={i} style={{ color: 'red' }}>
                  {error}
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => {
              localStorage.clear()
              window.location.reload()
            }}
            style={{ marginTop: '1rem' }}
          >
            Clear Storage & Reload
          </button>
        </div>
      )}
    </div>
  )
}
