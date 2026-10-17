'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import WelcomeScreen from '@/components/WelcomeScreen'
import MacDock from '@/components/ui/MacDock'
import DesktopIcons from '@/components/ui/DesktopIcons'
import MobilePillNav from '@/components/ui/MobilePillNav'
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
          fontSize: '0.85rem',
          fontWeight: 500,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.45)',
          marginBottom: 14,
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
  const [showWelcome, setShowWelcome] = useState(true)
  const { isMobile, isReady } = useIsDevice()

  useEffect(() => {
    const currentHash = window.location.hash
    const pathname = window.location.pathname

    if (currentHash === '#portfolio') {
      setTimeout(() => setShowWelcome(false), 0)
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
    }

    if (!hasPlayedIntro()) {
      setShowWelcome(true)
    } else {
      setShowWelcome(false)
    }
  }, [])

  const handleUnlock = () => {
    setShowWelcome(false)
    setIntroPlayed()
  }

  // Don't flash wrong UI before device detection finishes
  if (!isReady) return null

  return (
    <>
      {isMobile ? (
        /* ─── iOS Mobile UI ─── */
        <>
          {/* Pill nav — top center, always visible on mobile */}
          <MobilePillNav />

          {/* iOS home screen content (shown after unlock) */}
          <AnimatePresence>
            {!showWelcome && <MobileHomeScreen />}
          </AnimatePresence>
        </>
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