'use client'

import { useEffect, useRef } from 'react'

interface Snowflake {
  x: number
  y: number
  radius: number
  speed: number
  opacity: number
  drift: number
  driftSpeed: number
  driftOffset: number
}

export default function SnowParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const flakes: Snowflake[] = []
    const COUNT = 120

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Init flakes
    for (let i = 0; i < COUNT; i++) {
      flakes.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 2.4 + 0.4,
        speed: Math.random() * 0.8 + 0.2,
        opacity: Math.random() * 0.5 + 0.1,
        drift: Math.random() * Math.PI * 2,
        driftSpeed: Math.random() * 0.005 + 0.002,
        driftOffset: Math.random() * 1.2,
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const f of flakes) {
        ctx.beginPath()
        ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(56, 189, 248, ${f.opacity})`
        ctx.shadowBlur = f.radius * 3
        ctx.shadowColor = `rgba(14, 165, 233, ${f.opacity * 0.6})`
        ctx.fill()

        // Update position
        f.drift += f.driftSpeed
        f.x += Math.sin(f.drift) * f.driftOffset
        f.y += f.speed

        // Reset when out of screen
        if (f.y > canvas.height + 10) {
          f.y = -10
          f.x = Math.random() * canvas.width
        }
        if (f.x > canvas.width + 10) f.x = -10
        if (f.x < -10) f.x = canvas.width + 10
      }

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  )
}
