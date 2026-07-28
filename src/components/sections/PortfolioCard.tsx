'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, Clock, GitBranch } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'

type Props = {
  title: string
  description: string
  index: number
  id?: number
  image?: string
  github_url?: string
  tech?: string[]
  status?: 'completed' | 'in-progress'
}

export default function PortfolioCard({
  title,
  description,
  index,
  image,
  github_url,
  tech = [],
  status = 'completed',
}: Props) {

  const handleGithubClick = () => {
    if (github_url) window.open(github_url, '_blank')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: index * 0.06 }}
      whileHover={{ y: -6 }}
      style={{
        position: 'relative',
        borderRadius: 22,
        border: '1px solid rgba(14,165,233,0.18)',
        background: 'rgba(8,15,26,0.85)',
        backdropFilter: 'blur(12px)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 260,
        cursor: 'default',
        overflow: 'hidden',
        transition: 'border-color 0.3s ease',
      }}
      onHoverStart={(e) => {
        const el = e.target as HTMLElement
        const card = el.closest('[data-card]') as HTMLElement
        if (card) card.style.borderColor = 'rgba(14,165,233,0.4)'
      }}
      onHoverEnd={(e) => {
        const el = e.target as HTMLElement
        const card = el.closest('[data-card]') as HTMLElement
        if (card) card.style.borderColor = 'rgba(14,165,233,0.18)'
      }}
      data-card
    >
      {/* Top accent line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(14,165,233,0.6), transparent)',
        }}
      />

      {/* Image or gradient placeholder */}
      <div
        style={{
          width: '100%',
          height: 130,
          borderRadius: 14,
          overflow: 'hidden',
          marginBottom: 14,
          background: image
            ? 'none'
            : 'linear-gradient(135deg, rgba(3,105,161,0.3) 0%, rgba(8,15,26,0.8) 100%)',
          border: '1px solid rgba(14,165,233,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {image ? (
          <img
            src={image}
            alt={title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <>
            {/* Grid pattern inside card thumbnail */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'linear-gradient(rgba(14,165,233,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.07) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />
            <FaGithub style={{ fontSize: 28, color: 'rgba(56,189,248,0.3)', position: 'relative', zIndex: 1 }} />
          </>
        )}

        {/* Status badge */}
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '3px 9px',
            borderRadius: 999,
            fontSize: 10,
            fontFamily: "var(--font-mono), monospace",
            letterSpacing: '0.06em',
            background: status === 'completed'
              ? 'rgba(34,197,94,0.12)'
              : 'rgba(251,191,36,0.12)',
            border: status === 'completed'
              ? '1px solid rgba(34,197,94,0.25)'
              : '1px solid rgba(251,191,36,0.25)',
            color: status === 'completed' ? '#4ade80' : '#fbbf24',
          }}
        >
          {status === 'in-progress' && <Clock size={9} />}
          {status === 'completed' ? 'COMPLETED' : 'IN PROGRESS'}
        </div>
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: 'var(--text-primary)',
          fontFamily: "'Inter', sans-serif",
          marginBottom: 8,
          lineHeight: 1.3,
          letterSpacing: '-0.01em',
        }}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontSize: 13,
          color: 'var(--text-secondary)',
          lineHeight: 1.65,
          fontFamily: "'Inter', sans-serif",
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          marginBottom: 14,
          flex: 1,
        }}
      >
        {description}
      </p>

      {/* Tech tags */}
      {tech.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
          {tech.slice(0, 3).map((t) => (
            <span
              key={t}
              style={{
                fontSize: 10,
                fontFamily: "var(--font-mono), monospace",
                color: 'rgba(56,189,248,0.7)',
                background: 'rgba(14,165,233,0.07)',
                border: '1px solid rgba(14,165,233,0.18)',
                borderRadius: 6,
                padding: '2px 8px',
              }}
            >
              {t}
            </span>
          ))}
          {tech.length > 3 && (
            <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "var(--font-mono), monospace", padding: '2px 4px' }}>
              +{tech.length - 3}
            </span>
          )}
        </div>
      )}

      {/* GitHub Button */}
      <button
        onClick={handleGithubClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 7,
          width: '100%',
          padding: '10px 0',
          borderRadius: 12,
          border: '1px solid rgba(14,165,233,0.25)',
          background: 'rgba(14,165,233,0.07)',
          color: '#38bdf8',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: "'Inter', sans-serif",
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(14,165,233,0.14)'
          e.currentTarget.style.borderColor = 'rgba(14,165,233,0.5)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(14,165,233,0.07)'
          e.currentTarget.style.borderColor = 'rgba(14,165,233,0.25)'
        }}
      >
        <FaGithub style={{ fontSize: 14 }} />
        View on GitHub
        <ArrowUpRight size={13} />
      </button>
    </motion.div>
  )
}