import { Link } from 'react-router-dom'
import { artworks, museums } from '../data/artworks'
import { useLanguage } from '../contexts/LanguageContext'

function Home() {
  const { t } = useLanguage()
  const featuredArtworks = artworks.filter(artwork => artwork.featured)

  const museumStats = museums.slice(1).map(museum => ({
    name: museum,
    count: artworks.filter(artwork => artwork.museum === museum).length,
    translationKey: museum === '고고관' ? 'archaeologyHall' :
                   museum === '미술관' ? 'artHall' :
                   museum === '기증관' ? 'donationHall' :
                   museum === '역사관' ? 'historyHall' :
                   museum === '아시아관' ? 'asianArtHall' : museum
  }))

  return (
    <div>
      <section className="hero">
        <div className="container">
          <h1>{t('home.welcomeTitle')}</h1>
          <p>{t('home.welcomeDescription')}</p>
          <Link to="/gallery" className="btn btn-primary">
            {t('home.viewAllWorks')}
          </Link>
        </div>
      </section>

      <section className="featured-section">
        <div className="container">
          <h2 className="section-title">{t('home.featuredWorks')}</h2>
          <div className="artwork-grid">
            {featuredArtworks.slice(0, 6).map((artwork) => (
              <Link 
                key={artwork.id} 
                to={`/artwork/${artwork.id}`}
                className="artwork-card"
                style={{ textDecoration: 'none' }}
              >
                <img 
                  src={artwork.imageUrl} 
                  alt={artwork.title}
                  className="artwork-image"
                />
                <div className="artwork-info">
                  <h3 className="artwork-title">{artwork.title}</h3>
                  <p className="artwork-period">{artwork.period} · {artwork.museum}</p>
                  {artwork.culturalProperty && (
                    <p className="artwork-cultural-property" style={{ color: '#d4af37', fontWeight: '600', fontSize: '0.9rem' }}>
                      {artwork.culturalProperty}
                    </p>
                  )}
                  <p className="artwork-description">
                    {artwork.description.length > 100 
                      ? `${artwork.description.substring(0, 100)}...` 
                      : artwork.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
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
                style={{ textDecoration: 'none' }}
              >
                <h3 className="museum-name">{t(`home.${museum.translationKey}`)}</h3>
                <p className="museum-count">{museum.count}점</p>
                <p className="museum-description">
                  {museum.name}의 귀중한 소장품을 만나보세요
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