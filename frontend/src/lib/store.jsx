import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { SEED } from '../data/seed'
import { breakdownFromLogs, ecoScoreFromMass, round3 } from './carbon'
import { newId } from './format'

const STORAGE_KEY = 'econova.v4'
const StoreContext = createContext(null)

function hydrate() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignore corrupt storage */
  }
  return {
    profile: SEED.profile,
    logs: SEED.logs,
    missions: SEED.missions,
    events: SEED.events,
    friends: SEED.friends,
    racers: SEED.racers,
    feed: SEED.feed,
    sparkline: SEED.sparkline,
    constellationMode: true,
    gps: {
      active: false,
      simulated: false,
      points: [],
      distanceKm: 0,
      emissionsKg: 0,
      mode: 'Idle',
      speedKmh: 0,
    },
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'toggle-constellation':
      return { ...state, constellationMode: !state.constellationMode }
    case 'complete-mission': {
      const mission = state.missions.find((item) => item.id === action.id)
      if (!mission || mission.done) return state
      const next = {
        ...state,
        missions: state.missions.map((item) =>
          item.id === action.id ? { ...item, done: true } : item,
        ),
      }
      if (mission.kg) {
        return reducer(next, {
          type: 'add-log',
          bumpStreak: mission.kg < 0,
          log: {
            id: newId('m'),
            name: mission.text,
            kg: mission.kg,
            category: mission.kg < 0 ? 'transport' : 'other',
            type: 'mission',
            at: new Date().toISOString(),
          },
        })
      }
      return next
    }
    case 'add-log': {
      const log = action.log
      const logs = [log, ...state.logs].slice(0, 40)
      const stardustGain = log.kg < 0 ? Math.round(Math.abs(log.kg) * 28) : 8
      const stardust = Math.min(state.profile.stardustMax, state.profile.stardust + stardustGain)
      const leveled = stardust >= state.profile.stardustMax
      const profile = {
        ...state.profile,
        stardust: leveled ? stardust - state.profile.stardustMax + 120 : stardust,
        stardustMax: leveled ? state.profile.stardustMax + 400 : state.profile.stardustMax,
        level: leveled ? state.profile.level + 1 : state.profile.level,
        streak: log.kg < 0 ? state.profile.streak + (action.bumpStreak ? 1 : 0) : state.profile.streak,
      }
      const feed = [
        {
          id: `fd-${log.id}`,
          name: 'Alex',
          text: log.kg < 0 ? `logged ${log.name.toLowerCase()}` : `logged ${log.name.toLowerCase()}`,
          kg: log.kg,
          at: log.at,
        },
        ...state.feed,
      ].slice(0, 20)
      const sparkline = [...state.sparkline.slice(1), round3(weeklyMass(logs))]
      return { ...state, logs, profile, feed, sparkline }
    }
    case 'add-event':
      return { ...state, events: [action.event, ...state.events] }
    case 'gps-start':
      return {
        ...state,
        gps: {
          ...state.gps,
          active: true,
          simulated: Boolean(action.simulated),
          points: [],
          distanceKm: 0,
          emissionsKg: 0,
          mode: 'Walking',
          speedKmh: 0,
        },
      }
    case 'gps-tick':
      return { ...state, gps: { ...state.gps, ...action.patch } }
    case 'gps-stop':
      return { ...state, gps: { ...state.gps, active: false, simulated: false } }
    case 'reset':
      localStorage.removeItem(STORAGE_KEY)
      return hydrate()
    default:
      return state
  }
}

function weeklyMass(logs) {
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000
  const net = logs
    .filter((log) => new Date(log.at).getTime() >= cutoff)
    .reduce((sum, log) => sum + log.kg, 0)
  return round3(Math.max(0, net))
}

function weeklySaved(logs) {
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000
  return logs
    .filter((log) => new Date(log.at).getTime() >= cutoff)
    .reduce((sum, log) => sum + Math.max(0, -log.kg), 0)
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, hydrate)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const derived = useMemo(() => {
    const carbonMass = round3(weeklyMass(state.logs))
    const saved = round3(weeklySaved(state.logs))
    const ecoScore = ecoScoreFromMass(carbonMass)
    const prev = state.sparkline[0] || carbonMass
    const deltaPct = prev ? Math.round(((carbonMass - prev) / prev) * 100) : 0
    const racers = state.racers
      .map((racer) => (racer.id === 'you' ? { ...racer, weeklyKg: carbonMass, ecoScore } : racer))
      .sort((a, b) => a.weeklyKg - b.weeklyKg)
      .map((racer, index) => ({ ...racer, rank: index + 1 }))
    const you = racers.find((racer) => racer.id === 'you')
    const breakdown = breakdownFromLogs(state.logs.filter((log) => Date.now() - new Date(log.at).getTime() < 7 * 86400000))
    const greenActions = state.logs.filter((log) => log.kg < 0 && Date.now() - new Date(log.at).getTime() < 7 * 86400000).length

    return {
      carbonMass,
      saved,
      ecoScore,
      deltaPct,
      racers,
      you,
      breakdown,
      greenActions,
      isHighEco: ecoScore > 80,
      isHighCarbon: carbonMass > 50,
    }
  }, [state])

  const value = useMemo(() => ({ state, dispatch, ...derived }), [state, derived])
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const value = useContext(StoreContext)
  if (!value) throw new Error('useStore must be used inside StoreProvider')
  return value
}

export { newId } from './format'
