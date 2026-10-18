'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FileText } from 'lucide-react'
import { usePathname } from 'next/navigation'

interface DesktopIcon {
  label: string
  href: string
  iconUrl: string
  isFile?: boolean
  openInNewTab?: boolean
}

const desktopIcons: DesktopIcon[] = [
  { label: 'Yug_Resume.pdf', href: '/assets/Yug_Patel_Resume.md', isFile: true, openInNewTab: true, iconUrl: '/assets/icons/mac/document-pdf.svg' },
  { label: 'About Me', href: '/about', iconUrl: '/assets/icons/mac/contacts.svg' },
  { label: 'Projects', href: '/portfolio', iconUrl: '/assets/icons/mac/terminal.svg' },
  { label: 'Contact', href: '/contact', iconUrl: '/assets/icons/mac/messages.svg' },
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

        const icon = (
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
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={item.iconUrl}
                  alt={item.label}
                  style={{
                    width: isMobile ? 48 : 54,
                    height: isMobile ? 48 : 54,
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.35))',
                  }}
                />
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
        )

        return (
          <Link
            key={item.label}
            href={item.href}
            target={item.openInNewTab ? '_blank' : undefined}
            rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
            style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center' }}
          >
            {icon}
          </Link>
        )
      })}
    </div>
  )
}
