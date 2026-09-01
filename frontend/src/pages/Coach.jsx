import React from 'react'
import { swapSuggestions } from '../lib/carbon'
import { useStore } from '../lib/store'
import { formatKg } from '../lib/format'

export default function Coach() {
  const { breakdown, carbonMass, you, state, deltaPct } = useStore()
  const swaps = swapSuggestions(breakdown)
  const rank = you?.rank ?? 4
  const total = state.racers.length

  const narrative = buildReport({
    name: state.profile.name,
    carbonMass,
    deltaPct,
    rank,
    total,
    breakdown,
  })

  const categories = [
    ['Transport', breakdown.transport],
    ['Food', breakdown.food],
    ['Energy', breakdown.energy],
    ['Shopping', breakdown.shopping],
    ['Digital', breakdown.digital],
    ['Other', breakdown.other],
  ]

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="panel p-6">
        <p className="kicker">Weekly narrative</p>
        <h3 className="display text-3xl">Why the rank moved</h3>
        <p className="mt-4 whitespace-pre-line text-sm leading-7 text-paper/90">{narrative}</p>
      </div>

      <div className="space-y-6">
        <div className="panel p-6">
          <p className="kicker">Mass breakdown</p>
          <div className="mt-4 space-y-3">
            {categories.map(([label, value]) => (
              <div key={label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{label}</span>
                  <span className="mono">{value.toFixed(1)} kg</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full bg-signal"
                    style={{ width: `${Math.min(100, (value / Math.max(carbonMass, 1)) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel p-6">
          <p className="kicker">Behavioral nudges</p>
          <h3 className="display text-3xl">Swap to reclaim lead</h3>
          <ul className="mt-4 space-y-3">
            {swaps.map((swap) => (
              <li key={swap.title} className="panel-tight p-4">
                <p className="font-medium">{swap.title}</p>
                <p className="mt-1 text-sm text-mute">{swap.detail}</p>
                <p className="mono mt-2 text-sm text-signal">{formatKg(swap.kg)}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function buildReport({ name, carbonMass, deltaPct, rank, total, breakdown }) {
  const direction = deltaPct <= 0 ? 'dropped' : 'rose'
  const culprit = Object.entries(breakdown)
    .filter(([key]) => key !== 'saved')
    .sort((a, b) => b[1] - a[1])[0]
  return `${name}, your orbital mass ${direction} ${Math.abs(deltaPct)}% this sprint to ${carbonMass.toFixed(1)} kg CO2e.\n\nYou sit ${rank} of ${total} in the current window. ${culprit?.[0] || 'Transport'} is the heaviest vector at ${culprit?.[1]?.toFixed(1) || 0} kg.\n\nA single high-drag event (flights, beef, fuel) outweighs a week of quiet commuting. Swap the dense items, keep the green streak, and the Supernova is still in reach.`
}
