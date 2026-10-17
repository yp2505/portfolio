'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

/**
 * iOS-style top status strip — sits at the same level as the pill nav.
 * Left: yug.dev (tappable → home)
 * Right: live clock
 * The pill nav stays centered independently between them.
 */
export default function MobileStatusBar() {
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
      <Link href="/" style={{ textDecoration: 'none', pointerEvents: 'auto' }}>
        <motion.span
          whileTap={{ opacity: 0.5 }}
          style={{ ...textStyle, display: 'block', touchAction: 'manipulation' }}
        >
          yug.dev
        </motion.span>
      </Link>

      {/* Right: live clock */}
      <span style={{ ...textStyle, pointerEvents: 'none' }}>
        {timeStr}
      </span>
    </div>
  )
}
