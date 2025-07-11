import { memo } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <p>{t('footer.copyright')}</p>
        <address>
          <p>
            {t('footer.address')} |{' '}
            <a href={`tel:${t('footer.phone').replace(/-/g, '')}`} aria-label={t('footer.phone')}>
              {t('footer.phone')}
            </a>
          </p>
        </address>
      </div>
    </footer>
  )
}

export default memo(Footer)
