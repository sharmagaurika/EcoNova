import React, { useEffect, useRef } from 'react'
import { transportEmissions, haversineKm, round3 } from '../lib/carbon'
import { newId, useStore } from '../lib/store'
import { logMovement } from '../api'

const SIM_SPEEDS = [4.5, 14, 32, 48, 72, 38, 12, 5]

export default function GpsHud() {
  const { state, dispatch } = useStore()
  const watchRef = useRef(null)
  const simRef = useRef(null)
  const lastPoint = useRef(null)
  const tally = useRef({ distanceKm: 0, emissionsKg: 0 })

  useEffect(() => () => {
    if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current)
    if (simRef.current) clearInterval(simRef.current)
  }, [])

  const persistTick = (distanceKm, speedKmh) => {
    const result = transportEmissions(speedKmh, distanceKm)
    tally.current.distanceKm = round3(tally.current.distanceKm + distanceKm)
    tally.current.emissionsKg = round3(tally.current.emissionsKg + result.emissionsKg)
    dispatch({
      type: 'gps-tick',
      patch: {
        distanceKm: tally.current.distanceKm,
        emissionsKg: tally.current.emissionsKg,
        mode: result.mode,
        speedKmh,
      },
    })
    logMovement(distanceKm, speedKmh).catch(() => {})
  }

  const startLive = () => {
    if (!navigator.geolocation) {
      startDemo()
      return
    }
    tally.current = { distanceKm: 0, emissionsKg: 0 }
    dispatch({ type: 'gps-start', simulated: false })
    lastPoint.current = null
    watchRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const next = { lat: pos.coords.latitude, lng: pos.coords.longitude, t: Date.now() }
        if (lastPoint.current) {
          const distanceKm = haversineKm(lastPoint.current, next)
          const hours = Math.max(0.0001, (next.t - lastPoint.current.t) / 3600000)
          const speed = pos.coords.speed != null ? pos.coords.speed * 3.6 : distanceKm / hours
          persistTick(distanceKm, speed)
        }
        lastPoint.current = next
      },
      () => startDemo(),
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 8000 },
    )
  }

  const startDemo = () => {
    if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current)
    tally.current = { distanceKm: 0, emissionsKg: 0 }
    dispatch({ type: 'gps-start', simulated: true })
    let i = 0
    simRef.current = setInterval(() => {
      persistTick(0.35, SIM_SPEEDS[i % SIM_SPEEDS.length])
      i += 1
    }, 1200)
  }

  const stop = () => {
    if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current)
    if (simRef.current) clearInterval(simRef.current)
    const distanceKm = tally.current.distanceKm
    const emissionsKg = tally.current.emissionsKg
    const mode = state.gps.mode
    if (distanceKm > 0) {
      dispatch({
        type: 'add-log',
        log: {
          id: newId('gps'),
          name: `${mode} · ${distanceKm.toFixed(1)} km`,
          kg: round3(emissionsKg),
          category: 'transport',
          type: 'gps',
          at: new Date().toISOString(),
        },
      })
    }
    dispatch({ type: 'gps-stop' })
  }

  return (
    <div className="card p-6">
      <p className="font-semibold">Track a commute</p>
      <p className="mt-1 max-w-xl text-sm text-mute">
        Uses your phone GPS. Speed decides the mode: walk, bike, transit, car, or highway. Then it multiplies distance by a standard CO₂ factor.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {state.gps.active ? (
          <button className="btn btn-ghost" onClick={stop}>Stop and save</button>
        ) : (
          <>
            <button className="btn btn-primary" onClick={startLive}>Start GPS tracking</button>
            <button className="btn btn-ghost" onClick={startDemo}>Play a demo commute</button>
          </>
        )}
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="How you’re moving" value={state.gps.mode} />
        <Stat label="Speed" value={`${state.gps.speedKmh.toFixed(0)} km/h`} />
        <Stat label="Distance" value={`${state.gps.distanceKm.toFixed(2)} km`} />
        <Stat label="CO₂ this trip" value={`${state.gps.emissionsKg.toFixed(2)} kg`} />
      </div>
      {state.gps.simulated && (
        <p className="mt-3 text-sm text-mute">Demo mode: speed changes on a timer so you can show judges without going outside.</p>
      )}
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-line p-4">
      <p className="text-xs text-mute">{label}</p>
      <p className="mono mt-1">{value}</p>
    </div>
  )
}
