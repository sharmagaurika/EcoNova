import React, { useEffect, useRef } from 'react'

export default function Starfield() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let frame
    let particles = []
    let shooting = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      particles = Array.from({ length: Math.min(180, Math.floor((canvas.width * canvas.height) / 14000)) }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.4 + 0.2,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        phase: Math.random() * Math.PI * 2,
        speed: 0.008 + Math.random() * 0.02,
        color: Math.random() > 0.7 ? '#3dffc8' : Math.random() > 0.5 ? '#82a7ff' : '#ffffff',
      }))
    }

    const spawnShoot = () => {
      shooting.push({
        x: Math.random() * canvas.width * 0.6,
        y: Math.random() * canvas.height * 0.4,
        life: 0,
        max: 48 + Math.random() * 24,
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.phase += p.speed
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        const alpha = 0.25 + 0.55 * Math.abs(Math.sin(p.phase))
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = alpha
        ctx.fill()
      })

      if (Math.random() < 0.008 && shooting.length < 3) spawnShoot()
      shooting = shooting.filter((s) => s.life < s.max)
      shooting.forEach((s) => {
        s.life += 1
        const t = s.life / s.max
        const x = s.x + t * 260
        const y = s.y + t * 90
        ctx.globalAlpha = 1 - t
        ctx.strokeStyle = 'rgba(232,238,247,0.8)'
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x - 70, y - 24)
        ctx.stroke()
      })

      ctx.globalAlpha = 1
      frame = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 12% 20%, rgba(109, 74, 255, 0.18), transparent 42%),
            radial-gradient(ellipse at 88% 10%, rgba(61, 255, 200, 0.08), transparent 38%),
            radial-gradient(ellipse at 80% 80%, rgba(130, 167, 255, 0.14), transparent 46%),
            radial-gradient(ellipse at 50% 100%, rgba(5, 7, 12, 0.95), transparent 40%)
          `,
        }}
      />
    </>
  )
}
