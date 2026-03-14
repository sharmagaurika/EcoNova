import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import StardustMeter from './components/StardustMeter'
import AvaSTAR from './components/AvaSTAR'
import EventComets from './components/EventComets'
import CosmicMap from './components/CosmicMap'
import StardustBackground from './components/StardustBackground'

// Mock data for demo
const mockUser = {
  id: 1,
  name: 'Alex',
  ecoScore: 85,
  carbonMass: 32,
  stardust: 2450,
  stardustMax: 3000,
  level: 12,
}

const mockEvents = [
  { id: 1, name: 'Team Meeting', time: '10:00 AM', co2Impact: 0.5, type: 'virtual' },
  { id: 2, name: 'Flight to NYC', time: '2:00 PM', co2Impact: 150, type: 'flight' },
  { id: 3, name: 'Grocery Shopping', time: '5:00 PM', co2Impact: 2.1, type: 'shopping' },
  { id: 4, name: 'Bike to Work', time: '8:00 AM', co2Impact: -3.2, type: 'green' },
]

const mockFriends = [
  { id: 1, name: 'Jordan', ecoScore: 92, isFocusing: true, x: 20, y: 30 },
  { id: 2, name: 'Sam', ecoScore: 78, isFocusing: false, x: 70, y: 25 },
  { id: 3, name: 'Taylor', ecoScore: 88, isFocusing: true, x: 45, y: 70 },
  { id: 4, name: 'Casey', ecoScore: 65, isFocusing: false, x: 80, y: 65 },
  { id: 5, name: 'Morgan', ecoScore: 95, isFocusing: false, x: 30, y: 80 },
]

