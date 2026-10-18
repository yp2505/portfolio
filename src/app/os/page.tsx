'use client'

// src/app/os/page.tsx
// ─────────────────────────────────────────────────────────────
// Route: /os
// Renders the full OS.js web desktop experience, embedded
// inside the existing MacWindow chrome. The toolbar exposes
// quick-launch buttons that use the postMessage bridge to
// control the OS.js runtime inside the iframe.
// ─────────────────────────────────────────────────────────────

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MacWindow from '@/components/ui/MacWindow'
import OsFrame, { isOsFrameConfigured, type OsFrameHandle } from '@/components/OsFrame'

// Easing curve matching the rest of the portfolio
const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1]

// ── Quick-launch button definitions ──────────────────────────
const QUICK_ACTIONS = [
  { label: '👋 About',    tab: 'about'    as const },
  { label: '📁 Projects', tab: 'projects' as const },
  { label: '🖼 Gallery',  tab: 'images'   as const },
]

export default function OsPage() {
  const osRef  = useRef<OsFrameHandle>(null)
  const [ready, setReady]   = useState(false)
  const [activeTab, setActiveTab] = useState<string>('about')

  const handleTabClick = (tab: 'about' | 'projects' | 'images') => {
    setActiveTab(tab)
    // switchTab sends a postMessage to the running OS.js iframe
    osRef.current?.switchTab(tab)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.55, ease: EASE_OUT }}
      style={{ position: 'fixed', inset: 0 }}
    >
      <MacWindow title="Portfolio OS — Yug Patel">

        {/* ── Toolbar: quick-launch controls ─────────────────── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          background: 'rgba(255,255,255,0.02)',
          flexShrink: 0,
        }}>

          {/* Boot indicator */}
          <AnimatePresence mode="wait">
            {!ready ? (
              <motion.div
                key="booting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  fontSize: 12, color: 'rgba(255,255,255,0.4)',
                  fontFamily: 'var(--font-jetbrains-mono)',
                }}
              >
                {/* Pulsing boot dot */}
                <motion.div
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                  style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b' }}
                />
                Booting Portfolio OS…
              </motion.div>
            ) : (
              <motion.div
                key="controls"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: EASE_OUT }}
                style={{ display: 'flex', gap: 6 }}
              >
                {QUICK_ACTIONS.map(({ label, tab }) => (
                  <button
                    key={tab}
                    id={`os-tab-${tab}`}
                    onClick={() => handleTabClick(tab)}
                    style={{
                      padding: '4px 14px',
                      borderRadius: 20,
                      border: `1px solid ${activeTab === tab ? 'transparent' : 'rgba(255,255,255,0.1)'}`,
                      background: activeTab === tab
                        ? '#0ea5e9'
                        : 'rgba(255,255,255,0.05)',
                      color: activeTab === tab ? '#fff' : 'rgba(255,255,255,0.6)',
                      cursor: 'pointer',
                      fontSize: 12,
                      fontWeight: 500,
                      fontFamily: 'var(--font-inter)',
                      transition: 'all 0.15s ease-out',
                    }}
                  >
                    {label}
                  </button>
                ))}

                {/* Divider */}
                <div style={{ width: 1, background: 'rgba(255,255,255,0.08)', margin: '0 4px' }} />

                {/* Terminal launcher — opens the built-in OS.js terminal */}
                <button
                  id="os-launch-terminal"
                  onClick={() => osRef.current?.launchApp('osjs-terminal-application')}
                  style={{
                    padding: '4px 14px',
                    borderRadius: 20,
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'rgba(255,255,255,0.6)',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 500,
                    fontFamily: 'var(--font-jetbrains-mono)',
                    transition: 'all 0.15s ease-out',
                  }}
                >
                  $ Terminal
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Live indicator badge */}
          {ready && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1, ease: EASE_OUT }}
              style={{
                marginLeft: 'auto',
                display: 'flex', alignItems: 'center', gap: 5,
                fontSize: 11,
                color: 'rgba(255,255,255,0.35)',
                fontFamily: 'var(--font-jetbrains-mono)',
              }}
            >
              <div style={{
                width: 5, height: 5, borderRadius: '50%', background: '#22c55e',
                boxShadow: '0 0 6px #22c55e',
              }} />
              OS Live
            </motion.div>
          )}
        </div>

        {/* ── OS.js iframe — fills the MacWindow content area ── */}
        {isOsFrameConfigured ? (
          <OsFrame
            ref={osRef}
            onReady={() => {
              setReady(true)
              // Auto-focus the Portfolio Viewer once booted
              setTimeout(() => osRef.current?.focusWindow(), 300)
            }}
            style={{
              // Fill remaining height after the toolbar
              height: 'calc(100% - 45px)',
              borderRadius: '0 0 16px 16px',
            }}
          />
        ) : (
          <div
            role="status"
            style={{
              display: 'grid',
              placeItems: 'center',
              height: 'calc(100% - 45px)',
              padding: 24,
              textAlign: 'center',
              color: 'rgba(255,255,255,0.6)',
              fontFamily: 'var(--font-inter)',
            }}
          >
            <div>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.88)' }}>
                Portfolio OS is unavailable right now.
              </p>
              <p style={{ margin: '8px 0 0', fontSize: 13, lineHeight: 1.5 }}>
                Please return shortly.
              </p>
            </div>
          </div>
        )}

      </MacWindow>
    </motion.div>
  )
}
