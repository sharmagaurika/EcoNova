import React from 'react'
import { motion } from 'framer-motion'

// Small star for the map
const StarIcon = ({ color, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      fill={color}
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
    />
  </svg>
)

const CosmicMap = ({ friends, userId, constellationMode, focusingFriends }) => {
  const getStarBrightness = (ecoScore) => {
    if (ecoScore >= 90) return 'brightness-150'
    if (ecoScore >= 70) return 'brightness-110'
    if (ecoScore >= 50) return 'brightness-80'
    return 'brightness-50'
  }

  const getStarColor = (ecoScore) => {
    if (ecoScore >= 90) return '#FF85C1' // Lighter pink
    if (ecoScore >= 70) return '#7B61FF' // Lavender
    if (ecoScore >= 50) return '#5222A5' // Violet
    return '#6B7280' // Gray
  }

  const renderConstellationLines = () => {
    if (!constellationMode || focusingFriends.length < 2) return null

    const lines = []
    for (let i = 0; i < focusingFriends.length; i++) {
      for (let j = i + 1; j < focusingFriends.length; j++) {
        const friend1 = focusingFriends[i]
        const friend2 = focusingFriends[j]
        
        lines.push(
          <motion.line
            key={`${friend1.id}-${friend2.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            x1={`${friend1.x}%`}
            y1={`${friend1.y}%`}
            x2={`${friend2.x}%`}
            y2={`${friend2.y}%`}
            stroke="url(#constellationGradientPink)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        )
      }
    }
    return lines
  }

  return (
    <div className="glass-card p-8">
      <div className="flex items-center justify-between mb-8">
        <motion.h2 
          className="text-3xl font-heading tracking-wide"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          COSMIC <span className="text-cosmic-cyan">MAP</span>
        </motion.h2>
        
        {constellationMode && focusingFriends.length >= 2 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2 px-5 py-2 bg-cosmic-pink/20 rounded-full"
          >
            <motion.span 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-cosmic-pink"
            />
            <span className="text-cosmic-pinkLight text-sm font-medium">Constellation Active</span>
          </motion.div>
        )}
      </div>

      {/* Map */}
      <div className="relative w-full h-[450px] bg-cosmic-deep/50 rounded-3xl overflow-hidden border-2 border-cosmic-pink/10">
        <svg className="absolute inset-0 w-full h-full z-10">
          <defs>
            <linearGradient id="constellationGradientPink" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF85C1" />
              <stop offset="50%" stopColor="#7B61FF" />
              <stop offset="100%" stopColor="#FF85C1" />
            </linearGradient>
          </defs>
          {renderConstellationLines()}
        </svg>

        {/* Background stars */}
        {[...Array(60)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
            animate={{ opacity: [0.2, 0.9, 0.2] }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Friend stars */}
        {friends.map((friend, index) => (
          <motion.div
            key={friend.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1, type: "spring" }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
            style={{ left: `${friend.x}%`, top: `${friend.y}%` }}
            whileHover={{ scale: 1.4 }}
          >
            {/* Glow */}
            <motion.div
              animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2 + index * 0.3, repeat: Infinity }}
              className="absolute w-20 h-20 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
              style={{ background: `radialGradient(circle, ${getStarColor(friend.ecoScore)}50 0%, transparent 70%)` }}
            />

            {/* Star body */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3 + index, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-14 h-14 flex items-center justify-center"
              style={{
                filter: `drop-shadow(0 0 20px ${getStarColor(friend.ecoScore)})`,
              }}
            >
              <StarIcon color={getStarColor(friend.ecoScore)} size={56} />
              
              {/* Focus indicator */}
              {friend.isFocusing && (
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-cosmic-pink rounded-full"
                />
              )}
            </motion.div>

            {/* Name */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className="absolute -bottom-8 left-1/2 transform -translate-x-1/2"
            >
              <span className="text-xs font-medium text-white bg-cosmic-navy/90 px-3 py-1.5 rounded-full shadow-lg">
                {friend.name}
              </span>
            </motion.div>

            {/* Score */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.4 }}
              className="absolute -top-7 left-1/2 transform -translate-x-1/2"
            >
              <span 
                className="text-xs font-bold font-mono px-2 py-0.5 rounded-full"
                style={{ color: getStarColor(friend.ecoScore), background: `${getStarColor(friend.ecoScore)}20` }}
              >
                {friend.ecoScore}
              </span>
            </motion.div>
          </motion.div>
        ))}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 glass px-4 py-3 rounded-2xl">
          <p className="text-xs text-cosmic-gray mb-2">Star Brightness = Eco Score</p>
          <div className="flex gap-4 text-xs font-medium">
            <span style={{ color: '#FF85C1' }}>90+</span>
            <span style={{ color: '#7B61FF' }}>70-89</span>
            <span style={{ color: '#5222A5' }}>50-69</span>
            <span style={{ color: '#6B7280' }}>Under 50</span>
          </div>
        </div>

        {constellationMode && focusingFriends.length >= 2 && (
          <div className="absolute top-4 right-4 glass px-4 py-3 rounded-2xl">
            <p className="text-xs text-cosmic-pinkLight">
              {focusingFriends.map(f => f.name).join(' -- ')} focusing
            </p>
          </div>
        )}
      </div>

      {/* Friend list */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {friends.map((friend, index) => (
          <motion.div
            key={friend.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            className="glass p-4 rounded-3xl text-center"
          >
            <motion.div
              className="w-10 h-10 mx-auto mb-2 flex items-center justify-center"
              style={{ filter: `drop-shadow(0 0 12px ${getStarColor(friend.ecoScore)})` }}
            >
              <StarIcon color={getStarColor(friend.ecoScore)} size={40} />
            </motion.div>
            <p className="text-sm font-medium truncate">{friend.name}</p>
            <p className="text-xs text-cosmic-gray">{friend.ecoScore} pts</p>
            {friend.isFocusing && <span className="text-xs text-cosmic-pink font-medium">Focusing</span>}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default CosmicMap
