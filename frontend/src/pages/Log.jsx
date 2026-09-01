import React from 'react'
import GpsHud from '../components/GpsHud'
import QuickLog from '../components/QuickLog'
import CarbonLogger from '../components/CarbonLogger'
import { useStore } from '../lib/store'
import { formatKg, relativeTime } from '../lib/format'

export default function Log() {
  const { state } = useStore()

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold text-good">Add to this week</p>
        <h1 className="serif mt-1 text-4xl">What did you do?</h1>
        <p className="mt-3 max-w-2xl text-mute">
          Tap a card, track a commute, or add a purchase. It shows up in the list under the buttons right away.
        </p>
      </div>
      <QuickLog />
      <div className="card p-6">
        <p className="font-semibold">This week’s activity</p>
        {state.logs.length === 0 ? (
          <p className="mt-3 text-sm text-mute">Nothing logged yet. Tap a card above.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {state.logs.slice(0, 12).map((log) => (
              <li key={log.id} className="flex items-center justify-between gap-3 text-sm">
                <span>
                  {log.name}
                  <span className="ml-2 text-xs text-mute">{relativeTime(log.at)}</span>
                </span>
                <span className={`mono ${log.kg < 0 ? 'good' : 'warn'}`}>{formatKg(log.kg)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <GpsHud />
      <CarbonLogger />
    </div>
  )
}
