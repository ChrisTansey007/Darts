'use client'
export default function ScoreOverlay({ score, id }) {
  if (score == null) return null
  return (
    <div key={id} className="score-overlay">
      {score}
    </div>
  )
}
