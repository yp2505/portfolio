'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1]

export default function MobileBackButton() {
  const pathname = usePathname()
  const router = useRouter()
  const isSubPage = pathname !== '/'

  return (
    <AnimatePresence>
      {isSubPage && (
        <motion.button
          key="back-btn"
          initial={{ opacity: 0, scale: 0.8, x: -10 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.8, x: -10 }}
          transition={{ type: 'spring', bounce: 0, duration: 0.35, delay: 0.1 }}
          whileTap={{ scale: 0.88, transition: { type: 'spring', bounce: 0, duration: 0.2 } }}
          onClick={() => router.push('/')}
          style={{
            position: 'fixed',
            top: 'calc(env(safe-area-inset-top, 0px) + 70px)',
            left: 16,
            zIndex: 190,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 14px',
            borderRadius: 999,
            backgroundColor: 'rgba(18, 18, 22, 0.82)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.13)',
            boxShadow: '0 2px 16px rgba(0,0,0,0.45)',
            cursor: 'pointer',
            touchAction: 'manipulation',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            // reset button defaults
            outline: 'none',
            appearance: 'none',
          }}
          aria-label="Back to home"
        >
          {/* iOS-style back chevron */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            width={16}
            height={16}
            style={{ opacity: 0.9 }}
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          <span style={{
            color: 'rgba(255,255,255,0.88)',
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "'Inter', system-ui, sans-serif",
            letterSpacing: '-0.01em',
          }}>
            Home
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
