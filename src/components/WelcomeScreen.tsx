'use client'

import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

interface WelcomeScreenProps {
  onUnlock?: () => void
  isMobile?: boolean
}

// Apple ease-out from animate skill
const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1]

export default function WelcomeScreen({ onUnlock, isMobile = false }: WelcomeScreenProps) {
  const [dateStr, setDateStr] = useState('')
  const [timeStr, setTimeStr] = useState('')

  // Drag motion value for swipe-up gesture (mobile)
  const dragY = useMotionValue(0)
  const dragStartY = useRef(0)
  const dragStartTime = useRef(0)
  const isDragging = useRef(false)

  // Opacity fades as user swipes up
  const screenOpacity = useTransform(dragY, [-200, 0], [0, 1])

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTimeStr(now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }))
      setDateStr(now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }))
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  // Desktop: keyboard & scroll — always active on desktop
  useEffect(() => {
    if (isMobile) return
    const handleKeyDown = (e: KeyboardEvent) => {
      onUnlock?.()
    }
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 5) onUnlock?.()
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('wheel', handleWheel, { passive: true })
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('wheel', handleWheel)
    }
  }, [onUnlock, isMobile])

  // Mobile swipe-up
  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY
    dragStartTime.current = Date.now()
    isDragging.current = true
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return
    const delta = e.touches[0].clientY - dragStartY.current
    // only allow upward drag (negative delta)
    if (delta < 0) dragY.set(Math.max(delta, -300))
  }
  const handleTouchEnd = () => {
    if (!isDragging.current) return
    isDragging.current = false
    const elapsed = Date.now() - dragStartTime.current
    const velocity = Math.abs(dragY.get()) / elapsed   // px/ms

    if (dragY.get() < -80 || velocity > 0.35) {
      // fast or far enough — unlock with spring
      animate(dragY, -window.innerHeight, {
        type: 'spring',
        bounce: 0,
        duration: 0.45,
        onComplete: () => onUnlock?.(),
      })
    } else {
      // snap back — critically damped spring
      animate(dragY, 0, { type: 'spring', bounce: 0, duration: 0.4 })
    }
  }

  return (
    <motion.div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={() => !isMobile && onUnlock?.()}
      style={{
        y: dragY,
        opacity: isMobile ? screenOpacity : 1,
        width: '100%',
        height: '100dvh',
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        backdropFilter: 'blur(48px) saturate(160%) brightness(0.85)',
        WebkitBackdropFilter: 'blur(48px) saturate(160%) brightness(0.85)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        cursor: isMobile ? 'default' : 'pointer',
        touchAction: isMobile ? 'none' : 'auto',
        // Safe area for notch/island
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {/* Status bar blur — paint edge to edge behind notch */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 'calc(env(safe-area-inset-top, 0px) + 50px)',
          background: 'rgba(0,0,0,0)',
          pointerEvents: 'none',
        }}
      />

      {/* Date & Time — Apple lock screen style */}
      <motion.div
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE_OUT }}
        style={{
          position: 'absolute',
          top: isMobile ? '15%' : '14%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          color: 'white',
          fontFamily: "'Inter', system-ui, sans-serif",
          textShadow: '0 1px 12px rgba(0,0,0,0.18)',
        }}
      >
        {/* Date */}
        <div
          style={{
            fontSize: isMobile ? '1.05rem' : '1.25rem',
            fontWeight: 500,
            letterSpacing: '0.01em',
            opacity: 0.85,
            marginBottom: 4,
          }}
        >
          {dateStr}
        </div>
        {/* Time — Apple optical sizing: tight tracking on large text */}
        <div
          style={{
            fontSize: isMobile ? 'clamp(5rem, 22vw, 7rem)' : '7rem',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.0,
            fontFeatureSettings: '"tnum"',
          }}
        >
          {timeStr}
        </div>
      </motion.div>

      {/* Name badge — centered */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.15 }}
        style={{
          textAlign: 'center',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        {/* Avatar / initials pill */}
        <div
          style={{
            width: isMobile ? 62 : 72,
            height: isMobile ? 62 : 72,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(14,165,233,0.85) 0%, rgba(6,182,212,0.7) 100%)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255,255,255,0.25)',
            boxShadow: '0 4px 24px rgba(14,165,233,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: isMobile ? '1.4rem' : '1.6rem',
            fontWeight: 700,
            color: 'white',
          }}
        >
          Y
        </div>

        <div
          style={{
            fontSize: isMobile ? '1.5rem' : '1.75rem',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            textShadow: '0 2px 12px rgba(0,0,0,0.3)',
          }}
        >
          Yug Patel
        </div>
        <div
          style={{
            fontSize: isMobile ? '0.85rem' : '0.95rem',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.55)',
            letterSpacing: '0.02em',
          }}
        >
          AI &amp; ML Developer
        </div>
      </motion.div>

      {/* Mobile: Swipe hint */}
      {isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          style={{
            position: 'absolute',
            bottom: 'calc(env(safe-area-inset-bottom, 0px) + 28px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            color: 'rgba(255,255,255,0.65)',
            fontSize: '0.85rem',
            fontWeight: 500,
            letterSpacing: '0.04em',
            fontFamily: "'Inter', system-ui, sans-serif",
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
        >
          {/* Swipe arrow — bouncing */}
          <motion.div
            animate={{ y: [-4, 4, -4] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ fontSize: '1.2rem', opacity: 0.7 }}
          >
            ↑
          </motion.div>
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            Swipe up to enter
          </motion.span>
          {/* Home indicator bar */}
          <div
            style={{
              width: 134,
              height: 5,
              borderRadius: 999,
              backgroundColor: 'rgba(255,255,255,0.35)',
              marginTop: 8,
            }}
          />
        </motion.div>
      )}

      {/* Desktop hint */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.7, 0] }}
          transition={{ delay: 1, duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            bottom: '10%',
            color: 'rgba(255,255,255,0.6)',
            fontSize: '0.9rem',
            fontWeight: 500,
            letterSpacing: '0.05em',
            fontFamily: "'Inter', system-ui, sans-serif",
            pointerEvents: 'none',
          }}
        >
          Press any key, click, or scroll to continue
        </motion.div>
      )}
    </motion.div>
  )
}