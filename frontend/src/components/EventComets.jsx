import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { formatKg } from '../lib/format'
import { newId, useStore } from '../lib/store'

const SWAPS = {
  flight: 'Hold the meeting as a video link',
  shopping: 'Buy local or used',
  car: 'Shift the hop onto transit',
  virtual: 'Already the lightest option',
  green: 'Keep the streak',
}

export default function EventComets() {
  const { state, dispatch } = useStore()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', kg: '', type: 'green' })

  const addEvent = (event) => {
    event.preventDefault()
    dispatch({
      type: 'add-event',
      event: {
        id: newId('e'),
        name: form.name,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        kg: Number(form.kg) || 0,
        type: form.type,
      },
    })
    setForm({ name: '', kg: '', type: 'green' })
    setOpen(false)
  }

  return (
    <div className="panel p-6">
      <p className="kicker">Calendar drag</p>
      <h3 className="display text-3xl mb-6">Event comets</h3>

      <div className="relative mb-8 h-40">
        <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
        <div className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-signal/20" />
        <motion.div
          className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2"
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        >
          {state.events.slice(0, 4).map((event, i) => (
            <div
              key={event.id}
              className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 rounded-full"
              style={{
                background: event.kg < 0 ? '#3dffc8' : event.kg > 20 ? '#ff6b6b' : '#f5c542',
                transform: `rotate(${i * 90}deg) translateY(-70px)`,
              }}
            />
          ))}
        </motion.div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {state.events.map((event) => (
          <div key={event.id} className="panel-tight p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{event.name}</p>
                <p className="mono text-xs text-mute">{event.time} · {event.type}</p>
              </div>
              <span className={`mono text-sm ${event.kg < 0 ? 'text-signal' : event.kg > 20 ? 'text-flare' : 'text-gold'}`}>
                {formatKg(event.kg)}
              </span>
            </div>
            {event.kg > 0 && (
              <p className="mt-3 text-xs text-ion">{SWAPS[event.type] || 'Find a lighter vector'}</p>
            )}
          </div>
        ))}
      </div>

      {open ? (
        <form onSubmit={addEvent} className="mt-5 grid gap-3 sm:grid-cols-3">
          <input className="field" placeholder="Event name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="field" placeholder="kg CO2e" value={form.kg} onChange={(e) => setForm({ ...form, kg: e.target.value })} />
          <select className="field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="green">Green</option>
            <option value="flight">Flight</option>
            <option value="shopping">Shopping</option>
            <option value="virtual">Virtual</option>
            <option value="car">Car</option>
          </select>
          <button className="btn btn-primary sm:col-span-3" type="submit">Commit comet</button>
        </form>
      ) : (
        <button className="btn btn-ghost mt-5 w-full" onClick={() => setOpen(true)}>
          Add new event
        </button>
      )}
    </div>
  )
}
