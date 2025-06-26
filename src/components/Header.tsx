import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import LanguageSelector from './LanguageSelector'

function Header() {
  const { t } = useLanguage()

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            {t('header.title')}
          </Link>
          <nav className="nav-section">
            <ul className="nav-links">
              <li><Link to="/">{t('navigation.home')}</Link></li>
              <li><Link to="/gallery">{t('navigation.gallery')}</Link></li>
              <li><a href="#about">{t('navigation.about')}</a></li>
            </ul>
            <LanguageSelector />
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header