'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FileText } from 'lucide-react'
import MacDock from './MacDock'

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1]

// Same icons/links as DesktopIcons
const mobileIcons = [
  { label: 'Yug_Resume.pdf', href: '#', isFile: true },
  { label: 'About Me',        href: '/about',    isFile: false },
  { label: 'Projects',        href: '/portfolio', isFile: false },
  { label: 'Contact',         href: '/contact',  isFile: false },
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
        // Leave room for pill nav at top + safe area
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 68px)',
        // Leave room for MacDock + safe area at bottom
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 100px)',
        paddingLeft: 20,
        paddingRight: 20,
      }}
    >
      {/* Welcome greeting — same style as desktop hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.1 }}
        style={{ marginBottom: 28, paddingLeft: 4 }}
      >
        <p style={{
          fontSize: '0.75rem',
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
      </motion.div>

      {/* Desktop-identical icon grid — 4 columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px 10px',
        }}
      >
        {mobileIcons.map((item, i) => (
          <Link
            key={item.label}
            href={item.href}
            style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.18 + i * 0.07 }}
              whileTap={{ scale: 0.88, transition: { type: 'spring', bounce: 0, duration: 0.25 } }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                cursor: 'pointer',
                touchAction: 'manipulation',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                width: '100%',
                maxWidth: 76,
              }}
            >
              {/* Icon container — same glass style as DesktopIcons */}
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: item.isFile ? 0 : 12,
                  backgroundColor: item.isFile ? 'transparent' : 'rgba(255,255,255,0.05)',
                  border: item.isFile ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  boxShadow: item.isFile ? 'none' : '0 4px 12px rgba(0,0,0,0.2)',
                  backdropFilter: item.isFile ? 'none' : 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {item.isFile ? (
                  <FileText size={40} color="white" strokeWidth={1.5} />
                ) : (
                  <img
                    src="/assets/icons/mac/folder.svg"
                    alt={item.label}
                    style={{ width: 40, height: 40, objectFit: 'contain' }}
                  />
                )}
              </div>

              {/* Label — same style as DesktopIcons */}
              <span style={{
                color: 'white',
                fontSize: 10,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                textAlign: 'center',
                textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%',
                letterSpacing: '-0.01em',
              }}>
                {item.label}
              </span>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Same MacDock as desktop — positioned at bottom */}
      <MacDock />
    </motion.div>
  )
}