function App() {
  const [user] = useState(mockUser)
  const [activeTab, setActiveTab] = useState('galaxy')
  const [constellationMode, setConstellationMode] = useState(true)

  const isHighEcoScore = user.ecoScore > 80
  const isHighCarbonMass = user.carbonMass > 50
  const focusingFriends = mockFriends.filter(f => f.isFocusing)

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Galaxy Background */}
      <StardustBackground />

      {/* Main Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-10">
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="inline-block"
          >
            <h1 className="text-5xl sm:text-7xl font-heading tracking-wider">
              <span className="text-cosmic-pink drop-shadow-lg">ECO</span>
              <span className="text-cosmic-lavender drop-shadow-lg">NOVA</span>
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-3 mt-4"
          >
            <div className="glass px-6 py-2 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cosmic-pink animate-pulse" />
              <span className="text-sm font-mono text-cosmic-pinkLight">Level {user.level}</span>
            </div>
          </motion.div>

          {/* Constellation Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setConstellationMode(!constellationMode)}
            className={`mt-6 btn-bubbly ${constellationMode ? 'bg-cosmic-pink' : 'bg-cosmic-deep border border-cosmic-pink/30'}`}
          >
            {constellationMode ? 'Constellation Mode ON' : 'Constellation Mode OFF'}
          </motion.button>
        </header>

        {/* Stardust Meter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StardustMeter 
            current={user.stardust} 
            max={user.stardustMax} 
            level={user.level}
          />
        </motion.div>

        {/* Navigation */}
        <nav className="flex justify-center gap-3 mb-10 flex-wrap">
          {['galaxy', 'comets', 'leaderboard'].map((tab, index) => (
            <motion.button
              key={tab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              onClick={() => setActiveTab(tab)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-4 rounded-full font-medium transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-cosmic-pink to-cosmic-violet text-white neon-pink'
                  : 'glass text-cosmic-pinkLight hover:text-white hover:bg-cosmic-pink/20'
              }`}
            >
              {tab === 'galaxy' && 'The Galaxy'}
              {tab === 'comets' && 'Event Comets'}
              {tab === 'leaderboard' && 'Cosmic Map'}
            </motion.button>
          ))}
        </nav>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'galaxy' && (
            <motion.div
              key="galaxy"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* AvaSTAR Section */}
              <div className="glass-card p-10 flex flex-col items-center justify-center min-h-[520px]">
                <motion.h2 
                  className="text-3xl font-heading mb-8 text-center"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  YOUR <span className="text-cosmic-pink">AVASTAR</span>
                </motion.h2>
                <AvaSTAR 
                  ecoScore={user.ecoScore}
                  carbonMass={user.carbonMass}
                  isHighEcoScore={isHighEcoScore}
                  isHighCarbonMass={isHighCarbonMass}
                />
                <div className="mt-8 flex gap-8">
                  <div className="text-center">
                    <p className="text-cosmic-pinkLight text-sm mb-1">Eco Score</p>
                    <p className={`text-5xl font-heading ${isHighEcoScore ? 'text-cosmic-pink' : 'text-cosmic-debris'}`}>
                      {user.ecoScore}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-cosmic-lavenderLight text-sm mb-1">Carbon</p>
                    <p className={`text-3xl font-mono ${isHighCarbonMass ? 'text-red-400' : 'text-cosmic-cyan'}`}>
                      {user.carbonMass} kg
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-6">
                <div className="glass-card p-8">
                  <h3 className="text-2xl font-heading mb-6 text-cosmic-lavender">Weekly Progress</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div 
                      className="text-center p-6 glass rounded-3xl"
                      whileHover={{ scale: 1.02 }}
                    >
                      <p className="text-4xl font-heading text-cosmic-pink">-12%</p>
                      <p className="text-cosmic-gray text-sm mt-1">Carbon Reduced</p>
                    </motion.div>
                    <motion.div 
                      className="text-center p-6 glass rounded-3xl"
                      whileHover={{ scale: 1.02 }}
                    >
                      <p className="text-4xl font-heading text-cosmic-lavender">23</p>
                      <p className="text-cosmic-gray text-sm mt-1">Green Actions</p>
                    </motion.div>
                  </div>
                </div>

                <div className="glass-card p-8">
                  <h3 className="text-2xl font-heading mb-6 text-cosmic-pinkLight">Todays Missions</h3>
                  <div className="space-4">
                    {[
                      { done: true, text: 'Bike to work', value: '-3.2 kg' },
                      { done: false, text: 'Skip meat dinner', value: '-2.1 kg' },
                      { done: false, text: 'Public transit', value: '-1.5 kg' },
                    ].map((task, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.01 }}
                        className="flex items-center gap-4 p-4 glass rounded-2xl"
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          task.done ? 'bg-cosmic-pink/30' : 'bg-cosmic-gray/20'
                        }`}>
                          {task.done ? (
                            <span className="text-cosmic-pink text-lg">&#10003;</span>
                          ) : (
                            <span className="text-cosmic-gray">&#9675;</span>
                          )}
                        </div>
                        <span className={`flex-1 ${task.done ? 'text-cosmic-pinkLight' : ''}`}>{task.text}</span>
                        <span className="text-cosmic-pink text-sm font-mono">{task.value}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'comets' && (
            <motion.div
              key="comets"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <EventComets events={mockEvents} />
            </motion.div>
          )}

          {activeTab === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <CosmicMap 
                friends={mockFriends} 
                userId={user.id}
                constellationMode={constellationMode}
                focusingFriends={focusingFriends}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.footer 
          className="mt-12 glass-card p-6 flex flex-wrap justify-center gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[
            { label: 'RANK', value: '#42', color: 'text-cosmic-pink' },
            { label: 'THIS WEEK', value: '- 23kg', color: 'text-cosmic-lavender' },
            { label: 'STREAK', value: '7 days', color: 'text-cosmic-cyan' },
            { label: 'BADGES', value: '12', color: 'text-cosmic-pinkLight' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-cosmic-gray text-xs">{stat.label}</p>
              <p className={`text-2xl font-heading ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </motion.footer>
      </div>
    </div>
  )
}

export default App
