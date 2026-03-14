import React from 'react'
import { motion } from 'framer-motion'

const StardustMeter = ({ current, max, level }) => {
  const percentage = (current / max) * 100
  
  // Lighter pink/violet gradient colors
  const getGlowColor = () => {
    if (percentage >= 80) return '#FF85C1' // Lighter pink
    if (percentage >= 50) return '#7B61FF' // Lavender
    return '#3B82F6' // Cyan
  }

  const glowColor = getGlowColor()

  return (
    <div className="glass-card p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-heading tracking-wide text-cosmic-pinkLight">STARDUST</h3>
        </div>
        <div className="text-right">
          <span className="text-2xl font-heading" style={{ color: glowColor }}>
            {current.toLocaleString()}
          </span>
          <span className="text-cosmic-gray text-sm"> / {max.toLocaleString()} XP</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-10 bg-cosmic-deep rounded-full overflow-hidden border-2 border-cosmic-pink/15">
        {/* Progress */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full rounded-full relative"
          style={{
            background: `linear-gradient(90deg, ${glowColor}66, ${glowColor})`,
            boxShadow: `0 0 20px ${glowColor}80, 0 0 40px ${glowColor}40, inset 0 2px 4px rgba(255,255,255,0.3)`,
          }}
        >
          {/* Shine */}
          <motion.div
            animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
              backgroundSize: '200% 100%',
            }}
          />

          {/* Sparkles */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ y: [-3, 3, -3], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5 + i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"
              style={{
                left: `${15 + i * 18}%`,
                boxShadow: '0 0 6px white',
              }}
            />
          ))}
        </motion.div>

        {/* Markers */}
        <div className="absolute inset-0 flex justify-between px-2">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="w-px h-full bg-cosmic-navy/30" />
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="flex justify-between mt-4 text-sm">
        <motion.span whileHover={{ scale: 1.05 }} className="px-4 py-1 rounded-full glass text-cosmic-pink font-medium">
          Level {level}
        </motion.span>
        <span className="text-cosmic-gray font-mono py-1">
          {max - current} XP to next level
        </span>
      </div>
    </div>
  )
}

export default StardustMeter
