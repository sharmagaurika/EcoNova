import React, { useEffect, useState } from 'react'

const TRAIL = 8

export default function SpaceCursor() {
  const [on, setOn] = useState(false)
  const [points, setPoints] = useState(() => Array.from({ length: TRAIL }, () => ({ x: -40, y: -40 })))
  const [hot, setHot] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return undefined
    setOn(true)
    document.documentElement.classList.add('space-cursor')

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    const trail = Array.from({ length: TRAIL }, () => ({ x, y }))
    let raf

    const move = (e) => {
      x = e.clientX
      y = e.clientY
      const node = e.target
      setHot(Boolean(node?.closest?.('a, button, label, summary, [role="button"]')))
    }

    const tick = () => {
      trail[0].x += (x - trail[0].x) * 0.38
      trail[0].y += (y - trail[0].y) * 0.38
      for (let i = 1; i < TRAIL; i += 1) {
        trail[i].x += (trail[i - 1].x - trail[i].x) * 0.32
        trail[i].y += (trail[i - 1].y - trail[i].y) * 0.32
      }
      setPoints(trail.map((p) => ({ ...p })))
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', move)
    raf = requestAnimationFrame(tick)
    return () => {
      document.documentElement.classList.remove('space-cursor')
      window.removeEventListener('mousemove', move)
      cancelAnimationFrame(raf)
    }
  }, [])

  if (!on) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[80]" aria-hidden>
      {points.map((p, i) => (
        <span
          key={i}
          className="absolute"
          style={{
            left: p.x,
            top: p.y,
            transform: `translate(-50%, -50%) scale(${i === 0 ? (hot ? 1.25 : 1) : 0.28 + (1 - i / TRAIL) * 0.35}) rotate(45deg)`,
            width: i === 0 ? 18 : 8,
            height: i === 0 ? 18 : 8,
            opacity: i === 0 ? 1 : 0.18 + (1 - i / TRAIL) * 0.35,
            background: i === 0
              ? 'radial-gradient(circle, #fff 0 18%, #c4b5fd 18% 42%, #5b3cc4 42% 100%)'
              : '#a78bfa',
            clipPath: 'polygon(50% 0, 62% 38%, 100% 50%, 62% 62%, 50% 100%, 38% 62%, 0 50%, 38% 38%)',
            filter: i === 0 ? 'drop-shadow(0 0 6px rgba(91,60,196,0.7))' : 'none',
          }}
        />
      ))}
    </div>
  )
}
