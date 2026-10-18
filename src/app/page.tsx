'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import WelcomeScreen from '@/components/WelcomeScreen'
import MacDock from '@/components/ui/MacDock'
import DesktopIcons from '@/components/ui/DesktopIcons'
import MobileHomeScreen from '@/components/ui/MobileHomeScreen'
import { hasPlayedIntro, setIntroPlayed } from '@/lib/introState'
import { useIsDevice } from '@/lib/useIsDevice'

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1]

function DesktopWelcomeHero() {
  return (
    <motion.div
      key="hero"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.2 }}
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        color: 'white',
        fontFamily: "'Inter', system-ui, sans-serif",
        pointerEvents: 'none',
        zIndex: 5,
        userSelect: 'none',
      }}
    >
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.35 }}
        style={{
          fontSize: 'clamp(1.6rem, 3vw, 2.5rem)',
          fontWeight: 700,
          color: 'white',
          fontFamily: "var(--font-dancing), 'Dancing Script', cursive",
          marginBottom: 14,
          letterSpacing: '0.01em',
          lineHeight: 1.2,
          textShadow: '0 2px 20px rgba(0,0,0,0.35)',
        }}
      >
        Welcome to my portfolio
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.5 }}
        style={{
          fontSize: 'clamp(2.4rem, 5vw, 4.5rem)',
          fontWeight: 700,
          letterSpacing: '-0.035em',
          lineHeight: 1.05,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.55) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        Yug Patel
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.75 }}
        style={{
          marginTop: 12,
          fontSize: '1rem',
          fontWeight: 400,
          color: 'rgba(255,255,255,0.38)',
          letterSpacing: '0.02em',
        }}
      >
        AI &amp; ML Developer
      </motion.p>
    </motion.div>
  )
}

export default function Home() {
  // null = not yet determined; true = show welcome; false = skip welcome
  const [showWelcome, setShowWelcome] = useState<boolean | null>(null)
  const { isMobile, isReady } = useIsDevice()

  useEffect(() => {
    if (!isReady) return          // wait until device is known

    const currentHash = window.location.hash
    const pathname = window.location.pathname

    if (currentHash === '#portfolio') {
      setShowWelcome(false)
      return
    }

    const navEntries = performance.getEntriesByType('navigation')
    const navigationType =
      navEntries.length > 0
        ? (navEntries[0] as PerformanceNavigationTiming).type
        : null

    const isReload = navigationType === 'reload'

    if (isReload && pathname === '/') {
      sessionStorage.removeItem('introPlayed')
      sessionStorage.removeItem('heroPlayed')

      if (window.location.hash) {
        history.replaceState(null, '', '/')
      }

      window.scrollTo({ top: 0, behavior: 'instant' })
      setShowWelcome(true)
      return
    }

    // If introPlayed is set (first visit dismissed or coming back via nav),
    // skip the welcome screen entirely.
    setShowWelcome(!hasPlayedIntro())
  }, [isReady])

  const handleUnlock = () => {
    setShowWelcome(false)
    setIntroPlayed()
  }

  // Block render until both device detection AND welcome state are resolved.
  // This prevents the lock screen from flashing when navigating back to home.
  if (!isReady || showWelcome === null) return null

  return (
    <>
      {isMobile ? (
        /* ─── iOS Mobile UI ─── */
        <AnimatePresence>
          {!showWelcome && <MobileHomeScreen />}
        </AnimatePresence>
      ) : (
        /* ─── macOS Desktop UI ─── */
        <div style={{ position: 'fixed', inset: 0 }}>
          <DesktopIcons />
          <MacDock />
          <AnimatePresence>
            {!showWelcome && <DesktopWelcomeHero />}
          </AnimatePresence>
        </div>
      )}

      {/* Lock screen — shown on BOTH, adapts to device */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            key="welcome"
            initial={{ y: 0 }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
            style={{ position: 'fixed', inset: 0, zIndex: 9999 }}
          >
            <WelcomeScreen onUnlock={handleUnlock} isMobile={isMobile} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}