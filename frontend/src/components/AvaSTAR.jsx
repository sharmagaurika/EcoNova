import React from 'react'
import { motion } from 'framer-motion'

// 5-pointed star SVG component
const StarShape = ({ size, color, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <defs>
      <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={color} />
        <stop offset="100%" stopColor="#1e293b" />
      </linearGradient>
    </defs>
    <path
      fill="url(#starGradient)"
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
    />
  </svg>
)

const AvaSTAR = ({ ecoScore, carbonMass, isHighEcoScore, isHighCarbonMass }) => {
  // Pink/violet color palette
  const getStarColor = () => {
    if (isHighCarbonMass) return '#4B5563'
    if (isHighEcoScore) return '#FF85C1' // Lighter pink
    return '#7B61FF'
  }

  const getAuraColor = () => {
    if (isHighCarbonMass) return 'rgba(75, 85, 99, 0.3)'
    if (isHighEcoScore) return 'rgba(255, 133, 193, 0.4)'
    return 'rgba(123, 97, 255, 0.3)'
  }

  const getGlowIntensity = () => {
    if (isHighCarbonMass) return 20
    if (isHighEcoScore) return 70
    return 50
  }

  const starColor = getStarColor()
  const auraColor = getAuraColor()
  const glowIntensity = getGlowIntensity()

  return (
    <div className="relative w-72 h-72 flex items-center justify-center">
      {/* Outer Aura - glowing effect */}
      {isHighEcoScore && !isHighCarbonMass && (
        <>
          <motion.div
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute w-64 h-64 rounded-full"
            style={{
              background: `radial-gradient(circle, ${auraColor} 0%, transparent 70%)`,
              filter: 'blur(20px)',
            }}
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3
            }}
            className="absolute w-52 h-52 rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(255, 158, 202, 0.3) 0%, transparent 70%)`,
              filter: 'blur(15px)',
            }}
          />
        </>
      )}

      {/* Space Debris - gray asteroids */}
      {isHighCarbonMass && (
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ rotate: 360 }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute"
              style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${i * 60}deg) translateY(-100px)`,
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                className="w-8 h-8 bg-cosmic-debris rounded-full"
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Main 5-Pointed Star */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 3, -3, 0],
        }}
        transition={{
          duration: isHighCarbonMass ? 5 : 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative"
        style={{
          filter: `drop-shadow(0 0 ${glowIntensity}px ${starColor}) drop-shadow(0 0 ${glowIntensity * 1.5}px ${starColor}60)`,
        }}
      >
        <StarShape size={140} color={starColor} />
        
        {/* Cute face on star */}
        <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-white rounded-full opacity-90 top-[35%] left-[28%]" />
        <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-white rounded-full opacity-90 top-[35%] right-[28%]" />
        
        {/* Eye sparkle */}
        <div className="absolute w-2 h-2 bg-white rounded-full opacity-60 top-[38%] left-[30%]" />
        <div className="absolute w-2 h-2 bg-white rounded-full opacity-60 top-[38%] right-[30%]" />
        
        {/* Pink blush */}
        <div className="absolute w-8 h-4 bg-cosmic-pink rounded-full opacity-35 top-[55%] left-[18%]" style={{ filter: 'blur(3px)' }} />
        <div className="absolute w-8 h-4 bg-cosmic-pink rounded-full opacity-35 top-[55%] right-[18%]" style={{ filter: 'blur(3px)' }} />
        
        {/* Smile */}
        <div className="absolute w-8 h-4 border-b-2 border-white rounded-full opacity-70 top-[65%] left-1/2 -translate-x-1/2" />
      </motion.div>

      {/* Inner glow ring */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
        className="absolute w-44 h-44 rounded-full"
        style={{
          border: `2px solid ${starColor}`,
          opacity: 0.2,
        }}
      />

      {/* Orbiting small stars */}
      {!isHighCarbonMass && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ rotate: 360 }}
              transition={{
                duration: 6 + i,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute"
              style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${i * 45}deg) translateY(-85px)`,
              }}
            >
              <motion.div
                animate={{ scale: [0.7, 1.2, 0.7], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
              >
                <StarShape 
                  size={16} 
                  color={i % 2 === 0 ? '#FF85C1' : '#7B61FF'} 
                />
              </motion.div>
            </motion.div>
          ))}
        </>
      )}

      {/* Status text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute -bottom-12"
      >
        <span 
          className="text-sm font-mono px-4 py-1.5 rounded-full"
          style={{ 
            color: starColor,
            background: `${starColor}20`,
            border: `1px solid ${starColor}40`
          }}
        >
          {isHighCarbonMass 
            ? 'Space Debris Mode' 
            : isHighEcoScore 
              ? 'Super Nova!' 
              : 'Cosmic Cruising'}
        </span>
      </motion.div>
    </div>
  )
}

export default AvaSTAR
