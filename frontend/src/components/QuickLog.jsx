import React from 'react'
import { QUICK_ACTIONS } from '../lib/carbon'
import { newId, useStore } from '../lib/store'
import { formatKg } from '../lib/format'

export default function QuickLog() {
  const { dispatch } = useStore()

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
  }

  return (
    <div className="card p-6">
      <p className="font-semibold">Tap what you did</p>
      <p className="mt-1 text-sm text-mute">Green rows lower this week’s total. Orange rows add to it.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.id}
            onClick={() => log(action)}
            className="rounded-xl border border-line p-4 text-left hover:border-good"
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
