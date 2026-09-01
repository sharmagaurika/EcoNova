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

  const persistTick = (distanceKm, speedKmh, extra = {}) => {
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
        ...extra,
      },
    })
    logMovement(distanceKm, speedKmh).catch(() => {})
  }

  const startLive = () => {
    if (!navigator.geolocation) {
      startSim()
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
      () => startSim(),
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 8000 },
    )
  }

  const startSim = () => {
    if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current)
    tally.current = { distanceKm: 0, emissionsKg: 0 }
    dispatch({ type: 'gps-start', simulated: true })
    let i = 0
    simRef.current = setInterval(() => {
      const speed = SIM_SPEEDS[i % SIM_SPEEDS.length]
      persistTick(0.35, speed)
      i += 1
    }, 1200)
  }

  const stop = () => {
    if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current)
    if (simRef.current) clearInterval(simRef.current)
    const { distanceKm, emissionsKg, mode } = tally.current.distanceKm
      ? { ...tally.current, mode: state.gps.mode }
      : state.gps
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
    <div className="panel p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="kicker">Passive GPS sensing</p>
          <h3 className="display text-3xl">Live transport class</h3>
          <p className="mt-2 max-w-md text-sm text-mute">
            Speed thresholds map walking, cycling, transit, car, and highway using IPCC/DEFRA factors.
          </p>
        </div>
        {state.gps.active ? (
          <button className="btn btn-ghost" onClick={stop}>End session</button>
        ) : (
          <div className="flex gap-2">
            <button className="btn btn-primary" onClick={startLive}>Arm GPS</button>
            <button className="btn btn-ghost" onClick={startSim}>Simulate commute</button>
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Mode" value={state.gps.mode} />
        <Stat label="Speed" value={`${state.gps.speedKmh.toFixed(0)} km/h`} />
        <Stat label="Distance" value={`${state.gps.distanceKm.toFixed(2)} km`} />
        <Stat label="Mass added" value={`${state.gps.emissionsKg.toFixed(3)} kg`} />
      </div>
      {state.gps.simulated && (
        <p className="mt-3 text-xs text-gold">Demo telemetry — speed ramps through the classification table.</p>
      )}
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="panel-tight p-4">
      <p className="kicker">{label}</p>
      <p className="mono mt-1 text-lg">{value}</p>
    </div>
  )
}
