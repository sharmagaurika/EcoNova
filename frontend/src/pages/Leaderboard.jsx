import React, { useMemo, useState } from 'react'
import CosmicMap from '../components/CosmicMap'
import { useStore } from '../lib/store'
import { formatKg, relativeTime } from '../lib/format'

const SCOPES = [
  { id: 'circle', label: 'Friends' },
  { id: 'national', label: 'Canada' },
  { id: 'global', label: 'Everyone' },
]

export default function Leaderboard() {
  const { racers, state } = useStore()
  const [scope, setScope] = useState('circle')

  const rows = useMemo(() => {
    if (scope === 'circle') return racers.filter((r) => r.circle)
    if (scope === 'national') return racers.filter((r) => r.country === 'Canada')
    return racers
  }, [racers, scope])

  const youRank = rows.findIndex((racer) => racer.id === 'you') + 1
  const leader = rows[0]

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold text-good">This week’s race</p>
        <h1 className="serif mt-1 text-4xl">Lowest kg CO₂ is first</h1>
        <p className="mt-3 max-w-2xl text-mute">
          Rolling 7 days. {leader?.name} is winning at {leader?.weeklyKg.toFixed(1)} kg.
          You are #{youRank || '—'} in this list.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {SCOPES.map((item) => (
          <button
            key={item.id}
            onClick={() => setScope(item.id)}
            className={`nav-link ${scope === item.id ? 'active' : 'border border-line'}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <ol className="card divide-y divide-line">
        {rows.map((racer, index) => (
          <li
            key={racer.id}
            className={`flex items-center gap-4 px-5 py-4 ${racer.id === 'you' ? 'bg-[#eef6f0]' : ''}`}
          >
            <span className="mono w-6 text-mute">{index + 1}</span>
            <span className="flex-1 font-medium">{racer.name}{racer.id === 'you' ? ' (you)' : ''}</span>
            <span className="text-sm text-mute">{racer.country}</span>
            <span className="mono font-medium">{racer.weeklyKg.toFixed(1)} kg</span>
          </li>
        ))}
      </ol>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <p className="font-semibold">Friend activity</p>
          <ul className="mt-4 space-y-4">
            {state.feed.map((item) => (
              <li key={item.id}>
                <p className="text-sm">
                  <strong>{item.name}</strong> {item.text}
                </p>
                <p className="mono mt-1 text-xs text-mute">
                  {item.kg ? formatKg(item.kg) : 'update'} · {relativeTime(item.at)}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <CosmicMap friends={state.friends} constellationMode={state.constellationMode} />
      </div>
    </div>
  )
}
