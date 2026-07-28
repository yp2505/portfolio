'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [mounted, setMounted] = useState(false)
  const [showNavbar, setShowNavbar] = useState(false)

  useEffect(() => {
    setMounted(true)

    const handleResize = () => setIsMobile(window.innerWidth < 768)

    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
      const sections = ['home', 'about', 'portfolio', 'contact']
      for (const sectionId of sections) {
        const section = document.getElementById(sectionId)
        if (!section) continue
        const rect = section.getBoundingClientRect()
        if (rect.top <= 140 && rect.bottom >= 140) {
          setActiveSection(sectionId)
          break
        }
      }
    }

    handleResize()
    handleScroll()
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    const navbarPlayed = sessionStorage.getItem('navbarPlayed')
    if (navbarPlayed) { setShowNavbar(true); return }
    const timer = setTimeout(() => {
      setShowNavbar(true)
      sessionStorage.setItem('navbarPlayed', 'true')
    }, 3800)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) return null

  const smoothScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    const target = document.querySelector(targetId)
    if (!target) return
    const targetPosition = target.getBoundingClientRect().top + window.scrollY - 3
    const startPosition = window.scrollY
    const distance = targetPosition - startPosition
    const duration = 1200
    let startTime: number | null = null
    const ease = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    const anim = (now: number) => {
      if (startTime === null) startTime = now
      const elapsed = now - startTime
      window.scrollTo({ top: startPosition + distance * ease(Math.min(elapsed / duration, 1)) })
      if (elapsed < duration) requestAnimationFrame(anim)
    }
    requestAnimationFrame(anim)
    setOpen(false)
  }

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'About', id: 'about' },
    { label: 'Portfolio', id: 'portfolio' },
    { label: 'Contact', id: 'contact' },
  ]

  return (
    <motion.nav
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: showNavbar ? 1 : 0, y: showNavbar ? 0 : -40 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed',
        top: 20,
        left: isMobile ? 16 : 60,
        right: isMobile ? 16 : 60,
        zIndex: 50,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: isMobile ? '10px 18px' : '10px 28px',
          borderRadius: 999,
          backgroundColor: scrolled ? 'rgba(2,4,8,0.92)' : 'rgba(2,4,8,0.65)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${scrolled ? 'rgba(14,165,233,0.3)' : 'rgba(14,165,233,0.15)'}`,
          boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(14,165,233,0.08)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Logo */}
        <span
          style={{
            fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: '0.08em',
            background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          yug.dev
        </span>

        {/* Desktop Nav */}
        {!isMobile && (
          <div style={{ display: 'flex', gap: 36 }}>
            {navItems.map((item) => {
              const isActive = activeSection === item.id
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => smoothScrollTo(e, `#${item.id}`)}
                  style={{
                    position: 'relative',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13,
                    fontWeight: isActive ? 500 : 400,
                    color: isActive ? '#38bdf8' : 'rgba(232,244,255,0.5)',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    paddingBottom: 4,
                    transition: 'color 0.25s ease',
                  }}
                >
                  {item.label}
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: 1,
                      background: 'linear-gradient(90deg, #0ea5e9, #38bdf8)',
                      transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                      transformOrigin: 'left',
                      transition: 'transform 0.3s ease',
                    }}
                  />
                </a>
              )
            })}
          </div>
        )}

        {/* Mobile Hamburger */}
        {isMobile && (
          <button
            onClick={() => setOpen(!open)}
            style={{ display: 'flex', flexDirection: 'column', gap: 5, cursor: 'pointer', background: 'none', border: 'none', padding: 4 }}
            aria-label="Toggle menu"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  width: 22,
                  height: 2,
                  background: '#38bdf8',
                  borderRadius: 2,
                  display: 'block',
                  transform: open
                    ? i === 0 ? 'rotate(45deg) translate(5px, 5px)'
                      : i === 2 ? 'rotate(-45deg) translate(5px, -5px)'
                      : 'none'
                    : 'none',
                  opacity: open && i === 1 ? 0 : 1,
                  transition: 'all 0.25s ease',
                }}
              />
            ))}
          </button>
        )}
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isMobile && open && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{
              marginTop: 8,
              borderRadius: 20,
              background: 'rgba(2,4,8,0.96)',
              border: '1px solid rgba(14,165,233,0.2)',
              backdropFilter: 'blur(20px)',
              padding: '12px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {navItems.map((item) => {
              const isActive = activeSection === item.id
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => smoothScrollTo(e, `#${item.id}`)}
                  style={{
                    display: 'block',
                    padding: '10px 14px',
                    borderRadius: 12,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#38bdf8' : 'rgba(232,244,255,0.6)',
                    textDecoration: 'none',
                    background: isActive ? 'rgba(14,165,233,0.1)' : 'transparent',
                    borderLeft: isActive ? '2px solid #0ea5e9' : '2px solid transparent',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {item.label}
                </a>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}