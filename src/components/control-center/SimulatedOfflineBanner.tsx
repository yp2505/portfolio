'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WifiOff } from 'lucide-react'
import { useControlCenter } from './useControlCenter'

export default function SimulatedOfflineBanner() {
  const { isSimulatedOffline, toggleSimulatedOffline } = useControlCenter()

  return (
    <AnimatePresence>
      {isSimulatedOffline && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            top: 36,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 99980,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '6px 14px',
            borderRadius: 999,
            backgroundColor: 'rgba(255, 159, 10, 0.92)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
            color: '#1c1c1e',
            fontSize: 12,
            fontWeight: 600,
            pointerEvents: 'auto',
          }}
        >
          <WifiOff size={14} strokeWidth={2.5} />
          <span>Offline (Simulated for this portfolio)</span>
          <button
            type="button"
            onClick={toggleSimulatedOffline}
            style={{
              background: 'rgba(0, 0, 0, 0.15)',
              border: 'none',
              borderRadius: 999,
              padding: '2px 8px',
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
              color: '#1c1c1e',
            }}
          >
            Re-enable
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
