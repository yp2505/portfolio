'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { format } from 'date-fns'
import { Menu, X, ChevronLeft, Wifi, WifiOff, Volume2, VolumeX } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { setIntroPlayed } from '@/lib/introState'
import { useControlCenter } from '@/components/control-center/useControlCenter'
import ControlCenter from '@/components/control-center/ControlCenter'
import DesktopCalendarPopover from '@/components/control-center/DesktopCalendarPopover'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Me', href: '/about' },
  { label: 'Projects', href: '/portfolio' },
  { label: 'Contact', href: '/contact' },
]

export default function TopMenu() {
  const router = useRouter()
  const pathname = usePathname()
  const [time, setTime] = useState<string>('')
  const [date, setDate] = useState<string>('')
  const [isMobile, setIsMobile] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const {
    isDesktopControlCenterOpen,
    setDesktopControlCenterOpen,
    isCalendarModalOpen,
    setCalendarModalOpen,
    isRealOnline,
    isSimulatedOffline,
    volume,
    isMuted,
  } = useControlCenter()

  const isSubPage = pathname !== '/'

  // Ensure intro is marked played when visiting subpages so returning to Home bypasses lock screen
  useEffect(() => {
    if (isSubPage) {
      setIntroPlayed()
    }
  }, [isSubPage])

  const handleGoHome = (e?: React.MouseEvent) => {
    if (e) e.preventDefault()
    setIntroPlayed()
    router.push('/')
  }

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(format(now, 'h:mm a'))
      setDate(format(now, 'EEE MMM d'))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)

    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', check)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
      <div
        data-top-menu="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: 28,
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 16px',
          color: 'white',
          fontSize: 13,
          fontWeight: 500,
          zIndex: 100,
          boxShadow: '0 1px 0 rgba(255, 255, 255, 0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', width: 'auto' }} ref={menuRef}>
          {isMobile ? (
            <div style={{ position: 'relative' }}>
              <div onClick={() => setMenuOpen(!menuOpen)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                {menuOpen ? <X size={18} color="white" /> : <Menu size={18} color="white" />}
              </div>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      position: 'absolute',
                      top: 30,
                      left: -10,
                      backgroundColor: 'rgba(20, 20, 20, 0.85)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      borderRadius: 12,
                      padding: '8px 0',
                      minWidth: 160,
                      border: '1px solid rgba(255,255,255,0.1)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    }}
                  >
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        style={{ textDecoration: 'none' }}
                        onClick={() => {
                          if (link.href === '/') setIntroPlayed()
                          setMenuOpen(false)
                        }}
                      >
                        <div
                          style={{
                            padding: '10px 20px',
                            color: 'white',
                            fontSize: 14,
                            fontWeight: 500,
                          }}
                        >
                          {link.label}
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                type="button"
                onClick={handleGoHome}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  margin: 0,
                  cursor: 'pointer',
                  color: 'white',
                  transition: 'opacity 0.15s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.8' }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
                title="Apple Menu - Go to Home"
              >
                <svg viewBox="0 0 384 512" style={{ width: 14, height: 14, fill: 'currentColor' }}>
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                </svg>
              </button>

              {isSubPage ? (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.04, backgroundColor: 'rgba(255, 255, 255, 0.16)' }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
                  onClick={handleGoHome}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '2px 9px',
                    borderRadius: 6,
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.16)',
                    color: 'white',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                    letterSpacing: '-0.01em',
                  }}
                  title="Back to Home Desktop"
                >
                  <ChevronLeft size={13} strokeWidth={2.5} style={{ marginLeft: -2 }} />
                  <span>Home</span>
                </motion.button>
              ) : (
                <button
                  type="button"
                  onClick={handleGoHome}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    margin: 0,
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                  }}
                >
                  Home
                </button>
              )}
            </div>
          )}
        </div>

        {/* Center: Calendar / Date & Time button */}
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center' }}>
          <button
            type="button"
            data-calendar-trigger="true"
            onClick={() => {
              setDesktopControlCenterOpen(false)
              setCalendarModalOpen((prev) => !prev)
            }}
            style={{
              background: isCalendarModalOpen ? 'rgba(255, 255, 255, 0.18)' : 'none',
              border: 'none',
              borderRadius: 6,
              padding: '2px 8px',
              color: 'white',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              fontFamily: "'Inter', system-ui, sans-serif",
              letterSpacing: '-0.01em',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'background-color 0.15s ease',
            }}
            title="Date & Time — Click to open Calendar & Notes"
            aria-label="Date and time - Open Calendar"
          >
            {!isMobile && <span>{date}</span>}
            <span>{time}</span>
          </button>
        </div>

        {/* Right: macOS status icons, Control Center toggle, and yug.dev */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Wi-Fi Status Tile */}
          <button
            type="button"
            data-control-center-trigger="true"
            onClick={() => setDesktopControlCenterOpen((prev) => !prev)}
            style={{
              background: 'none',
              border: 'none',
              padding: '2px 4px',
              color: isSimulatedOffline ? '#f59e0b' : 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              opacity: 0.9,
            }}
            title={isSimulatedOffline ? 'Wi-Fi: Simulated Offline' : 'Wi-Fi: Connected'}
            aria-label="Wi-Fi status"
          >
            {isSimulatedOffline || !isRealOnline ? (
              <WifiOff size={14} strokeWidth={2.2} />
            ) : (
              <Wifi size={14} strokeWidth={2.2} />
            )}
          </button>

          {/* Sound / Volume */}
          <button
            type="button"
            data-control-center-trigger="true"
            onClick={() => setDesktopControlCenterOpen((prev) => !prev)}
            style={{
              background: 'none',
              border: 'none',
              padding: '2px 4px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              opacity: 0.9,
            }}
            title={`Sound: ${isMuted || volume === 0 ? 'Muted' : `${volume}%`}`}
            aria-label="Sound volume"
          >
            {isMuted || volume === 0 ? (
              <VolumeX size={14} strokeWidth={2.2} />
            ) : (
              <Volume2 size={14} strokeWidth={2.2} />
            )}
          </button>

          {/* Control Center Toggle Button (macOS dual capsule switches) */}
          <button
            type="button"
            data-control-center-trigger="true"
            onClick={() => {
              setCalendarModalOpen(false)
              setDesktopControlCenterOpen((prev) => !prev)
            }}
            style={{
              background: isDesktopControlCenterOpen ? 'rgba(255, 255, 255, 0.22)' : 'none',
              border: 'none',
              borderRadius: 5,
              padding: '3px 5px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.15s ease',
            }}
            title="Control Center"
            aria-label="Open Control Center"
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
              <rect x="1" y="2.5" width="14" height="4.5" rx="2.25" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="5" cy="4.75" r="1.5" fill="currentColor" />
              <rect x="1" y="8.75" width="14" height="4.5" rx="2.25" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="11" cy="11" r="1.5" fill="currentColor" />
            </svg>
          </button>

          {/* Right corner: yug.dev */}
          <button
            type="button"
            onClick={handleGoHome}
            style={{
              background: 'none',
              border: 'none',
              padding: '2px 4px',
              margin: 0,
              color: 'white',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "'Inter', system-ui, sans-serif",
              letterSpacing: '-0.01em',
              opacity: 0.95,
              transition: 'opacity 0.15s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.75' }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.95' }}
            title="Go to Home Desktop"
            aria-label="Go to Home Desktop"
          >
            yug.dev
          </button>
        </div>
      </div>

      {/* macOS Desktop Control Center Panel */}
      <ControlCenter />

      {/* macOS Standalone Calendar & Notes Popover */}
      <DesktopCalendarPopover />
    </>
  )
}
