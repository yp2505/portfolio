'use client'

import { motion } from 'framer-motion'
import ContactForm from './ContactForm'
import CommentsSection from './CommentsSection'

export default function ContactSection() {
  return (
    <section
      id="contact"
      style={{ marginTop: 140, paddingTop: 100 }}
      className="w-full max-w-[1500px] mx-auto px-5 sm:px-6 md:px-10 lg:px-20 pb-24 sm:pb-28 lg:pb-36 text-white"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: false, amount: 0.3 }}
        style={{ textAlign: 'center', marginBottom: 48 }}
      >
        <motion.h1
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4"
          style={{
            textAlign: 'center',
            fontFamily: "'Inter', sans-serif",
            letterSpacing: '-0.03em',
            background: 'linear-gradient(135deg, #e8f4ff 0%, #38bdf8 50%, #0ea5e9 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Get In Touch
        </motion.h1>

        <motion.p
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}
          className="text-sm sm:text-base px-4"
          style={{
            textAlign: 'center',
            margin: '0 auto',
            maxWidth: 600,
            fontFamily: "'Inter', sans-serif",
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
          }}
        >
          Interested in ML collaborations, data projects, or just want to connect?
          Let&apos;s talk.
        </motion.p>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[440px_1fr] gap-6 sm:gap-8 md:gap-10 lg:gap-12">
        <div className="w-full"><ContactForm /></div>
        <div className="w-full"><CommentsSection /></div>
      </div>

      {/* Copyright */}
      <div
        className="mt-20 text-center text-xs"
        style={{ color: 'var(--text-muted)', fontFamily: "'Inter', sans-serif", letterSpacing: '0.04em' }}
      >
        © 2026 Yug Patel — All rights reserved.
      </div>
    </section>
  )
}