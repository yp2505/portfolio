'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import WelcomeScreen from '@/components/WelcomeScreen'
import MacDock from '@/components/ui/MacDock'
import DesktopIcons from '@/components/ui/DesktopIcons'
import { hasPlayedIntro, setIntroPlayed } from '@/lib/introState'

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true)

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

  return (
    <>
      {/* Content - Empty for home page as it just shows the wallpaper and desktop UI */}
      <div style={{ position: 'fixed', inset: 0 }}>
        <DesktopIcons />
        <MacDock />
      </div>

      {/* Welcome screen */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            onAnimationStart={(definition) => {
              if (definition === 'exit') {
                // handle exit if needed
              }
            }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            style={{ position: 'fixed', inset: 0, zIndex: 9999 }}
          >
            <WelcomeScreen onUnlock={handleUnlock} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}