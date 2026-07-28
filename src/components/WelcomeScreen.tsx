'use client'

import { motion } from 'framer-motion'
import { Database, Brain, BarChart3 } from 'lucide-react'

export default function WelcomeScreen() {
  const icons = [Brain, Database, BarChart3]

  return (
    <div
      style={{
        width: '100%', height: '100vh',
        background: '#020408',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'fixed', inset: 0, zIndex: 9999, overflow: 'hidden', padding: '20px',
      }}
    >
      {/* Radial glow */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(14,165,233,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          textAlign: 'center', color: 'white',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px',
          width: '100%', maxWidth: '360px', position: 'relative', zIndex: 1,
        }}
      >
        {/* Animated icons */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.3 } } }}
          style={{ display: 'flex', gap: '14px', alignItems: 'center', justifyContent: 'center' }}
        >
          {icons.map((Icon, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, scale: 0.3, rotate: -120, y: 60 },
                visible: { opacity: 1, scale: 1, rotate: 0, y: 0 },
              }}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
              animate={{ y: [0, -6, 0] }}
              style={{
                width: 44, height: 44, borderRadius: '50%',
                border: '1px solid rgba(14,165,233,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(14,165,233,0.06)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 0 20px rgba(14,165,233,0.15)',
              }}
            >
              <Icon size={18} color="#38bdf8" />
            </motion.div>
          ))}
        </motion.div>

        {/* Text */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <motion.span
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 800, letterSpacing: '-0.04em', fontFamily: "'Inter', sans-serif" }}
            >
              Welcome
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: -80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 800, letterSpacing: '-0.04em', fontFamily: "'Inter', sans-serif", color: 'rgba(232,244,255,0.4)' }}
            >
              to my
            </motion.span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 800, letterSpacing: '-0.04em',
              margin: 0, textAlign: 'center',
              background: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 50%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Portfolio
          </motion.h1>
        </div>

        {/* Name capsule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            padding: '6px 18px', borderRadius: '999px',
            border: '1px solid rgba(14,165,233,0.3)',
            background: 'rgba(14,165,233,0.07)',
            backdropFilter: 'blur(10px)',
            fontSize: '13px', letterSpacing: '0.08em',
            color: 'rgba(56,189,248,0.85)',
            fontFamily: "'Inter', sans-serif", fontWeight: 500,
          }}
        >
          Yug Patel
        </motion.div>
      </motion.div>
    </div>
  )
}