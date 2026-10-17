'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AIChatModal from './AIChatModal'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

const navItems = [
  {
    label: 'Home',
    href: '/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    ),
  },
  {
    label: 'About',
    href: '/about',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
      </svg>
    ),
  },
  {
    label: 'Projects',
    href: '/portfolio',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M3 7h18a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V8a1 1 0 011-1zm2.5 2a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM5 14h14v4H5z"/>
      </svg>
    ),
  },
  {
    label: 'Contact',
    href: '/contact',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
      </svg>
    ),
  },
]

export default function MobilePillNav() {
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isAiChatOpen, setIsAiChatOpen] = useState(false)
  const [timeStr, setTimeStr] = useState('')
  const pillRef = useRef<HTMLDivElement>(null)

  // Live clock
  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTimeStr(now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }))
    }
    update()
    const t = setInterval(update, 1000)
    return () => clearInterval(t)
  }, [])

  // Close on outside tap
  useEffect(() => {
    if (!isExpanded) return
    const handleTap = (e: TouchEvent | MouseEvent) => {
      if (pillRef.current && !pillRef.current.contains(e.target as Node)) {
        setIsExpanded(false)
      }
    }
    document.addEventListener('touchstart', handleTap)
    document.addEventListener('mousedown', handleTap)
    return () => {
      document.removeEventListener('touchstart', handleTap)
      document.removeEventListener('mousedown', handleTap)
    }
  }, [isExpanded])

  const activeItem = navItems.find((n) => n.href === pathname)

  return (
    <>
      <div
        ref={pillRef}
        style={{
          position: 'fixed',
          top: 14,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 200,
        }}
      >
        <motion.div
          layout
          onClick={() => setIsExpanded((v) => !v)}
          style={{
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            cursor: 'pointer',
            backgroundColor: 'rgba(18, 18, 22, 0.88)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.13)',
            boxShadow: '0 2px 20px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255,255,255,0.12)',
            borderRadius: 999,
            userSelect: 'none',
            WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none',
            touchAction: 'manipulation',
          }}
          initial={false}
          animate={{
            width: isExpanded ? 280 : 230,
            height: isExpanded ? 52 : 38,
          }}
          transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
        >
          <AnimatePresence mode="wait">
            {!isExpanded ? (
              // ── Collapsed: yug.dev | • PageName | time ──
              <motion.div
                key="collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: EASE_OUT }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  paddingLeft: 14,
                  paddingRight: 14,
                  gap: 0,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Left: yug.dev → homepage */}
                <Link
                  href="/"
                  style={{ textDecoration: 'none' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <motion.span
                    whileTap={{ opacity: 0.6 }}
                    style={{
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: 12,
                      fontWeight: 600,
                      fontFamily: "'Inter', system-ui, sans-serif",
                      letterSpacing: '-0.01em',
                      touchAction: 'manipulation',
                    }}
                  >
                    yug.dev
                  </motion.span>
                </Link>

                {/* Center: dot + page name + chevron (tappable to expand) */}
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
                  onClick={(e) => { e.stopPropagation(); setIsExpanded(true) }}
                >
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      backgroundColor: '#38bdf8',
                      boxShadow: '0 0 6px #38bdf8',
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      color: 'rgba(255,255,255,0.92)',
                      fontSize: 13,
                      fontWeight: 600,
                      fontFamily: "'Inter', system-ui, sans-serif",
                      letterSpacing: '-0.01em',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {activeItem?.label ?? 'Menu'}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10 }}>▾</span>
                </div>

                {/* Right: live clock */}
                <span
                  style={{
                    color: 'rgba(255,255,255,0.55)',
                    fontSize: 12,
                    fontWeight: 500,
                    fontFamily: "'Inter', system-ui, sans-serif",
                    letterSpacing: '-0.01em',
                    whiteSpace: 'nowrap',
                    fontFeatureSettings: '"tnum"',
                  }}
                >
                  {timeStr}
                </span>
              </motion.div>
            ) : (
              // ── Expanded: nav items ──
              <motion.div
                key="expanded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: EASE_OUT }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 6px',
                  width: '100%',
                  justifyContent: 'space-around',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsExpanded(false)}
                      style={{ textDecoration: 'none' }}
                    >
                      <motion.div
                        whileTap={{ scale: 0.88 }}
                        transition={{ type: 'spring', bounce: 0, duration: 0.25 }}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 2,
                          padding: '6px 10px',
                          borderRadius: 10,
                          cursor: 'pointer',
                          touchAction: 'manipulation',
                          userSelect: 'none',
                          WebkitUserSelect: 'none',
                          color: isActive ? '#38bdf8' : 'rgba(255,255,255,0.55)',
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                        <span style={{ fontSize: 9, fontWeight: 600, fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: '0.03em', lineHeight: 1 }}>
                          {item.label}
                        </span>
                        {isActive && (
                          <motion.div
                            layoutId="mobile-pill-dot"
                            style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#38bdf8' }}
                            transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                          />
                        )}
                      </motion.div>
                    </Link>
                  )
                })}

                {/* AI chat */}
                <motion.div
                  whileTap={{ scale: 0.88 }}
                  transition={{ type: 'spring', bounce: 0, duration: 0.25 }}
                  onClick={() => { setIsExpanded(false); setIsAiChatOpen(true) }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    padding: '6px 10px',
                    borderRadius: 10,
                    cursor: 'pointer',
                    touchAction: 'manipulation',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    color: 'rgba(255,255,255,0.55)',
                  }}
                >
                  <img src="/assets/icons/mac/gemini.svg" alt="Ask AI" style={{ width: 20, height: 20, objectFit: 'contain' }} />
                  <span style={{ fontSize: 9, fontWeight: 600, fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: '0.03em', lineHeight: 1 }}>
                    Ask AI
                  </span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {isAiChatOpen && <AIChatModal onClose={() => setIsAiChatOpen(false)} />}
      </AnimatePresence>
    </>
  )
}
