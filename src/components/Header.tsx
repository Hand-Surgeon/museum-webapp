import { memo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import LanguageSelector from './LanguageSelector'

function Header() {
  const { t } = useLanguage()
  const location = useLocation()

  return (
    <header className="header" role="banner">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo" aria-label={t('header.title')}>
            {t('header.title')}
          </Link>
          <nav className="nav-section" role="navigation" aria-label="Main navigation">
            <ul className="nav-links" role="list">
              <li>
                <Link to="/" aria-current={location.pathname === '/' ? 'page' : undefined}>
                  {t('navigation.home')}
                </Link>
              </li>
              <li>
                <Link
                  to="/gallery"
                  aria-current={location.pathname === '/gallery' ? 'page' : undefined}
                >
                  {t('navigation.gallery')}
                </Link>
              </li>
              <li>
                <a href="#about">{t('navigation.about')}</a>
              </li>
            </ul>
            <LanguageSelector />
          </nav>
        </div>
      </div>
    </header>
  )
}

export default memo(Header)
