import React from 'react'
import { motion } from 'framer-motion'

export default function AvaStar({ ecoScore, carbonMass, isHighEco, isHighCarbon }) {
  const color = isHighCarbon ? '#8b97a8' : isHighEco ? '#3dffc8' : '#82a7ff'
  const status = isHighCarbon ? 'Space debris' : isHighEco ? 'Supernova' : 'Cosmic cruise'

  return (
    <div className="relative mx-auto grid h-72 w-72 place-items-center">
      <motion.div
        className="absolute h-64 w-64 rounded-full"
        style={{ background: `radial-gradient(circle, ${color}33, transparent 68%)` }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.7, 0.35] }}
        transition={{ duration: 3.2, repeat: Infinity }}
      />

      <motion.div
        className="absolute h-52 w-52 rounded-full border border-white/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute h-40 w-40 rounded-full border border-signal/20"
        animate={{ rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      />

      {isHighCarbon &&
        Array.from({ length: 7 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-3 w-3 rounded-sm bg-mute/80"
            animate={{ rotate: 360 }}
            transition={{ duration: 7 + i, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '0 90px' }}
          />
        ))}

      <motion.svg
        width="168"
        height="168"
        viewBox="0 0 100 100"
        animate={{ rotate: [0, 4, -4, 0], scale: [1, 1.04, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
        style={{ filter: `drop-shadow(0 0 ${isHighEco ? 28 : 16}px ${color})` }}
      >
        <defs>
          <radialGradient id="avaFill" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor={isHighEco ? '#9dffea' : '#d7e3ff'} />
            <stop offset="55%" stopColor={color} />
            <stop offset="100%" stopColor="#0b1220" />
          </radialGradient>
        </defs>
        <path
          fill="url(#avaFill)"
          d="M50 6 L61 34 L90 36 L68 54 L75 84 L50 68 L25 84 L32 54 L10 36 L39 34 Z"
        />
      </motion.svg>

      <div className="absolute -bottom-2 text-center">
        <p className="kicker">{status}</p>
        <p className="mono text-xs text-mute mt-1">
          {ecoScore} eco · {carbonMass.toFixed(1)} kg mass
        </p>
      </div>
    </div>
  )
}
