'use client'

import { motion } from 'framer-motion'
import { Send, User, Mail, MessageSquare, ArrowUpRight } from 'lucide-react'
import { FaLinkedinIn, FaInstagram, FaGithub, FaTwitter } from 'react-icons/fa'

const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1]

const inputStyle: React.CSSProperties = {
  width: '100%',
  borderRadius: 14,
  border: '1px solid rgba(14,165,233,0.22)',
  background: 'rgba(2,4,8,0.7)',
  padding: '13px 16px',
  outline: 'none',
  color: '#e8f4ff',
  fontSize: 14,
  fontFamily: "'Inter', sans-serif",
  transition: 'border-color 0.2s ease',
}

const socialLinks = [
  { title: 'GitHub', user: '@yp2505', icon: FaGithub, link: 'https://github.com/yp2505/Groit-AI' },
  { title: 'Twitter (X)', user: '@patel_yug1485', icon: FaTwitter, link: 'https://x.com/patel_yug1485' },
]

export default function ContactForm() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: smoothEase }}
      viewport={{ once: false, amount: 0.2 }}
      style={{
        borderRadius: 24,
        border: '1px solid rgba(14,165,233,0.2)',
        background: 'rgba(8,15,26,0.85)',
        backdropFilter: 'blur(20px)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top accent */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(14,165,233,0.6), transparent)' }} />

      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 'clamp(18px, 2.5vw, 22px)', fontWeight: 700, marginBottom: 6, fontFamily: "'Inter', sans-serif", letterSpacing: '-0.02em' }}>
          Send a Message
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: "'Inter', sans-serif", lineHeight: 1.6 }}>
          Feel free to reach out for collaborations, ML projects, or a quick chat.
        </p>
      </div>

      {/* Form fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
        <div style={{ position: 'relative' }}>
          <User size={14} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(56,189,248,0.45)' }} />
          <input
            placeholder="Your Name"
            style={{ ...inputStyle, paddingLeft: 40 }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(14,165,233,0.55)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(14,165,233,0.22)')}
          />
        </div>
        <div style={{ position: 'relative' }}>
          <Mail size={14} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(56,189,248,0.45)' }} />
          <input
            placeholder="Your Email"
            type="email"
            style={{ ...inputStyle, paddingLeft: 40 }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(14,165,233,0.55)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(14,165,233,0.22)')}
          />
        </div>
        <div style={{ position: 'relative' }}>
          <MessageSquare size={14} style={{ position: 'absolute', left: 14, top: 15, color: 'rgba(56,189,248,0.45)' }} />
          <textarea
            rows={5}
            placeholder="Your Message"
            style={{ ...inputStyle, paddingLeft: 40, resize: 'none' }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(14,165,233,0.55)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(14,165,233,0.22)')}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          style={{
            width: '100%',
            borderRadius: 14,
            padding: '14px 0',
            background: 'linear-gradient(135deg, #0369a1, #0ea5e9)',
            border: 'none',
            color: 'white',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontFamily: "'Inter', sans-serif",
            boxShadow: '0 4px 20px rgba(14,165,233,0.35)',
          }}
        >
          <Send size={14} />
          Send Message
        </motion.button>
      </div>

      {/* Social */}
      <div style={{ borderTop: '1px solid rgba(14,165,233,0.12)', paddingTop: 18, marginTop: 22 }}>
        <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 12, fontFamily: "'Inter', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Connect With Me
        </p>

        {/* LinkedIn */}
        <motion.a
          href="https://www.linkedin.com/in/yug-patel-35b01b328?utm_source=share_via&utm_content=profile&utm_medium=member_android"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02, x: 3 }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderRadius: 14, border: '1px solid rgba(14,165,233,0.15)',
            background: 'rgba(0,119,181,0.07)', padding: '12px 14px', marginBottom: 10,
            textDecoration: 'none', color: 'var(--text-primary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <FaLinkedinIn style={{ color: '#0ea5e9', fontSize: 15 }} />
            <div>
              <p style={{ fontSize: 13, fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>LinkedIn</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono), monospace' }}>Yug Patel</p>
            </div>
          </div>
          <ArrowUpRight size={13} style={{ color: '#38bdf8' }} />
        </motion.a>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          {socialLinks.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.a
                key={i}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -2 }}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  borderRadius: 14, border: '1px solid rgba(14,165,233,0.13)',
                  background: 'rgba(14,165,233,0.04)', padding: '12px 8px',
                  textDecoration: 'none', color: 'var(--text-primary)',
                }}
              >
                <Icon style={{ fontSize: 16, color: 'rgba(56,189,248,0.7)' }} />
                <p style={{ fontSize: 11, fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>{item.title}</p>
              </motion.a>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}