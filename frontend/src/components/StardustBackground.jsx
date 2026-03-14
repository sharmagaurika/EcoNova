import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const StardustBackground = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationFrameId
    let particles = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createParticles = () => {
      particles = []
      const particleCount = Math.floor((canvas.width * canvas.height) / 8000)
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.2 + 0.3,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          opacity: Math.random() * 0.5 + 0.2,
          // Mix of pink, purple, blue for galaxy feel
          color: Math.random() > 0.6 ? '#FF85C1' : Math.random() > 0.4 ? '#7B61FF' : Math.random() > 0.3 ? '#3B82F6' : '#ffffff',
          twinkleSpeed: Math.random() * 0.015 + 0.005,
          twinklePhase: Math.random() * Math.PI * 2,
        })
      }
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy
        
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0
        
        particle.twinklePhase += particle.twinkleSpeed
        const twinkleOpacity = particle.opacity * (0.5 + 0.5 * Math.sin(particle.twinklePhase))
        
        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.globalAlpha = twinkleOpacity
        ctx.fill()
        
        // Glow for larger particles
        if (particle.radius > 0.8) {
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.radius * 2.5, 0, Math.PI * 2)
          ctx.fillStyle = particle.color
          ctx.globalAlpha = twinkleOpacity * 0.2
          ctx.fill()
        }
      })
      
      ctx.globalAlpha = 1
      animationFrameId = requestAnimationFrame(drawParticles)
    }

    const init = () => {
      resize()
      createParticles()
      drawParticles()
    }

    window.addEventListener('resize', () => {
      resize()
      createParticles()
    })

    init()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <>
      {/* Canvas for stars */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ background: 'transparent' }}
      />

      {/* Deep space gradient overlays - more galaxy-like */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: `
            radialGradient(ellipse at 15% 85%, rgba(82, 34, 165, 0.25) 0%, transparent 50%),
            radialGradient(ellipse at 85% 15%, rgba(59, 130, 246, 0.2) 0%, transparent 50%),
            radialGradient(ellipse at 50% 50%, rgba(123, 97, 255, 0.1) 0%, transparent 60%),
            radialGradient(ellipse at 5% 15%, rgba(255, 133, 193, 0.12) 0%, transparent 40%),
            radialGradient(ellipse at 95% 75%, rgba(255, 133, 193, 0.08) 0%, transparent 35%)
          `,
        }}
      />

      {/* Nebula clouds - more subtle */}
      <motion.div
        className="fixed inset-0 z-0 pointer-events-none opacity-20"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          background: `
            radialGradient(circle at 25% 35%, rgba(82, 34, 165, 0.35) 0%, transparent 30%),
            radialGradient(circle at 75% 55%, rgba(123, 97, 255, 0.25) 0%, transparent 35%),
            radialGradient(circle at 45% 75%, rgba(59, 130, 246, 0.2) 0%, transparent 30%),
            radialGradient(circle at 85% 25%, rgba(255, 133, 193, 0.15) 0%, transparent 25%)
          `,
          backgroundSize: '200% 200%',
        }}
      />

      {/* Larger sparkles */}
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          className="fixed rounded-full pointer-events-none z-0"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            background: i % 4 === 0 ? '#FF85C1' : i % 4 === 1 ? '#7B61FF' : i % 4 === 2 ? '#3B82F6' : '#ffffff',
            boxShadow: `0 0 8px ${i % 4 === 0 ? '#FF85C1' : i % 4 === 1 ? '#7B61FF' : i % 4 === 2 ? '#3B82F6' : '#ffffff'}`,
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, 25, 0],
            opacity: [0.2, 0.9, 0.2],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 5 + i * 0.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.15,
          }}
        />
      ))}

      {/* Shooting stars */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`shooting-${i}`}
          className="fixed w-1 h-1 bg-white rounded-full pointer-events-none z-0"
          style={{
            top: `${10 + i * 20}%`,
            left: '-2%',
          }}
          animate={{
            x: ['0vw', '140vw'],
            y: ['0vh', '40vh'],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.2 + i * 0.3,
            repeat: Infinity,
            ease: "easeIn",
            delay: 3 + i * 5,
          }}
        >
          {/* Trail */}
          <div 
            className="h-0.5 rounded-full absolute right-full top-1/2 -translate-y-1/2"
            style={{
              width: '80px',
              background: 'linear-gradient(to left, rgba(255,255,255,0.8), transparent)',
            }}
          />
        </motion.div>
      ))}
    </>
  )
}

export default StardustBackground
