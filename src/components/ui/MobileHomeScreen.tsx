'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FileText } from 'lucide-react'

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1]

const iosApps = [
  {
    label: 'About Me',
    href: '/about',
    icon: null,
    folderSrc: '/assets/icons/mac/folder.svg',
    bg: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)',
    isFolder: true,
  },
  {
    label: 'Projects',
    href: '/portfolio',
    icon: null,
    folderSrc: '/assets/icons/mac/folder.svg',
    bg: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
    isFolder: true,
  },
  {
    label: 'Contact',
    href: '/contact',
    icon: null,
    folderSrc: '/assets/icons/mac/folder.svg',
    bg: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
    isFolder: true,
  },
  {
    label: 'Resume',
    href: '#',
    icon: 'resume',
    folderSrc: null,
    bg: 'linear-gradient(135deg, #dc2626 0%, #f87171 100%)',
    isFolder: false,
  },
]

export default function MobileHomeScreen() {
  return (
    <motion.div
      key="mobile-home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 72px)', // below pill nav
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 20px)',
        paddingLeft: 20,
        paddingRight: 20,
      }}
    >
      {/* Welcome greeting */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.1 }}
        style={{
          marginBottom: 32,
          paddingLeft: 4,
        }}
      >
        <p style={{
          fontSize: '0.78rem',
          fontWeight: 500,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.4)',
          marginBottom: 6,
          fontFamily: "'Inter', system-ui, sans-serif",
        }}>
          Welcome to my portfolio
        </p>
        <h1 style={{
          fontSize: 'clamp(1.8rem, 7vw, 2.4rem)',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          color: 'white',
          fontFamily: "'Inter', system-ui, sans-serif",
          textShadow: '0 2px 16px rgba(0,0,0,0.4)',
        }}>
          Yug Patel
        </h1>
        <p style={{
          marginTop: 6,
          fontSize: '0.9rem',
          color: 'rgba(255,255,255,0.45)',
          fontFamily: "'Inter', system-ui, sans-serif",
          fontWeight: 400,
        }}>
          AI &amp; ML Developer
        </p>
      </motion.div>

      {/* iOS app grid — 4 columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px 8px',
        }}
      >
        {iosApps.map((app, i) => (
          <Link
            key={app.label}
            href={app.href}
            style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.45,
                ease: EASE_OUT,
                delay: 0.15 + i * 0.07,
              }}
              whileTap={{ scale: 0.88 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 7,
                cursor: 'pointer',
                touchAction: 'manipulation',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                width: '100%',
                maxWidth: 76,
              }}
            >
              {/* App icon */}
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 14, // iOS icon corner radius
                  background: app.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                {/* Shine overlay */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '50%',
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%)',
                  borderRadius: '14px 14px 0 0',
                  pointerEvents: 'none',
                }} />
                {app.isFolder ? (
                  <img
                    src={app.folderSrc!}
                    alt={app.label}
                    style={{ width: 36, height: 36, objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
                  />
                ) : (
                  <FileText size={32} color="white" strokeWidth={1.5} />
                )}
              </div>

              {/* Label */}
              <span style={{
                color: 'white',
                fontSize: 10,
                fontWeight: 500,
                fontFamily: "'Inter', system-ui, sans-serif",
                textAlign: 'center',
                textShadow: '0 1px 4px rgba(0,0,0,0.9)',
                lineHeight: 1.2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%',
                letterSpacing: '-0.01em',
              }}>
                {app.label}
              </span>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Home indicator */}
      <div style={{
        position: 'absolute',
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 134,
        height: 5,
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.25)',
      }} />
    </motion.div>
  )
}
