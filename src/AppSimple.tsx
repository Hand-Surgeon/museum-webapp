// Simplified App for debugging loading issues
import { useState, useEffect } from 'react'
import { debugLog } from './utils/debug'

function AppSimple() {
  const [isLoading, setIsLoading] = useState(true)
  const [error] = useState<string | null>(null)

  useEffect(() => {
    debugLog('AppSimple mounted')

    // Simulate initialization
    setTimeout(() => {
      debugLog('AppSimple initialization complete')
      setIsLoading(false)
    }, 1000)

    return () => {
      debugLog('AppSimple unmounted')
    }
  }, [])

  if (isLoading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Loading Simple App...</h1>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Error: {error}</h1>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Simple App Loaded Successfully</h1>
      <p>If you see this message, the basic app structure is working.</p>
      <button onClick={() => (window.location.href = '/')}>Go to Main App</button>
    </div>
  )
}

export default AppSimple
