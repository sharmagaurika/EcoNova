import React, { useMemo } from 'react'

export default function StreakCalendar({ logs }) {
  const cells = useMemo(() => {
    const days = Array.from({ length: 28 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (27 - i))
      const key = date.toISOString().slice(0, 10)
      const hits = logs.filter((log) => log.at.slice(0, 10) === key)
      const green = hits.some((log) => log.kg < 0)
      const heavy = hits.some((log) => log.kg > 20)
      return { key, green, heavy, day: date.getDate() }
    })
    return days
  }, [logs])

  return (
    <div>
      <p className="kicker mb-3">28-day burn calendar</p>
      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((cell) => (
          <div
            key={cell.key}
            title={cell.key}
            className={`grid h-8 place-items-center rounded-md text-[10px] mono ${
              cell.heavy ? 'bg-flare/30 text-flare' : cell.green ? 'bg-signal/25 text-signal' : 'bg-white/5 text-mute'
            }`}
          >
            {cell.day}
          </div>
        ))}
      </div>
    </div>
  )
}
