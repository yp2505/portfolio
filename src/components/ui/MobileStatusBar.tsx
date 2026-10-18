'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { setIntroPlayed } from '@/lib/introState'
import { useControlCenter } from '@/components/control-center/useControlCenter'

/**
 * iOS-style top status strip — sits at the same level as the pill nav.
 * Left: yug.dev (tappable → home)
 * Right: live clock (tappable → opens iOS Control Center)
 * The pill nav stays centered independently between them.
 */
export default function MobileStatusBar() {
  const { setMobileControlCenterOpen } = useControlCenter()
  const [timeStr, setTimeStr] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTimeStr(now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }))
    }
    update()
    const t = setInterval(update, 1000)
    return () => clearInterval(t)
  }, [])

  const textStyle: React.CSSProperties = {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    fontWeight: 600,
    fontFamily: "'Inter', system-ui, sans-serif",
    letterSpacing: '-0.01em',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    fontFeatureSettings: '"tnum"',
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 'calc(env(safe-area-inset-top, 0px) + 64px)',
        zIndex: 199,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 14,
        pointerEvents: 'none', // don't block taps on pill
      }}
    >
      {/* Left: yug.dev → home */}
      <Link
        href="/"
        style={{ textDecoration: 'none', pointerEvents: 'auto' }}
        onClick={() => setIntroPlayed()}
      >
        <motion.span
          whileTap={{ opacity: 0.5 }}
          style={{ ...textStyle, display: 'block', touchAction: 'manipulation' }}
        >
          yug.dev
        </motion.span>
      </Link>

      {/* Right: live clock - opens iOS Control Center */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.9, opacity: 0.6 }}
        onClick={() => setMobileControlCenterOpen(true)}
        style={{
          ...textStyle,
          background: 'none',
          border: 'none',
          padding: '4px 6px',
          margin: '-4px -6px',
          cursor: 'pointer',
          pointerEvents: 'auto',
          touchAction: 'manipulation',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
        title="Open Control Center (or swipe down from top-right)"
        aria-label="Open Control Center"
      >
        <span>{timeStr}</span>
      </motion.button>
    </div>
  )
}
