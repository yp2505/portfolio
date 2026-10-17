'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AIChatModal from './AIChatModal'

const navItems = [
  { 
    label: 'Home', 
    href: '/', 
    iconUrl: '/assets/icons/mac/files.svg',
  },
  { 
    label: 'About', 
    href: '/about', 
    iconUrl: '/assets/icons/mac/photos.svg',
  },
  { 
    label: 'Portfolio', 
    href: '/portfolio', 
    iconUrl: '/assets/icons/mac/safari.svg',
  },
  { 
    label: 'Ask Me', 
    href: '/contact', 
    iconUrl: '/assets/icons/mac/gemini.svg',
  },
]

export default function MacDock() {
  const pathname = usePathname()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isAiChatOpen, setIsAiChatOpen] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const dockPadding = isMobile ? '10px 14px' : '14px 18px'
  const dockGap = isMobile ? 10 : 14
  const iconSize = isMobile ? 52 : 58
  const baseRadius = isMobile ? 22 : 28
  const iconRadius = isMobile ? 12 : 16

  return (
    <div
      data-mac-dock="true"
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-end',
        gap: dockGap,
        padding: dockPadding,
        borderRadius: baseRadius,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
        // Safe area on desktop — bottom padding
        paddingBottom: `calc(${dockPadding.split(' ')[0]} + env(safe-area-inset-bottom, 0px))`,
      }}
    >
      {navItems.map((item, index) => {
        const isActive = pathname === item.href
        const isHovered = hoveredIndex === index
        const isNeighbor = hoveredIndex !== null && Math.abs(hoveredIndex - index) === 1

        let scale = 1
        let y = 0
        if (isHovered) {
          scale = isMobile ? 1.2 : 1.4
          y = isMobile ? -6 : -10
        } else if (isNeighbor) {
          scale = isMobile ? 1.1 : 1.15
          y = isMobile ? -2 : -4
        }

        return (
          <div key={item.href}>
            {item.label === 'Ask Me' ? (
              <div onClick={() => setIsAiChatOpen(!isAiChatOpen)}>
                <motion.div
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                  whileTap={{ scale: 0.9 }}
                  animate={{ scale, y }}
                  transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: iconSize,
                    height: iconSize,
                    borderRadius: iconRadius,
                    backgroundColor: 'transparent',
                    border: 'none',
                    boxShadow: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      width: iconSize,
                      height: iconSize,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <img src={item.iconUrl} alt={item.label} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                  
                  {isActive && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: isMobile ? -6 : -8,
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        backgroundColor: '#38bdf8',
                        boxShadow: '0 0 5px #38bdf8',
                      }}
                    />
                  )}

                  {!isMobile && (
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.9 }}
                          transition={{ duration: 0.15 }}
                          style={{
                            position: 'absolute',
                            top: -45,
                            padding: '6px 12px',
                            backgroundColor: 'rgba(0, 0, 0, 0.75)',
                            backdropFilter: 'blur(10px)',
                            color: 'white',
                            fontSize: 13,
                            fontWeight: 500,
                            borderRadius: 8,
                            border: '1px solid rgba(255,255,255,0.1)',
                            whiteSpace: 'nowrap',
                            pointerEvents: 'none',
                          }}
                        >
                          {item.label}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </motion.div>
              </div>
            ) : (
              <Link href={item.href} style={{ textDecoration: 'none', display: 'block' }}>
                <motion.div
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                  whileTap={{ scale: 0.9 }}
                  animate={{ scale, y }}
                  transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: iconSize,
                    height: iconSize,
                    borderRadius: iconRadius,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      width: iconSize,
                      height: iconSize,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <img src={item.iconUrl} alt={item.label} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                  
                  {isActive && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: isMobile ? -6 : -8,
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        backgroundColor: '#38bdf8',
                        boxShadow: '0 0 5px #38bdf8',
                      }}
                    />
                  )}

                  {!isMobile && (
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.9 }}
                          transition={{ duration: 0.15 }}
                          style={{
                            position: 'absolute',
                            top: -45,
                            padding: '6px 12px',
                            backgroundColor: 'rgba(0, 0, 0, 0.75)',
                            backdropFilter: 'blur(10px)',
                            color: 'white',
                            fontSize: 13,
                            fontWeight: 500,
                            borderRadius: 8,
                            border: '1px solid rgba(255,255,255,0.1)',
                            whiteSpace: 'nowrap',
                            pointerEvents: 'none',
                          }}
                        >
                          {item.label}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </motion.div>
              </Link>
            )}
          </div>
        )
      })}
      
      <AnimatePresence>
        {isAiChatOpen && <AIChatModal onClose={() => setIsAiChatOpen(false)} />}
      </AnimatePresence>
    </div>
  )
}
