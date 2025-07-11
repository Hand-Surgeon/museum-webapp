interface DescriptionSectionProps {
  title: string
  content: string
  isSignificance?: boolean
}

export default function DescriptionSection({
  title,
  content,
  isSignificance = false,
}: DescriptionSectionProps) {
  return (
    <div className="detail-section">
      <h4>{title}</h4>
      <p className={isSignificance ? 'significance-content' : ''}>{content}</p>
    </div>
  )
}
