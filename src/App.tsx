import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ErrorBoundary from './components/ErrorBoundary'
import LoadingSpinner from './components/LoadingSpinner'
import { useLanguage } from './contexts/LanguageContext'
import { usePerformanceMonitor } from './hooks/usePerformanceMonitor'
import PerformanceIndicator from './components/PerformanceIndicator'

// Lazy load pages
const Home = lazy(() => import('./pages/Home'))
const Gallery = lazy(() => import('./pages/Gallery'))
const ArtworkDetail = lazy(() => import('./pages/ArtworkDetail'))

function App() {
  usePerformanceMonitor()
  const { t } = useLanguage()
  
  return (
    <ErrorBoundary>
      <div className="app">
        <a href="#main-content" className="skip-link">
          {t('accessibility.skipToContent')}
        </a>
        <Header />
        <main id="main-content" role="main">
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
      </div>
    </ErrorBoundary>
  )
}

export default App