import React, { useMemo } from 'react'

export default function StreakCalendar({ logs }) {
  const cells = useMemo(() => {
    return Array.from({ length: 28 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (27 - i))
      const key = date.toISOString().slice(0, 10)
      const hits = logs.filter((log) => log.at.slice(0, 10) === key)
      const green = hits.some((log) => log.kg < 0)
      const heavy = hits.some((log) => log.kg > 20)
      return { key, green, heavy, day: date.getDate() }
    })
  }, [logs])

  return (
    <div>
      <p className="font-semibold">Last 28 days</p>
      <p className="mt-1 text-sm text-mute">Green = you logged a low-carbon action. Orange = a high-impact day.</p>
      <div className="mt-3 grid grid-cols-7 gap-1.5">
        {cells.map((cell) => (
          <div
            key={cell.key}
            title={cell.key}
            className={`grid h-8 place-items-center rounded-md text-[10px] mono ${
              cell.heavy ? 'bg-amber-400/20 text-amber-200' : cell.green ? 'bg-good/20 text-good' : 'bg-white/5 text-mute'
            }`}
          >
            {cell.day}
          </div>
        ))}
      </div>
    </div>
  )
}
