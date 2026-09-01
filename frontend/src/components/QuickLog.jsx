import React, { useState } from 'react'
import { QUICK_ACTIONS } from '../lib/carbon'
import { newId, useStore } from '../lib/store'
import { formatKg } from '../lib/format'

export default function QuickLog() {
  const { dispatch } = useStore()
  const [last, setLast] = useState(null)

  const log = (action) => {
    dispatch({
      type: 'add-log',
      bumpStreak: action.kind === 'green',
      log: {
        id: newId('q'),
        name: action.label,
        kg: action.kg,
        category: action.category,
        type: action.kind,
        at: new Date().toISOString(),
      },
    })
    setLast(action)
  }

  return (
    <div className="card p-6">
      <p className="font-semibold">Tap what you did</p>
      <p className="mt-1 text-sm text-mute">Each tap adds a row to this week. Mint lowers the total. Gold adds to it.</p>
      {last && (
        <p className="mt-3 rounded-xl border border-good/40 bg-good/10 px-4 py-3 text-sm">
          Added <strong>{last.label}</strong> · {formatKg(last.kg)} · see it in the list below
        </p>
      )}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() => log(action)}
            className={`rounded-xl border p-4 text-left text-paper ${last?.id === action.id ? 'border-good bg-good/10' : 'border-line hover:border-good'}`}
          >
            <p className="font-medium">{action.label}</p>
            <p className="mt-1 text-sm text-mute">{action.hint}</p>
            <p className={`mono mt-3 text-sm ${action.kg < 0 ? 'good' : 'warn'}`}>{formatKg(action.kg)}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
