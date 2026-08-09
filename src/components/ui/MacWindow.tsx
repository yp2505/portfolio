'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'

interface MacWindowProps {
  children: ReactNode
  title: string
}

export default function MacWindow({ children, title }: MacWindowProps) {
  const router = useRouter()

  const handleClose = () => {
    router.push('/')
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      style={{
        position: 'absolute',
        top: '8%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '85%',
        maxWidth: 1100,
        height: '75vh',
        backgroundColor: 'rgba(5, 10, 18, 0.85)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        borderRadius: 16,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.05)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 50,
      }}
    >
      {/* Mac Window Title Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        {/* Controls */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={handleClose}
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: '#ff5f56',
              border: '1px solid #e0443e',
              cursor: 'pointer',
              padding: 0,
            }}
            aria-label="Close"
          />
          <button
            onClick={handleClose}
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: '#ffbd2e',
              border: '1px solid #dea123',
              cursor: 'pointer',
              padding: 0,
            }}
            aria-label="Minimize"
          />
          <button
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: '#27c93f',
              border: '1px solid #1aab29',
              cursor: 'pointer',
              padding: 0,
            }}
            aria-label="Maximize"
          />
        </div>

        {/* Title */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 13,
            fontWeight: 500,
            fontFamily: "'Inter', sans-serif",
            color: 'rgba(255, 255, 255, 0.7)',
          }}
        >
          {title}
        </div>

        {/* Placeholder for balance */}
        <div style={{ width: 52 }} />
      </div>

      {/* Content Area */}
      <div
        className="custom-scroll"
        style={{
          flex: 1,
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        {children}
      </div>
    </motion.div>
  )
}
