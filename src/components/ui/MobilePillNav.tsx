'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AIChatModal from './AIChatModal'

// Apple ease-out curve from animate skill
const EASE_OUT = [0.23, 1, 0.32, 1] as const
const EASE_DRAWER = [0.32, 0.72, 0, 1] as const

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
        <path d="M20 6h-2.18c.07-.44.18-.88.18-1.33C18 2.99 16.01 1 13.67 1c-1.18 0-2.29.5-3.09 1.3L9 3.88 7.42 2.3C6.62 1.5 5.51 1 4.33 1 2 1 0 2.99 0 5.33c0 .45.11.89.18 1.33H0c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z" />
        <path d="M20 6H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L11 17.17l7.59-7.59L20 11l-9 9z" fill="none"/>
        <path d="M2 8h20v11H2z" opacity="0"/>
        <rect x="2" y="7" width="20" height="14" rx="1" fill="none"/>
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

interface MobilePillNavProps {
  onAiChatOpen?: () => void
}

export default function MobilePillNav({ onAiChatOpen }: MobilePillNavProps) {
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isAiChatOpen, setIsAiChatOpen] = useState(false)
  const pillRef = useRef<HTMLDivElement>(null)

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
      {/* Pill nav — mobile only via CSS */}
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
          layoutRoot
          onClick={() => setIsExpanded((v) => !v)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            cursor: 'pointer',
            // Apple glassmorphism
            backgroundColor: 'rgba(18, 18, 22, 0.82)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.13)',
            boxShadow:
              '0 2px 20px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255,255,255,0.12)',
            // Pill shape
            borderRadius: 999,
            // no user-select on control
            userSelect: 'none',
            WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none',
            touchAction: 'manipulation',
          }}
          initial={false}
          animate={{
            width: isExpanded ? 260 : 130,
            height: isExpanded ? 52 : 36,
          }}
          transition={{
            type: 'spring',
            bounce: 0,       // critically damped — Apple default
            duration: 0.4,   // response 0.4s
          }}
        >
          <AnimatePresence mode="wait">
            {!isExpanded ? (
              // Collapsed: show current page name + dot
              <motion.div
                key="collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: EASE_OUT }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  paddingLeft: 14,
                  paddingRight: 14,
                  whiteSpace: 'nowrap',
                }}
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
                  }}
                >
                  {activeItem?.label ?? 'Menu'}
                </span>
                {/* chevron */}
                <motion.span
                  animate={{ rotate: 0 }}
                  style={{ color: 'rgba(255,255,255,0.4)', lineHeight: 1, fontSize: 11 }}
                >
                  ▾
                </motion.span>
              </motion.div>
            ) : (
              // Expanded: show nav items inline
              <motion.div
                key="expanded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: EASE_OUT }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0,
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
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                          {item.icon}
                        </span>
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 600,
                            fontFamily: "'Inter', system-ui, sans-serif",
                            letterSpacing: '0.03em',
                            lineHeight: 1,
                          }}
                        >
                          {item.label}
                        </span>
                        {isActive && (
                          <motion.div
                            layoutId="mobile-pill-dot"
                            style={{
                              width: 4,
                              height: 4,
                              borderRadius: '50%',
                              backgroundColor: '#38bdf8',
                            }}
                            transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                          />
                        )}
                      </motion.div>
                    </Link>
                  )
                })}

                {/* AI chat button */}
                <motion.div
                  whileTap={{ scale: 0.88 }}
                  transition={{ type: 'spring', bounce: 0, duration: 0.25 }}
                  onClick={() => {
                    setIsExpanded(false)
                    setIsAiChatOpen(true)
                  }}
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
                  <img
                    src="/assets/icons/mac/gemini.svg"
                    alt="Ask AI"
                    style={{ width: 20, height: 20, objectFit: 'contain' }}
                  />
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 600,
                      fontFamily: "'Inter', system-ui, sans-serif",
                      letterSpacing: '0.03em',
                      lineHeight: 1,
                    }}
                  >
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
