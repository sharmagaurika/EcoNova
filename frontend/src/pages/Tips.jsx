import React from 'react'
import { Link } from 'react-router-dom'
import { swapSuggestions } from '../lib/carbon'
import { useStore } from '../lib/store'
import { formatKg } from '../lib/format'

export default function Tips() {
  const { breakdown, carbonMass, you, state, deltaPct } = useStore()
  const swaps = swapSuggestions(breakdown)
  const rank = you?.rank ?? 4
  const heaviest = Object.entries(breakdown)
    .filter(([key]) => key !== 'saved')
    .sort((a, b) => b[1] - a[1])[0]

  const categories = [
    ['Transport', breakdown.transport],
    ['Food', breakdown.food],
    ['Home energy', breakdown.energy],
    ['Shopping', breakdown.shopping],
    ['Digital', breakdown.digital],
    ['Other', breakdown.other],
  ]

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold text-good">Why you ranked here</p>
        <h1 className="serif mt-1 text-4xl">How to move up this week</h1>
        <p className="mt-3 max-w-2xl text-lg leading-7 text-paper">
          Your total is {carbonMass.toFixed(1)} kg CO₂, rank <span className="hl" style={{ color: '#ffb4dc' }}>#{rank}</span> of {state.racers.length}.
          That’s {deltaPct <= 0 ? `${Math.abs(deltaPct)}% lighter` : `${deltaPct}% heavier`} than last week.
          The biggest slice is <span className="hl" style={{ color: '#ffb4dc' }}>{heaviest?.[0]}</span> at {heaviest?.[1]?.toFixed(1)} kg.
        </p>
      </div>

      <div className="card p-6">
        <p className="font-semibold">Do one of these</p>
        <p className="mt-1 text-sm text-mute">These are the swaps that drop the most kg from a week like yours.</p>
        <ul className="mt-4 space-y-3">
          {swaps.map((swap) => (
            <li key={swap.title} className="rounded-xl border border-line p-4">
              <p className="font-medium">{swap.title}</p>
              <p className="mt-1 text-sm text-mute">{swap.detail}</p>
              <p className="mono mt-2 text-sm good">{formatKg(swap.kg)}</p>
            </li>
          ))}
        </ul>
        <Link to="/log" className="btn btn-primary mt-5">Log a swap</Link>
      </div>

      <div className="card p-6">
        <p className="font-semibold">Where this week’s CO₂ came from</p>
        <div className="mt-4 space-y-3">
          {categories.map(([label, value]) => (
            <div key={label}>
              <div className="mb-1 flex justify-between text-sm">
                <span>{label}</span>
                <span className="mono">{value.toFixed(1)} kg</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-line">
                <div
                  className="h-full bg-good"
                  style={{ width: `${Math.min(100, (value / Math.max(carbonMass, 1)) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
