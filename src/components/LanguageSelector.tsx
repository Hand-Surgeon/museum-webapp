import React, { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' }
  ] as const

  const currentLanguage = languages.find(lang => lang.code === language)

  const handleLanguageChange = (langCode: 'ko' | 'en' | 'zh' | 'ja') => {
    setLanguage(langCode)
    setIsOpen(false)
  }

  return (
    <div className="language-selector">
      <button 
        className="language-selector-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Language"
      >
        <span className="language-flag">{currentLanguage?.flag}</span>
        <span className="language-name">{currentLanguage?.name}</span>
        <span className={`language-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>
      
      {isOpen && (
        <div className="language-dropdown">
          {languages.map(lang => (
            <button
              key={lang.code}
              className={`language-option ${language === lang.code ? 'active' : ''}`}
              onClick={() => handleLanguageChange(lang.code)}
            >
              <span className="language-flag">{lang.flag}</span>
              <span className="language-name">{lang.name}</span>
            </button>
          ))}
        </div>
      )}

      <style jsx>{`
        .language-selector {
          position: relative;
          display: inline-block;
        }

        .language-selector-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: white;
          border: 1px solid #ddd;
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .language-selector-button:hover {
          background: #f5f5f5;
          border-color: #2c5530;
        }

        .language-flag {
          font-size: 1.2rem;
        }

        .language-name {
          font-weight: 500;
          color: #333;
        }

        .language-arrow {
          font-size: 0.8rem;
          color: #666;
          transition: transform 0.2s ease;
        }

        .language-arrow.open {
          transform: rotate(180deg);
        }

        .language-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.25rem;
          background: white;
          border: 1px solid #ddd;
          border-radius: 0.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          min-width: 160px;
          z-index: 1000;
        }

        .language-option {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.75rem 1rem;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background-color 0.2s ease;
          border-radius: 0;
        }

        .language-option:first-child {
          border-radius: 0.5rem 0.5rem 0 0;
        }

        .language-option:last-child {
          border-radius: 0 0 0.5rem 0.5rem;
        }

        .language-option:hover {
          background: #f5f5f5;
        }

        .language-option.active {
          background: #2c5530;
          color: white;
        }

        .language-option.active .language-name {
          color: white;
        }

        @media (max-width: 768px) {
          .language-selector-button {
            padding: 0.4rem 0.8rem;
            font-size: 0.8rem;
          }
          
          .language-name {
            display: none;
          }
          
          .language-dropdown {
            min-width: 120px;
          }
        }
      `}</style>
    </div>
  )
}

export default LanguageSelector