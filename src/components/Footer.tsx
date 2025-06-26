import { useLanguage } from '../contexts/LanguageContext'

function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="footer">
      <div className="container">
        <p>{t('footer.copyright')}</p>
        <p>{t('footer.address')} | {t('footer.phone')}</p>
      </div>
    </footer>
  )
}

export default Footer