import React from 'react'
import { motion } from 'framer-motion'
import { formatNumber } from '../lib/format'

export default function StardustBar({ current, max, level }) {
  const pct = Math.min(100, (current / max) * 100)

  return (
    <div className="panel p-5">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <p className="kicker">Stardust</p>
          <p className="display text-3xl">Level {level}</p>
        </div>
        <p className="mono text-sm text-signal">
          {formatNumber(current)} <span className="text-mute">/ {formatNumber(max)} XP</span>
        </p>
      </div>
      <div className="relative h-3 overflow-hidden rounded-full bg-black/50">
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
          style={{ background: 'linear-gradient(90deg, #82a7ff, #3dffc8)' }}
        />
      </div>
      <p className="mt-3 text-xs text-mute">{formatNumber(max - current)} XP to next orbital class</p>
    </div>
  )
}
