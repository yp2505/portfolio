'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface WelcomeScreenProps {
  onUnlock?: () => void
}

export default function WelcomeScreen({ onUnlock }: WelcomeScreenProps) {
  const [dateStr, setDateStr] = useState('')
  const [timeStr, setTimeStr] = useState('')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTimeStr(now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }))
      setDateStr(now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }))
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)

    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)

    return () => {
      clearInterval(timer)
      window.removeEventListener('resize', check)
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        onUnlock?.()
      }
    }
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 10) {
        onUnlock?.()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('wheel', handleWheel)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('wheel', handleWheel)
    }
  }, [onUnlock])

  return (
    <div
      onClick={() => onUnlock?.()}
      style={{
        width: '100%', height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(40px) saturate(150%) brightness(0.8)',
        WebkitBackdropFilter: 'blur(40px) saturate(150%) brightness(0.8)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        position: 'fixed', inset: 0, zIndex: 9999, padding: '20px',
        cursor: 'pointer'
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{
          position: 'absolute',
          top: isMobile ? '16%' : '12%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          color: 'white',
          textShadow: '0 2px 10px rgba(0,0,0,0.2)',
          fontFamily: "'Inter', sans-serif"
        }}
      >
        <div style={{ fontSize: isMobile ? '1.2rem' : '1.4rem', fontWeight: 500 }}>{dateStr}</div>
        <div style={{ fontSize: isMobile ? '4.5rem' : '6rem', fontWeight: 700, letterSpacing: '-0.02em', marginTop: '-10px' }}>{timeStr}</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{
          textAlign: 'center', color: 'white',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px',
          fontFamily: "'Inter', sans-serif"
        }}
      >
        {/* Name */}
        <div style={{ fontSize: '1.75rem', fontWeight: 600, letterSpacing: '0.02em', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
          Yug Patel
        </div>

      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
        style={{
          position: 'absolute',
          bottom: isMobile ? '15%' : '10%',
          color: 'rgba(255,255,255,0.7)',
          fontSize: isMobile ? '0.9rem' : '1rem',
          fontWeight: 500,
          letterSpacing: '0.05em',
          fontFamily: "'Inter', sans-serif"
        }}
      >
        {isMobile ? 'Tap or swipe up to unlock' : 'Press Enter or scroll to unlock'}
      </motion.div>
    </div>
  )
}