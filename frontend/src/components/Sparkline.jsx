import React, { useEffect, useRef } from 'react'

export default function Sparkline({ values, color = '#3dffc8' }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const nums = values.length ? values : [0]
    const min = Math.min(...nums)
    const max = Math.max(...nums)
    const span = Math.max(1, max - min)
    const step = width / Math.max(1, nums.length - 1)
    const points = nums.map((value, i) => ({
      x: i * step,
      y: height - 8 - ((value - min) / span) * (height - 16),
    }))

    ctx.clearRect(0, 0, width, height)
    ctx.beginPath()
    points.forEach((point, i) => (i === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y)))
    ctx.lineTo(width, height)
    ctx.lineTo(0, height)
    ctx.closePath()
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, color + '55')
    gradient.addColorStop(1, 'transparent')
    ctx.fillStyle = gradient
    ctx.fill()

    ctx.beginPath()
    points.forEach((point, i) => (i === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y)))
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.stroke()
  }, [values, color])

  return <canvas ref={ref} className="h-28 w-full" />
}
