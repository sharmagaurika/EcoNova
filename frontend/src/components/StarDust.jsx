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

    const colors = ['#5b3cc4', '#c084fc', '#67e8f9', '#176b45', '#f0abfc']

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      const count = Math.min(90, Math.floor((canvas.width * canvas.height) / 22000))
      particles = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.3 + 0.25,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08,
        phase: Math.random() * Math.PI * 2,
        speed: 0.006 + Math.random() * 0.012,
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
        ctx.globalAlpha = 0.18 + 0.28 * Math.abs(Math.sin(p.phase))
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      })

      if (Math.random() < 0.006 && shooting.length < 2) {
        shooting.push({ x: Math.random() * canvas.width * 0.7, y: Math.random() * canvas.height * 0.3, life: 0, max: 42 })
      }
      shooting = shooting.filter((s) => s.life < s.max)
      shooting.forEach((s) => {
        s.life += 1
        const t = s.life / s.max
        ctx.globalAlpha = (1 - t) * 0.35
        ctx.strokeStyle = '#5b3cc4'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(s.x + t * 180, s.y + t * 70)
        ctx.lineTo(s.x + t * 180 - 50, s.y + t * 70 - 18)
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

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" />
}
