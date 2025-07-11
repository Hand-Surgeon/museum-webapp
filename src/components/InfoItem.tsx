interface InfoItemProps {
  label: string
  value: string
}

export default function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="info-item">
      <span className="info-label">{label}:</span>
      <span className="info-value">{value}</span>
    </div>
  )
}
