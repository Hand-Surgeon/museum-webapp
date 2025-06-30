import './LoadingSpinner.css'

interface LoadingSpinnerProps {
  message?: string
}

export default function LoadingSpinner({ message = "로딩 중..." }: LoadingSpinnerProps) {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p className="loading-message">{message}</p>
      </div>
    </div>
  )
}