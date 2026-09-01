import React from 'react'

export default function MiniStar({ ecoScore = 85, className = '' }) {
  const glow = ecoScore > 80 ? '#ff8ec8' : '#7dffe0'
  return (
    <svg width="72" height="72" viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <radialGradient id="miniStar" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#f5e9ff" />
          <stop offset="55%" stopColor={glow} />
          <stop offset="100%" stopColor="#1e1b4b" />
        </radialGradient>
      </defs>
      <path
        fill="url(#miniStar)"
        d="M50 6 L61 34 L90 36 L68 54 L75 84 L50 68 L25 84 L32 54 L10 36 L39 34 Z"
        style={{ filter: `drop-shadow(0 0 10px ${glow})` }}
      />
    </svg>
  )
}
