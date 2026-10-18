'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import WelcomeScreen from '@/components/WelcomeScreen'
import PortfolioDesktop from '@/components/PortfolioDesktop'
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
        // Responsive bounds: bounded between top menu (28px) and bottom dock (110px)
        // Flexbox centering calculates the precise geometric & optical center of available space
        top: 28,
        bottom: 110,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'white',
        fontFamily: "'Inter', system-ui, sans-serif",
        pointerEvents: 'none',
        zIndex: 5,
        userSelect: 'none',
        // Symmetric responsive horizontal padding ensures it never collides with DesktopIcons on the left
        paddingLeft: 'clamp(20px, 8vw, 130px)',
        paddingRight: 'clamp(20px, 8vw, 130px)',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: 960,
          margin: '0 auto',
        }}
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.35 }}
          style={{
            fontSize: 'clamp(1.4rem, 3.4vw, 2.75rem)',
            fontWeight: 700,
            color: 'white',
            fontFamily: "var(--font-dancing), 'Dancing Script', cursive",
            marginBottom: 'clamp(6px, 1.4vh, 16px)',
            letterSpacing: '0.01em',
            lineHeight: 1.2,
            textShadow: '0 2px 24px rgba(0,0,0,0.45)',
            textAlign: 'center',
            width: '100%',
          }}
        >
          Welcome to my portfolio
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.5 }}
          style={{
            fontSize: 'clamp(2.5rem, 6.8vw, 5.2rem)',
            fontWeight: 700,
            letterSpacing: '-0.035em',
            lineHeight: 1.05,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.58) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textAlign: 'center',
            width: '100%',
          }}
        >
          Yug Patel
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.75 }}
          style={{
            marginTop: 'clamp(8px, 1.4vh, 16px)',
            fontSize: 'clamp(0.85rem, 1.6vw, 1.15rem)',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.42)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            textAlign: 'center',
          }}
        >
          AI &amp; ML Developer
        </motion.p>
      </div>
    </motion.div>
  )
}

export default function Home() {
  // null = not yet determined; true = show welcome; false = skip welcome
  const [showWelcome, setShowWelcome] = useState<boolean | null>(null)
  const { isMobile, isReady } = useIsDevice()

  useEffect(() => {
    if (!isReady) return          // wait until device is known

    let active = true
    const resolveWelcome = (value: boolean) => {
      queueMicrotask(() => {
        if (active) setShowWelcome(value)
      })
    }

    const currentHash = window.location.hash
    const pathname = window.location.pathname

    if (currentHash === '#portfolio' || currentHash === '#desktop' || currentHash === '#home') {
      setIntroPlayed()
      resolveWelcome(false)
      return () => { active = false }
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
      resolveWelcome(true)
      return () => { active = false }
    }

    // If introPlayed is set (first visit dismissed or coming back via nav),
    // skip the welcome screen entirely.
    resolveWelcome(!hasPlayedIntro())

    return () => { active = false }
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
        /* ─── macOS-style web desktop, powered by wmkit ─── */
        <PortfolioDesktop>
          <AnimatePresence>
            {!showWelcome && <DesktopWelcomeHero />}
          </AnimatePresence>
        </PortfolioDesktop>
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
