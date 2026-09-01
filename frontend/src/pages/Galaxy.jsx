import React from 'react'
import CosmicMap from '../components/CosmicMap'
import EventComets from '../components/EventComets'
import { useStore } from '../lib/store'

export default function Galaxy() {
  const { state, dispatch } = useStore()

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-xl text-sm text-mute">
          Friend stars glow with eco score. When two or more pilots are focusing, constellation mode draws the live link.
        </p>
        <button className="btn btn-ghost" onClick={() => dispatch({ type: 'toggle-constellation' })}>
          Constellation {state.constellationMode ? 'on' : 'off'}
        </button>
      </div>
      <CosmicMap friends={state.friends} constellationMode={state.constellationMode} />
      <EventComets />
    </div>
  )
}
