import { Link } from 'react-router-dom';
import type { Artwork } from '../data';
import { useLanguage } from '../contexts/LanguageContext';
import './ArtworkCard.css';

interface ArtworkCardProps {
  artwork: Artwork;
}

export default function ArtworkCard({ artwork }: ArtworkCardProps) {
  const { t } = useLanguage();

  return (
    <div className="artwork-card">
      <Link to={`/artwork/${artwork.id}`}>
        <div className="artwork-image-wrapper">
          <img
            src={artwork.imageUrl}
            alt={artwork.title}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-artwork.jpg';
            }}
          />
          {artwork.featured && (
            <div className="featured-badge">{t('common.featured')}</div>
          )}
          {artwork.culturalProperty && (
            <div className="cultural-property-badge">
              {artwork.culturalProperty}
            </div>
          )}
        </div>
        <div className="artwork-info">
          <h3 className="artwork-title">{artwork.title}</h3>
          {artwork.titleEn && (
            <p className="artwork-title-en">{artwork.titleEn}</p>
          )}
          <p className="artwork-period">{artwork.period}</p>
          <p className="artwork-museum">{artwork.museum}</p>
          <p className="artwork-description">
            {artwork.description.length > 100
              ? `${artwork.description.substring(0, 100)}...`
              : artwork.description}
          </p>
        </div>
      </Link>
    </div>
  );
}
