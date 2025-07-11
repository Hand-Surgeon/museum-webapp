import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ErrorBoundary from './components/ErrorBoundary'
import LoadingSpinner from './components/LoadingSpinner'
import { useLanguage } from './contexts/LanguageContext'
import { useFocusManagement } from './hooks/useFocusManagement'
import PerformanceIndicator from './components/PerformanceIndicator'
import DiagnosticsPanel from './components/DiagnosticsPanel'

// Lazy load pages
const Home = lazy(() => import('./pages/Home'))
const Gallery = lazy(() => import('./pages/Gallery'))
const ArtworkDetail = lazy(() => import('./pages/ArtworkDetail'))

function App() {
  // Temporarily disable performance monitoring to isolate issues
  // usePerformanceMonitor()
  useFocusManagement()
  const { t } = useLanguage()

  return (
    <ErrorBoundary>
      <div className="app">
        <a href="#main-content" className="skip-link">
          {t('accessibility.skipToContent')}
        </a>
        <Header />
        <main id="main-content" role="main" tabIndex={-1}>
          <Suspense fallback={<LoadingSpinner message="페이지를 불러오는 중..." />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/artwork/:id" element={<ArtworkDetail />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <PerformanceIndicator />
        {import.meta.env.DEV && <DiagnosticsPanel />}
      </div>
    </ErrorBoundary>
  )
}

export default App
