'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FileText } from 'lucide-react'
import MacDock from './MacDock'

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1]

// Same icons/links as DesktopIcons
const mobileIcons = [
  { label: 'Yug_Resume.pdf', href: '#',          isFile: true },
  { label: 'About Me',       href: '/about',     isFile: false },
  { label: 'Projects',       href: '/portfolio', isFile: false },
  { label: 'Contact',        href: '/contact',   isFile: false },
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
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        // below iOS status bar + pill nav
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 80px)',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 110px)',
        paddingLeft: 20,
        paddingRight: 20,
      }}
    >
      {/* Top: Folder icons starting from top-left */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '24px 12px',
          width: '100%',
        }}
      >
        {mobileIcons.map((item, i) => (
          <Link
            key={item.label}
            href={item.href}
            style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.42, ease: EASE_OUT, delay: 0.15 + i * 0.06 }}
              whileTap={{ scale: 0.86, transition: { type: 'spring', bounce: 0, duration: 0.22 } }}
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
              {/* Icon — same glass style as desktop, bigger */}
              <div
                style={{
                  width: 66,
                  height: 66,
                  borderRadius: item.isFile ? 0 : 14,
                  backgroundColor: item.isFile ? 'transparent' : 'rgba(255,255,255,0.05)',
                  border: item.isFile ? 'none' : '1px solid rgba(255,255,255,0.12)',
                  boxShadow: item.isFile ? 'none' : '0 4px 16px rgba(0,0,0,0.25)',
                  backdropFilter: item.isFile ? 'none' : 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {item.isFile ? (
                  <FileText size={48} color="white" strokeWidth={1.5} />
                ) : (
                  <img
                    src="/assets/icons/mac/folder.svg"
                    alt={item.label}
                    style={{ width: 48, height: 48, objectFit: 'contain' }}
                  />
                )}
              </div>

              {/* Label */}
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

      {/* Center: Welcome greeting centered in the screen */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
          pointerEvents: 'none',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: EASE_OUT, delay: 0.1 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <p style={{
            fontSize: 'clamp(1.6rem, 7vw, 2.6rem)',
            fontWeight: 700,
            color: 'white',
            fontFamily: "var(--font-dancing), 'Dancing Script', cursive",
            textAlign: 'center',
            marginBottom: 6,
            textShadow: '0 2px 16px rgba(0,0,0,0.45), 0 0 40px rgba(0,0,0,0.2)',
            lineHeight: 1.15,
            letterSpacing: '0.01em',
          }}>
            Welcome to my portfolio
          </p>
          <h1 style={{
            fontSize: 'clamp(2.3rem, 9.5vw, 3.4rem)',
            fontWeight: 700,
            letterSpacing: '-0.035em',
            lineHeight: 1.05,
            color: 'white',
            fontFamily: "'Inter', system-ui, sans-serif",
            textShadow: '0 2px 20px rgba(0,0,0,0.5)',
            textAlign: 'center',
          }}>
            Yug Patel
          </h1>
          <p style={{
            marginTop: 8,
            fontSize: 'clamp(0.85rem, 3.2vw, 1.05rem)',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.45)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            textAlign: 'center',
          }}>
            AI &amp; ML Developer
          </p>
        </motion.div>
      </div>

      {/* MacDock at the bottom — same as desktop */}
      <MacDock />
    </motion.div>
  )
}
