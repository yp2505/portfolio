'use client'

import { useEffect, useRef } from 'react'
import { ExternalLink, X } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'
import type { Project } from '@/lib/portfolioService'

interface ProjectDetailModalProps {
  project: Project | null
  onClose: () => void
}

export default function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!project) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    dialogRef.current?.focus()
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose, project])

  if (!project) return null

  return (
    <div
      onMouseDown={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        display: 'grid',
        placeItems: 'center',
        padding: 20,
        background: 'rgba(2, 6, 12, 0.72)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-detail-title"
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
        style={{
          width: 'min(680px, 100%)',
          maxHeight: 'min(760px, calc(100dvh - 40px))',
          overflow: 'auto',
          border: '1px solid rgba(125, 211, 252, 0.24)',
          borderRadius: 18,
          padding: '28px',
          background: 'rgba(8, 15, 26, 0.98)',
          boxShadow: '0 28px 80px rgba(0, 0, 0, 0.55)',
          outline: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <p style={{ margin: 0, color: '#38bdf8', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              {project.status === 'completed' ? 'Completed project' : 'In progress'}
            </p>
            <h2 id="project-detail-title" style={{ margin: '8px 0 0', color: '#e8f4ff', fontSize: 'clamp(24px, 4vw, 34px)', letterSpacing: '-0.035em', lineHeight: 1.1 }}>
              {project.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            style={{ display: 'grid', width: 36, height: 36, flex: '0 0 auto', placeItems: 'center', border: '1px solid rgba(148, 163, 184, 0.28)', borderRadius: 10, background: 'rgba(255, 255, 255, 0.04)', color: '#e8f4ff', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        <p style={{ margin: '22px 0 0', color: '#a8bed1', fontSize: 16, lineHeight: 1.75 }}>
          {project.description}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 24 }}>
          {project.tech.map((tech) => (
            <span key={tech} style={{ border: '1px solid rgba(14, 165, 233, 0.22)', borderRadius: 8, padding: '5px 9px', background: 'rgba(14, 165, 233, 0.08)', color: '#bae6fd', fontFamily: 'var(--font-mono), monospace', fontSize: 11 }}>
              {tech}
            </span>
          ))}
        </div>

        <a
          href={project.github_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 28, borderRadius: 10, padding: '11px 14px', background: 'linear-gradient(135deg, #0369a1, #0ea5e9)', color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}
        >
          <FaGithub size={17} />
          View source on GitHub
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  )
}
