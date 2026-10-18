'use client'

import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useControlCenter } from './useControlCenter'
import CalendarCard from './CalendarCard'

export default function DesktopCalendarPopover() {
  const { isCalendarModalOpen, setCalendarModalOpen } = useControlCenter()
  const popoverRef = useRef<HTMLDivElement>(null)

  // Outside click & escape handler
  useEffect(() => {
    if (!isCalendarModalOpen) return

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement
      if (
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        !target.closest('[data-calendar-trigger]')
      ) {
        setCalendarModalOpen(false)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCalendarModalOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isCalendarModalOpen, setCalendarModalOpen])

  return (
    <AnimatePresence>
      {isCalendarModalOpen && (
        <motion.div
          ref={popoverRef}
          initial={{ opacity: 0, scale: 0.94, y: -6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: -6 }}
          transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
          style={{
            position: 'fixed',
            top: 34,
            right: 12,
            width: 330,
            zIndex: 1000,
            borderRadius: 20,
            backgroundColor: 'rgba(28, 28, 30, 0.82)',
            backdropFilter: 'blur(30px) saturate(190%)',
            WebkitBackdropFilter: 'blur(30px) saturate(190%)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0,0,0,0.2)',
            padding: 14,
            color: '#ffffff',
            userSelect: 'none',
          }}
        >
          <CalendarCard />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
