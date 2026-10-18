'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FileText } from 'lucide-react'
import { usePathname } from 'next/navigation'

const desktopIcons = [
  { label: 'Yug_Resume.pdf', href: '#', isFile: true },
  { label: 'About Me', href: '/about' },
  { label: 'Projects', href: '/portfolio' },
  { label: 'Portfolio OS', href: '/os', isOS: true },  // ← OS.js desktop
  { label: 'Contact', href: '/contact' },
]

export default function DesktopIcons() {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <div
      data-desktop-icons="true"
      style={isMobile ? {
        position: 'absolute',
        top: 80, // slightly lower to clear status bar
        left: 0,
        right: 0,
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '24px 10px',
        padding: '0 16px',
        zIndex: 10,
      } : {
        position: 'absolute',
        top: 40,
        left: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        zIndex: 10,
      }}
    >
      {desktopIcons.map((item) => {
        const isFolder = !item.isFile

        return (
          <Link key={item.label} href={item.href} style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center' }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                width: isMobile ? '100%' : 80,
                maxWidth: 80,
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: isMobile ? 54 : 60,
                  height: isMobile ? 54 : 60,
                  backgroundColor: isFolder ? 'rgba(255,255,255,0.05)' : 'transparent',
                  borderRadius: isFolder ? (isMobile ? 14 : 12) : 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: isFolder ? '1px solid rgba(255,255,255,0.1)' : 'none',
                  boxShadow: isFolder ? '0 4px 12px rgba(0,0,0,0.2)' : 'none',
                  backdropFilter: isFolder ? 'blur(10px)' : 'none',
                }}
              >
                {isFolder ? (
                  <img src="/assets/icons/mac/folder.svg" alt={item.label} style={{ width: isMobile ? 40 : 44, height: isMobile ? 40 : 44, objectFit: 'contain' }} />
                ) : (
                  <FileText size={isMobile ? 38 : 42} color="white" strokeWidth={1.5} />
                )}
              </div>
              <span
                style={{
                  color: 'white',
                  fontSize: 11,
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  textAlign: 'center',
                  textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                  backgroundColor: pathname === item.href ? 'rgba(14,165,233,0.5)' : 'transparent',
                  padding: '2px 4px',
                  borderRadius: 4,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%',
                }}
              >
                {item.label}
              </span>
            </motion.div>
          </Link>
        )
      })}
    </div>
  )
}
