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
    <div className="panel p-6">
      <p className="kicker">Cosmic actions</p>
      <h3 className="display text-3xl">Quick log</h3>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.id}
            onClick={() => log(action)}
            className="panel-tight p-4 text-left hover:border-signal/40"
          >
            <p className="font-medium">{action.label}</p>
            <p className="text-xs text-mute mt-1">{action.hint}</p>
            <p className={`mono mt-3 text-sm ${action.kg < 0 ? 'text-signal' : 'text-flare'}`}>
              {formatKg(action.kg)} · +{action.xp} XP
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}
