import React from 'react'

export default function CosmicMap({ friends }) {
  return (
    <div className="card p-6">
      <p className="font-semibold">Friends in the race</p>
      <p className="mt-1 text-sm text-mute">Same 7-day window. Lower kg is better.</p>
      <ul className="mt-4 space-y-3">
        {[...friends].sort((a, b) => a.weeklyKg - b.weeklyKg).map((friend) => (
          <li key={friend.id} className="flex items-center justify-between gap-3 text-sm">
            <span>
              {friend.name}
              {friend.isFocusing ? <span className="ml-2 text-xs text-mute">online</span> : null}
            </span>
            <span className="mono">{friend.weeklyKg.toFixed(1)} kg</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
