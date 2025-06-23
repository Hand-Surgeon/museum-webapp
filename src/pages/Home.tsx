import { Link } from 'react-router-dom'
import { artworks } from '../data/artworks'

function Home() {
  const featuredArtworks = artworks.filter(artwork => artwork.featured)

  return (
    <div>
      <section className="hero">
        <div className="container">
          <h1>국립중앙박물관</h1>
          <p>한국의 역사와 문화를 담은 소중한 유물들을 만나보세요</p>
          <Link to="/gallery" className="btn btn-primary">
            소장품 보기
          </Link>
        </div>
      </section>

      <section className="featured-section">
        <div className="container">
          <h2 className="section-title">주요 소장품</h2>
          <div className="artwork-grid">
            {featuredArtworks.map((artwork) => (
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
                  <p className="artwork-period">{artwork.period}</p>
                  <p className="artwork-description">
                    {artwork.description.length > 100 
                      ? `${artwork.description.substring(0, 100)}...` 
                      : artwork.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home