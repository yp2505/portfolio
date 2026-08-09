'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Me', href: '/about' },
  { label: 'Projects', href: '/portfolio' },
  { label: 'Contact', href: '/contact' },
]

export default function TopMenu() {
  const [time, setTime] = useState<string>('')
  const [date, setDate] = useState<string>('')
  const [isMobile, setIsMobile] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

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
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: isMobile ? 36 : 28,
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: isMobile ? '0 20px' : '0 16px',
          color: 'white',
          fontSize: isMobile ? 14 : 13,
          fontWeight: 500,
          zIndex: 100,
          boxShadow: '0 1px 0 rgba(255, 255, 255, 0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', width: isMobile ? 80 : 'auto' }} ref={menuRef}>
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
                      <Link key={link.href} href={link.href} style={{ textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>
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
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 16, textDecoration: 'none', color: 'white' }}>
              <svg viewBox="0 0 384 512" style={{ width: 14, height: 14, fill: 'currentColor', marginBottom: 2 }}>
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
              </svg>
              <span style={{ fontWeight: 600 }}>Landing Page</span>
            </Link>
          )}
        </div>

        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 12, fontWeight: isMobile ? 600 : 500 }}>
          {!isMobile && <span>{date}</span>}
          <span>{time}</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', width: isMobile ? 80 : 100, justifyContent: 'flex-end' }}>
          {isMobile ? (
            <Link href="/" style={{ textDecoration: 'none', color: 'white' }}>
              <span>yug.dev</span>
            </Link>
          ) : (
            <span>yug.dev</span>
          )}
        </div>
      </div>
    </>
  )
}
