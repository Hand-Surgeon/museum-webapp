import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import App from './App'
import './index.css'
import { debugLog, debugError } from './utils/debug'

// Add global error handlers for debugging
if (import.meta.env.DEV) {
  window.addEventListener('error', (event) => {
    debugError('Global error:', event.error)
  })

  window.addEventListener('unhandledrejection', (event) => {
    debugError('Unhandled promise rejection:', event.reason)
  })
}

debugLog('Starting app initialization')

try {
  const rootElement = document.getElementById('root')
  if (!rootElement) {
    throw new Error('Root element not found')
  }

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </BrowserRouter>
    </React.StrictMode>
  )

  debugLog('App render initiated')
} catch (error) {
  debugError('Failed to initialize app', error)
  // Fallback error display
  document.body.innerHTML = `
    <div style="padding: 2rem; text-align: center; font-family: sans-serif;">
      <h1>Failed to load the application</h1>
      <p>Please check the console for errors and try refreshing the page.</p>
      <button onclick="window.location.reload()" style="padding: 0.5rem 1rem; margin-top: 1rem;">
        Refresh Page
      </button>
    </div>
  `
}
