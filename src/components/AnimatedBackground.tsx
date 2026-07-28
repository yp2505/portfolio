'use client'

import React, { useEffect, useRef } from 'react'

const AnimatedBackground = () => {
  const blobRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    let requestId: number

    const handleScroll = () => {
      const scroll = window.pageYOffset

      blobRefs.current.forEach((blob, index) => {
        if (!blob) return
        const xOffset = Math.sin(scroll / 130 + index * 0.7) * 90
        const yOffset = Math.cos(scroll / 130 + index * 0.7) * 30
        blob.style.transform = `translate(${xOffset}px, ${yOffset}px)`
        blob.style.transition = 'transform 1.4s ease-out'
      })

      requestId = requestAnimationFrame(handleScroll)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(requestId)
    }
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <div style={{ position: 'absolute', inset: 0 }}>
        {/* Top-left blue blob */}
        <div
          ref={(ref) => { blobRefs.current[0] = ref }}
          style={{
            position: 'absolute',
            top: '5%',
            left: '5%',
            width: 'clamp(200px, 22vw, 380px)',
            height: 'clamp(200px, 22vw, 380px)',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(14,165,233,0.2) 0%, transparent 70%)',
            filter: 'blur(70px)',
          }}
        />

        {/* Top-right cyan blob */}
        <div
          ref={(ref) => { blobRefs.current[1] = ref }}
          style={{
            position: 'absolute',
            top: '10%',
            right: '5%',
            width: 'clamp(160px, 18vw, 300px)',
            height: 'clamp(160px, 18vw, 300px)',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />

        {/* Bottom-left deep blue */}
        <div
          ref={(ref) => { blobRefs.current[2] = ref }}
          style={{
            position: 'absolute',
            bottom: '12%',
            left: '8%',
            width: 'clamp(180px, 20vw, 320px)',
            height: 'clamp(180px, 20vw, 320px)',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(3,105,161,0.22) 0%, transparent 70%)',
            filter: 'blur(90px)',
          }}
        />

        {/* Bottom-right subtle */}
        <div
          ref={(ref) => { blobRefs.current[3] = ref }}
          style={{
            position: 'absolute',
            bottom: '8%',
            right: '8%',
            width: 'clamp(140px, 16vw, 260px)',
            height: 'clamp(140px, 16vw, 260px)',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56,189,248,0.1) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
      </div>

      {/* Subtle grid overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(to right, rgba(14,165,233,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(14,165,233,0.04) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
    </div>
  )
}

export default AnimatedBackground