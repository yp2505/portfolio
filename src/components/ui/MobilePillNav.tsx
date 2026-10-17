'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AIChatModal from './AIChatModal'
import { useHomeTheme } from '@/lib/themeContext'
import { setIntroPlayed } from '@/lib/introState'

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

// Moon icon for dark mode
const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17">
    <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
  </svg>
)

// Sun icon for light mode
const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17">
    <path d="M12 17a5 5 0 100-10 5 5 0 000 10zm0-13a1 1 0 011 1v1a1 1 0 01-2 0V5a1 1 0 011-1zm0 16a1 1 0 011 1v1a1 1 0 01-2 0v-1a1 1 0 011-1zM4.22 5.64a1 1 0 011.42 0l.7.7a1 1 0 01-1.41 1.42l-.71-.71a1 1 0 010-1.41zm12.02 12.02a1 1 0 011.41 0l.71.71a1 1 0 01-1.41 1.41l-.71-.71a1 1 0 010-1.41zM4 12a1 1 0 010-2h1a1 1 0 010 2H4zm16 0a1 1 0 010-2h1a1 1 0 010 2h-1zM5.64 18.36a1 1 0 010-1.41l.7-.71a1 1 0 111.42 1.42l-.71.71a1 1 0 01-1.41 0zM17.66 6.34a1 1 0 010-1.41l.71-.71a1 1 0 111.41 1.41l-.71.71a1 1 0 01-1.41 0z" />
  </svg>
)

export default function MobilePillNav() {
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isAiChatOpen, setIsAiChatOpen] = useState(false)
  const pillRef = useRef<HTMLDivElement>(null)
  const { homeTheme, toggleHomeTheme } = useHomeTheme()

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
      {/* Pill — centered at top */}
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
            justifyContent: 'center',
            overflow: 'hidden',
            cursor: 'pointer',
            backgroundColor: 'rgba(18, 18, 22, 0.88)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.13)',
            boxShadow: '0 2px 20px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.12)',
            borderRadius: 999,
            userSelect: 'none',
            WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none',
            touchAction: 'manipulation',
          }}
          initial={false}
          animate={{
            width: isExpanded ? 300 : 150,
            height: isExpanded ? 52 : 36,
          }}
          transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
        >
          <AnimatePresence mode="wait">
            {!isExpanded ? (
              // Collapsed: dot + page name + chevron + dark mode toggle
              <motion.div
                key="collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: EASE_OUT }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 14, paddingRight: 10, whiteSpace: 'nowrap', width: '100%' }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Left: page indicator */}
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, cursor: 'pointer' }}
                  onClick={() => setIsExpanded(true)}
                >
                  <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#38bdf8', boxShadow: '0 0 6px #38bdf8', flexShrink: 0 }} />
                  <span style={{ color: 'rgba(255,255,255,0.92)', fontSize: 13, fontWeight: 600, fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: '-0.01em' }}>
                    {activeItem?.label ?? 'Menu'}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.35)', lineHeight: 1, fontSize: 11 }}>▾</span>
                </div>

                {/* Right: dark mode toggle */}
                <motion.button
                  whileTap={{ scale: 0.82 }}
                  transition={{ type: 'spring', bounce: 0, duration: 0.22 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleHomeTheme()
                  }}
                  style={{
                    background: homeTheme === 'dark' ? 'rgba(56,189,248,0.18)' : 'rgba(255,255,255,0.1)',
                    border: homeTheme === 'dark' ? '1px solid rgba(56,189,248,0.35)' : '1px solid rgba(255,255,255,0.18)',
                    borderRadius: 999,
                    width: 28,
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                    color: homeTheme === 'dark' ? '#38bdf8' : 'rgba(255,255,255,0.7)',
                    touchAction: 'manipulation',
                    padding: 0,
                  }}
                  aria-label="Toggle dark wallpaper"
                >
                  {homeTheme === 'dark' ? <SunIcon /> : <MoonIcon />}
                </motion.button>
              </motion.div>
            ) : (
              // Expanded: nav items
              <motion.div
                key="expanded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: EASE_OUT }}
                style={{ display: 'flex', alignItems: 'center', padding: '0 6px', width: '100%', justifyContent: 'space-around' }}
                onClick={(e) => e.stopPropagation()}
              >
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => {
                        setIsExpanded(false)
                        // If navigating to home, mark intro as played so WelcomeScreen is skipped
                        if (item.href === '/') setIntroPlayed()
                      }}
                      style={{ textDecoration: 'none' }}
                    >
                      <motion.div
                        whileTap={{ scale: 0.88 }}
                        transition={{ type: 'spring', bounce: 0, duration: 0.25 }}
                        style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                          padding: '6px 10px', borderRadius: 10, cursor: 'pointer',
                          touchAction: 'manipulation', userSelect: 'none', WebkitUserSelect: 'none',
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
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '6px 10px', borderRadius: 10, cursor: 'pointer', touchAction: 'manipulation', userSelect: 'none', WebkitUserSelect: 'none', color: 'rgba(255,255,255,0.55)' }}
                >
                  <img src="/assets/icons/mac/gemini.svg" alt="Ask AI" style={{ width: 20, height: 20, objectFit: 'contain' }} />
                  <span style={{ fontSize: 9, fontWeight: 600, fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: '0.03em', lineHeight: 1 }}>Ask AI</span>
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
