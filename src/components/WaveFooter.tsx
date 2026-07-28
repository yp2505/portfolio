'use client'

import { motion } from 'framer-motion'
import { FaGithub, FaLinkedinIn, FaTwitter } from 'react-icons/fa'
import { ArrowUp } from 'lucide-react'

export default function WaveFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer style={{ position: 'relative', width: '100%', overflow: 'hidden', background: '#020408' }}>
      {/* Main Footer Content */}
      <div
        style={{
          background: 'linear-gradient(180deg, rgba(8,15,26,0.95) 0%, #020408 100%)',
          borderTop: '1px solid rgba(14,165,233,0.2)',
          padding: '48px 24px 32px',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
            textAlign: 'center',
          }}
        >
          {/* Top Row: Name & Subtitle */}
          <div>
            <h2
              style={{
                fontSize: 24,
                fontWeight: 800,
                letterSpacing: '-0.02em',
                fontFamily: "'Inter', sans-serif",
                background: 'linear-gradient(135deg, #e8f4ff, #38bdf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: 6,
              }}
            >
              Yug Patel
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: "'Inter', sans-serif" }}>
              ML &amp; Data Engineer • Building Intelligent Systems
            </p>
          </div>

          {/* Social Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <motion.a
              href="https://github.com/yp2505/Groit-AI"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }}
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: '1px solid rgba(14,165,233,0.25)',
                background: 'rgba(14,165,233,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8',
                textDecoration: 'none',
              }}
            >
              <FaGithub size={17} />
            </motion.a>

            <motion.a
              href="https://www.linkedin.com/in/yug-patel-35b01b328?utm_source=share_via&utm_content=profile&utm_medium=member_android"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }}
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: '1px solid rgba(14,165,233,0.25)',
                background: 'rgba(14,165,233,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8',
                textDecoration: 'none',
              }}
            >
              <FaLinkedinIn size={17} />
            </motion.a>

            <motion.a
              href="https://x.com/patel_yug1485"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }}
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: '1px solid rgba(14,165,233,0.25)',
                background: 'rgba(14,165,233,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8',
                textDecoration: 'none',
              }}
            >
              <FaTwitter size={17} />
            </motion.a>
          </div>

          {/* Scroll to Top */}
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '9px 20px',
              borderRadius: 999,
              border: '1px solid rgba(14,165,233,0.25)',
              background: 'rgba(14,165,233,0.06)',
              color: '#38bdf8',
              fontSize: 12,
              fontFamily: 'var(--font-mono), monospace',
              cursor: 'pointer',
            }}
          >
            <ArrowUp size={14} />
            Back to Top
          </motion.button>

          {/* Bottom Divider & Copyright */}
          <div
            style={{
              width: '100%',
              maxWidth: 600,
              borderTop: '1px solid rgba(14,165,233,0.1)',
              paddingTop: 20,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: "var(--font-mono), monospace" }}>
              © {new Date().getFullYear()} Yug Patel. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Animated SVG Waves at DEAD END of Website */}
      <div style={{ position: 'relative', width: '100%', height: 140, overflow: 'hidden', background: '#020408' }}>
        {/* Layer 1 - Deep Blue Wave */}
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          style={{
            position: 'absolute',
            bottom: 0,
            width: '200%',
            height: 120,
            opacity: 0.35,
            animation: 'waveMove 14s linear infinite',
            fill: 'url(#gradientWave1)',
          }}
        >
          <defs>
            <linearGradient id="gradientWave1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0369a1" />
              <stop offset="50%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>
          <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,45 L1200,120 L0,120 Z" />
        </svg>

        {/* Layer 2 - Cyan Wave */}
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          style={{
            position: 'absolute',
            bottom: 0,
            width: '200%',
            height: 100,
            opacity: 0.5,
            animation: 'waveMove 9s linear infinite reverse',
            fill: 'url(#gradientWave2)',
          }}
        >
          <defs>
            <linearGradient id="gradientWave2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
          </defs>
          <path d="M0,30 C200,110 450,10 700,65 C950,120 1100,20 1200,50 L1200,120 L0,120 Z" />
        </svg>

        {/* Layer 3 - Electric Blue Front Wave */}
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          style={{
            position: 'absolute',
            bottom: 0,
            width: '200%',
            height: 80,
            opacity: 0.8,
            animation: 'waveMove 6s linear infinite',
            fill: 'url(#gradientWave3)',
          }}
        >
          <defs>
            <linearGradient id="gradientWave3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          <path d="M0,45 C300,100 600,20 900,80 C1050,110 1150,40 1200,60 L1200,120 L0,120 Z" />
        </svg>
      </div>

      <style>{`
        @keyframes waveMove {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </footer>
  )
}
