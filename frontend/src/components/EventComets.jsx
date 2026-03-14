import React from 'react'
import { motion } from 'framer-motion'

// Small star icon
const SmallStar = ({ color, className }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" className={className}>
    <path
      fill={color}
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
    />
  </svg>
)

const EventComets = ({ events }) => {
  const getEventColor = (co2Impact) => {
    if (co2Impact < 0) return 'text-cosmic-pink'
    if (co2Impact > 50) return 'text-red-400'
    if (co2Impact > 10) return 'text-yellow-400'
    return 'text-cosmic-lavender'
  }

  const getEcoAlternative = (type) => {
    switch (type) {
      case 'flight': return 'Video call instead'
      case 'shopping': return 'Buy local/used'
      default: return 'Find eco option'
    }
  }

  return (
    <div className="glass-card p-8">
      <div className="flex items-center gap-4 mb-8">
        <motion.h2 
          className="text-3xl font-heading tracking-wide"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          EVENT <span className="text-cosmic-pink">COMETS</span>
        </motion.h2>
      </div>

      {/* Orbit visualization */}
      <div className="relative mb-10 h-56 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full border-2 border-cosmic-pink/20" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full border border-cosmic-lavender/15" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-cosmic-cyan/10" />

        {/* Orbiting */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="relative w-56 h-56"
          >
            {events.slice(0, 4).map((event, index) => (
              <motion.div
                key={event.id}
                className="absolute w-14 h-14 glass rounded-full flex items-center justify-center"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${index * 90}deg) translateY(-90px) rotate(-${index * 90}deg)`,
                }}
                whileHover={{ scale: 1.3 }}
              >
                <SmallStar 
                  color={event.co2Impact < 0 ? '#FF85C1' : event.co2Impact > 50 ? '#4B5563' : '#7B61FF'} 
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Event cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, x: 5 }}
            className="glass p-5 rounded-3xl hover:border-cosmic-pink/50 transition-all"
          >
            <div className="flex items-start gap-4">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background: event.co2Impact < 0 
                    ? 'linear-gradient(135deg, #FF85C1, #FF9ECA)' 
                    : event.co2Impact > 50
                      ? 'linear-gradient(135deg, #4B5563, #6B7280)'
                      : 'linear-gradient(135deg, #7B61FF, #9D8AFF)',
                  boxShadow: `0 4px 15px ${event.co2Impact < 0 ? '#FF85C1' : event.co2Impact > 50 ? '#4B5563' : '#7B61FF'}40`,
                }}
              >
                <SmallStar color="#ffffff" />
              </motion.div>

              <div className="flex-1">
                <h4 className="font-medium text-lg">{event.name}</h4>
                <p className="text-cosmic-gray text-sm font-mono">{event.time}</p>
                
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-cosmic-gray">CO2:</span>
                  <span className={`font-mono font-bold ${getEventColor(event.co2Impact)}`}>
                    {event.co2Impact > 0 ? '+' : ''}{event.co2Impact} kg
                  </span>
                </div>

                {event.co2Impact > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-3 text-xs px-4 py-2 bg-cosmic-pink/20 text-cosmic-pinkLight rounded-full hover:bg-cosmic-pink/40 transition-colors"
                  >
                    Eco Swap
                  </motion.button>
                )}

                {event.co2Impact < 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-3 inline-flex items-center gap-1 px-3 py-1 bg-cosmic-pink/20 rounded-full"
                  >
                    <span className="text-cosmic-pink text-xs font-medium">Eco Positive</span>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-8 py-5 glass rounded-3xl text-cosmic-pinkLight font-medium hover:bg-cosmic-pink/10 transition-all flex items-center justify-center gap-2 text-lg"
      >
        <span className="text-2xl">+</span>
        Add New Event
      </motion.button>
    </div>
  )
}

export default EventComets
