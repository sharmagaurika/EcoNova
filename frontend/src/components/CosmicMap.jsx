import React, { useMemo } from 'react'
import { motion } from 'framer-motion'

function starColor(score) {
  if (score >= 90) return '#3dffc8'
  if (score >= 80) return '#f5c542'
  if (score >= 70) return '#82a7ff'
  return '#8b97a8'
}

export default function CosmicMap({ friends, constellationMode }) {
  const focusing = friends.filter((friend) => friend.isFocusing)
  const stars = useMemo(
    () => Array.from({ length: 48 }, (_, i) => ({ id: i, x: (i * 37) % 100, y: (i * 53) % 100, o: 0.15 + (i % 5) * 0.1 })),
    [],
  )

  return (
    <div className="panel p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="kicker">Friend circle</p>
          <h3 className="display text-3xl">Cosmic map</h3>
        </div>
        {constellationMode && focusing.length >= 2 && (
          <span className="panel-tight px-3 py-1 text-xs text-signal">Constellation active</span>
        )}
      </div>

      <div className="relative h-[420px] overflow-hidden rounded-2xl border border-white/10 bg-black/40">
        <svg className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id="constellation" x1="0" x2="1">
              <stop offset="0%" stopColor="#3dffc8" />
              <stop offset="100%" stopColor="#82a7ff" />
            </linearGradient>
          </defs>
          {constellationMode &&
            focusing.map((a, i) =>
              focusing.slice(i + 1).map((b) => (
                <line
                  key={`${a.id}-${b.id}`}
                  x1={`${a.x}%`}
                  y1={`${a.y}%`}
                  x2={`${b.x}%`}
                  y2={`${b.y}%`}
                  stroke="url(#constellation)"
                  strokeWidth="1.5"
                  strokeDasharray="5 6"
                />
              )),
            )}
        </svg>

        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute h-0.5 w-0.5 rounded-full bg-white"
            style={{ left: `${star.x}%`, top: `${star.y}%`, opacity: star.o }}
          />
        ))}

        {friends.map((friend) => (
          <motion.div
            key={friend.id}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 text-center"
            style={{ left: `${friend.x}%`, top: `${friend.y}%` }}
            whileHover={{ scale: 1.12 }}
          >
            <div
              className="mx-auto grid h-11 w-11 place-items-center rounded-full"
              style={{
                background: `${starColor(friend.ecoScore)}22`,
                boxShadow: `0 0 18px ${starColor(friend.ecoScore)}`,
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24">
                <path fill={starColor(friend.ecoScore)} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <p className="mt-2 text-xs font-medium">{friend.name}</p>
            <p className="mono text-[10px]" style={{ color: starColor(friend.ecoScore) }}>
              {friend.ecoScore} · {friend.weeklyKg.toFixed(1)} kg
            </p>
          </motion.div>
        ))}

        <div className="absolute bottom-3 left-3 panel-tight px-3 py-2 text-[10px] text-mute">
          Brightness = eco score · focusing stars form a constellation
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {friends.map((friend) => (
          <div key={friend.id} className="panel-tight p-3 text-center">
            <p className="text-sm font-medium">{friend.name}</p>
            <p className="mono text-xs text-mute">{friend.weeklyKg.toFixed(1)} kg / 7d</p>
            {friend.isFocusing && <p className="text-[10px] text-signal mt-1">Focusing</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
