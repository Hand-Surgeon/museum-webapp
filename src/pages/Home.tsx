import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { museums } from '../data'
import { useLanguage } from '../contexts/LanguageContext'
import { getFeaturedArtworks, getAllArtworks } from '../services/artworkService'
import { Artwork } from '../data/types'
import ArtworkGrid from '../components/ArtworkGrid'
import './Home.css'

function Home() {
  const { t } = useLanguage()
  const [featuredArtworks, setFeaturedArtworks] = useState<Artwork[]>([])
  const [allArtworks, setAllArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [featured, all] = await Promise.all([getFeaturedArtworks(), getAllArtworks()])
        setFeaturedArtworks(featured)
        setAllArtworks(all)
      } catch (error) {
        console.error('Failed to load artworks:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const museumStats = museums.slice(1).map((museum) => ({
    name: museum,
    count: allArtworks.filter((artwork) => artwork.museum === museum).length,
    translationKey:
      museum === '고고관'
        ? 'archaeologyHall'
        : museum === '미술관'
          ? 'artHall'
          : museum === '기증관'
            ? 'donationHall'
            : museum === '역사관'
              ? 'historyHall'
              : museum === '아시아관'
                ? 'asianArtHall'
                : museum,
  }))

  return (
    <div className="home-page">
      <section className="hero">
        <div className="container">
          <h1>{t('home.welcomeTitle')}</h1>
          <p>{t('home.welcomeDescription')}</p>
          <Link
            to="/gallery"
            className="btn btn-primary"
            onClick={() => console.log('Gallery link clicked')}
          >
            {t('home.viewAllWorks')}
          </Link>
        </div>
      </section>

      <section className="featured-section">
        <div className="container">
          <h2 className="section-title">{t('home.featuredWorks')}</h2>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <ArtworkGrid artworks={featuredArtworks} limit={6} showTitle={false} />
          )}
          <div className="view-all-link">
            <Link to="/gallery" className="btn btn-secondary">
              {t('home.viewAllWorks')}
            </Link>
          </div>
        </div>
      </section>

      <section className="museums-section">
        <div className="container">
          <h2 className="section-title">{t('home.museumsTitle')}</h2>
          <div className="museums-grid">
            {museumStats.map((museum) => (
              <Link
                key={museum.name}
                to={`/gallery?museum=${encodeURIComponent(museum.name)}`}
                className="museum-card"
              >
                <h3 className="museum-name">{t(`home.${museum.translationKey}`)}</h3>
                <p className="museum-count">{t('gallery.results', { count: museum.count })}</p>
                <p className="museum-description">
                  {t(`home.museumDescription.${museum.translationKey}`)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
