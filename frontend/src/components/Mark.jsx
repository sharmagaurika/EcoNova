import React from 'react'

export default function Mark({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden className="shrink-0">
        <path
          fill="#ff8ec8"
          d="M12 1.8l2.1 6.6 6.9.2-5.4 4.2 1.9 6.6L12 15.7 6.5 19.4l1.9-6.6L3 8.6l6.9-.2L12 1.8z"
        />
      </svg>
      EcoNova
    </span>
  )
}
