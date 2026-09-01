import React from 'react'
import AvaStar from '../components/AvaStar'
import StardustBar from '../components/StardustBar'
import Sparkline from '../components/Sparkline'
import StreakCalendar from '../components/StreakCalendar'
import { useStore } from '../lib/store'
import { formatKg } from '../lib/format'

export default function Command() {
  const { state, ecoScore, carbonMass, isHighEco, isHighCarbon, deltaPct, greenActions, dispatch } = useStore()

  return (
    <div className="space-y-6">
      <StardustBar current={state.profile.stardust} max={state.profile.stardustMax} level={state.profile.level} />

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="panel p-8">
          <p className="kicker text-center">Your AvaSTAR</p>
          <AvaStar
            ecoScore={ecoScore}
            carbonMass={carbonMass}
            isHighEco={isHighEco}
            isHighCarbon={isHighCarbon}
          />
          <div className="mt-8 grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="kicker">Eco score</p>
              <p className={`display text-5xl ${isHighEco ? 'text-signal' : 'text-ion'}`}>{ecoScore}</p>
            </div>
            <div>
              <p className="kicker">Carbon mass</p>
              <p className={`display text-5xl ${isHighCarbon ? 'text-flare' : 'text-gold'}`}>{carbonMass.toFixed(1)}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="panel p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="kicker">7-day mass</p>
                <h3 className="display text-3xl">{deltaPct <= 0 ? `${deltaPct}%` : `+${deltaPct}%`}</h3>
              </div>
              <p className="text-sm text-mute">{greenActions} green actions · {carbonMass.toFixed(1)} kg net</p>
            </div>
            <Sparkline values={state.sparkline} color={deltaPct <= 0 ? '#3dffc8' : '#ff6b6b'} />
          </div>

          <div className="panel p-6">
            <p className="kicker mb-4">Today's missions</p>
            <div className="space-y-3">
              {state.missions.map((mission) => (
                <button
                  key={mission.id}
                  onClick={() => !mission.done && dispatch({ type: 'complete-mission', id: mission.id })}
                  className="flex w-full items-center gap-3 rounded-xl border border-white/10 px-4 py-3 text-left"
                >
                  <span className={`grid h-7 w-7 place-items-center rounded-full text-xs ${mission.done ? 'bg-signal text-void' : 'bg-white/5 text-mute'}`}>
                    {mission.done ? '✓' : ''}
                  </span>
                  <span className="flex-1">{mission.text}</span>
                  <span className="mono text-xs text-signal">{mission.value}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="panel p-6">
          <StreakCalendar logs={state.logs} />
        </div>
        <div className="panel p-6">
          <p className="kicker">Recent vectors</p>
          <ul className="mt-4 space-y-3">
            {state.logs.slice(0, 6).map((log) => (
              <li key={log.id} className="flex items-center justify-between gap-3 text-sm">
                <span>{log.name}</span>
                <span className={`mono ${log.kg < 0 ? 'text-signal' : 'text-gold'}`}>{formatKg(log.kg)}</span>
              </li>
            ))}
          </ul>
          <button className="btn btn-ghost mt-5 w-full" onClick={() => dispatch({ type: 'reset' })}>
            Reset demo data
          </button>
        </div>
      </div>
    </div>
  )
}
