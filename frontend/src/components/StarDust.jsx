import React, { useEffect, useRef } from 'react'

export default function StarDust() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let frame
    let particles = []
    let shooting = []

    const colors = ['#ff8ec8', '#c084fc', '#7dffe0', '#ffffff', '#67e8f9']

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      const count = Math.min(160, Math.floor((canvas.width * canvas.height) / 12000))
      particles = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.6 + 0.2,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        phase: Math.random() * Math.PI * 2,
        speed: 0.008 + Math.random() * 0.016,
        color: colors[i % colors.length],
      }))
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
        const alpha = 0.22 + 0.55 * Math.abs(Math.sin(p.phase))
        ctx.globalAlpha = alpha
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
        if (p.r > 1) {
          ctx.globalAlpha = alpha * 0.25
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      if (Math.random() < 0.012 && shooting.length < 3) {
        shooting.push({ x: Math.random() * canvas.width * 0.7, y: Math.random() * canvas.height * 0.4, life: 0, max: 50 })
      }
      shooting = shooting.filter((s) => s.life < s.max)
      shooting.forEach((s) => {
        s.life += 1
        const t = s.life / s.max
        ctx.globalAlpha = (1 - t) * 0.7
        ctx.strokeStyle = '#ffd6ee'
        ctx.lineWidth = 1.4
        ctx.beginPath()
        ctx.moveTo(s.x + t * 220, s.y + t * 80)
        ctx.lineTo(s.x + t * 220 - 70, s.y + t * 80 - 24)
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
      <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" />
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse at 12% 8%, rgba(255, 142, 200, 0.18), transparent 40%),
            radial-gradient(ellipse at 88% 18%, rgba(109, 74, 255, 0.22), transparent 46%),
            radial-gradient(ellipse at 70% 90%, rgba(125, 255, 224, 0.08), transparent 42%),
            radial-gradient(ellipse at 50% 50%, rgba(7, 3, 15, 0.2), transparent 55%)
          `,
        }}
      />
    </>
  )
}
