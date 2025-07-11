import { memo } from 'react'
import './LoadingSpinner.css'

interface LoadingSpinnerProps {
  message?: string
  size?: 'small' | 'medium' | 'large'
  overlay?: boolean
}

function LoadingSpinner({
  message = '로딩 중...',
  size = 'medium',
  overlay = true,
}: LoadingSpinnerProps) {
  return (
    <div className={`loading-container ${overlay ? 'loading-overlay' : ''}`}>
      <div className="loading-spinner">
        <div className={`spinner spinner-${size}`}></div>
        {message && <p className="loading-message">{message}</p>}
      </div>
    </div>
  )
}

export default memo(LoadingSpinner)
