import React, { useMemo, useState } from 'react'
import { useStore } from '../lib/store'
import { formatKg, relativeTime } from '../lib/format'

const SCOPES = [
  { id: 'circle', label: 'Friend circle' },
  { id: 'national', label: 'National' },
  { id: 'global', label: 'Global' },
]

export default function Race() {
  const { racers, you, state } = useStore()
  const [scope, setScope] = useState('circle')

  const rows = useMemo(() => {
    if (scope === 'circle') return racers.filter((r) => r.circle)
    if (scope === 'national') return racers.filter((r) => r.country === 'Canada')
    return racers
  }, [racers, scope])

  const leader = rows[0]
  const youRank = rows.find((r) => r.id === 'you')?.rank ?? you?.rank

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="panel p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="kicker">Rolling 7-day window</p>
            <h3 className="display text-3xl">Lowest mass wins</h3>
          </div>
          <div className="flex rounded-full border border-white/10 p-1">
            {SCOPES.map((item) => (
              <button
                key={item.id}
                onClick={() => setScope(item.id)}
                className={`rounded-full px-3 py-1.5 text-xs ${scope === item.id ? 'bg-signal text-void' : 'text-mute'}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 panel-tight p-4">
          <p className="kicker">Supernova</p>
          <p className="text-lg font-medium">{leader?.name} leads at {leader?.weeklyKg} kg</p>
          <p className="text-sm text-mute mt-1">You are rank {youRank}. Drop mass to reclaim the badge.</p>
        </div>

        <ol className="mt-5 space-y-2">
          {rows.map((racer, index) => (
            <li
              key={racer.id}
              className={`flex items-center gap-4 rounded-xl px-4 py-3 ${racer.id === 'you' ? 'bg-signal/10 border border-signal/30' : 'bg-white/5'}`}
            >
              <span className="mono w-6 text-mute">{index + 1}</span>
              <span className="flex-1 font-medium">{racer.name}</span>
              <span className="text-xs text-mute">{racer.country}</span>
              <span className="mono text-sm">{racer.weeklyKg} kg</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="panel p-6">
        <p className="kicker">Trash-talk feed</p>
        <h3 className="display text-3xl">Live event log</h3>
        <ul className="mt-5 space-y-4">
          {state.feed.map((item) => (
            <li key={item.id} className="border-b border-white/5 pb-4">
              <p className="text-sm">
                <span className="text-signal">{item.name}</span> {item.text}
              </p>
              <p className="mono mt-1 text-xs text-mute">
                {item.kg ? formatKg(item.kg) : 'status'} · {relativeTime(item.at)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
