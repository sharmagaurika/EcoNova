import React from 'react'
import { Link } from 'react-router-dom'
import Sparkline from '../components/Sparkline'
import StreakCalendar from '../components/StreakCalendar'
import MiniStar from '../components/MiniStar'
import { useStore } from '../lib/store'
import { formatKg } from '../lib/format'

export default function Overview() {
  const { state, carbonMass, ecoScore, deltaPct, greenActions, you, dispatch } = useStore()
  const openMissions = state.missions.filter((m) => !m.done)

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-good">This week</p>
          <h1 className="serif mt-1 text-4xl sm:text-5xl">You created {carbonMass.toFixed(1)} kg of CO₂</h1>
          <p className="mt-3 max-w-2xl text-mute">
            Rank <span className="hl">#{you?.rank ?? '—'}</span> of {state.racers.length}.
            {' '}{deltaPct <= 0 ? `That’s ${Math.abs(deltaPct)}% lighter than last week.` : `That’s ${deltaPct}% heavier than last week.`}
            {' '}{greenActions} low-carbon actions logged. Eco score {ecoScore}/100.
          </p>
        </div>
        <div className="ml-auto text-center">
          <MiniStar ecoScore={ecoScore} />
          <p className="mt-2 text-sm font-medium">{state.profile.name}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <p className="text-sm text-mute">Goal this week</p>
          <p className="mt-1 text-2xl font-semibold">Stay under {state.profile.weeklyTarget} kg</p>
          <p className="mt-2 text-sm text-mute">
            {carbonMass <= state.profile.weeklyTarget ? 'You are under the cap.' : `${(carbonMass - state.profile.weeklyTarget).toFixed(1)} kg over.`}
          </p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-mute">Level {state.profile.level}</p>
          <p className="mt-1 text-2xl font-semibold">{state.profile.stardust} / {state.profile.stardustMax} XP</p>
          <p className="mt-2 text-sm text-mute">XP is only a progress bar. The race is the kg number.</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-mute">Next thing to do</p>
          {openMissions.length ? (
            <p className="mt-1 text-2xl font-semibold">{openMissions[0].text}</p>
          ) : (
            <p className="mt-1 text-2xl font-semibold">Week’s tasks done</p>
          )}
          <Link to="/log" className="mt-3 inline-block text-sm font-semibold text-good">Add an activity →</Link>
        </div>
      </div>

      <div className="card p-6">
        <p className="font-semibold">Today’s checklist</p>
        <p className="mt-1 text-sm text-mute">Tap one when you’ve done it. It subtracts from this week’s total.</p>
        <div className="mt-4 space-y-2">
          {state.missions.map((mission) => (
            <button
              key={mission.id}
              onClick={() => !mission.done && dispatch({ type: 'complete-mission', id: mission.id })}
            className="flex w-full items-center gap-3 rounded-xl border border-line px-4 py-3 text-left hover:border-brand/40"
            >
              <span className={`grid h-6 w-6 place-items-center rounded-full text-xs font-bold ${mission.done ? 'bg-good text-void' : 'border border-line text-paper'}`}>
                {mission.done ? '✓' : ''}
              </span>
              <span className="flex-1">{mission.text}</span>
              <span className="mono text-sm good">{mission.value}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <p className="font-semibold">Last 7 days</p>
          <Sparkline values={state.sparkline} color="#ff8ec8" />
        </div>
        <div className="card p-6">
          <StreakCalendar logs={state.logs} />
        </div>
      </div>

      <div className="card p-6">
        <p className="font-semibold">Recent activity</p>
        <ul className="mt-4 space-y-3">
          {state.logs.slice(0, 8).map((log) => (
            <li key={log.id} className="flex justify-between gap-3 text-sm">
              <span>{log.name}</span>
              <span className={`mono ${log.kg < 0 ? 'good' : 'warn'}`}>{formatKg(log.kg)}</span>
            </li>
          ))}
        </ul>
        <button className="btn btn-ghost mt-5" onClick={() => dispatch({ type: 'reset' })}>
          Reset demo to the starting week
        </button>
      </div>
    </div>
  )
}
