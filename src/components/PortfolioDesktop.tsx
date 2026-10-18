'use client'

import { useCallback, type ReactNode } from 'react'
import { ExternalLink, FolderKanban, GitFork, Mail, MonitorCog, UserRound } from 'lucide-react'
import type { WindowState } from '@surdeddd/wmkit'
import { useDesktop, useWindowManager, useWmState, useWmWindowRef } from '@surdeddd/wmkit/react'
import DesktopIcons from '@/components/ui/DesktopIcons'
import MacDock from '@/components/ui/MacDock'
import usePortfolio from '@/hooks/usePortfolio'
import styles from './PortfolioDesktop.module.css'

type WindowId = 'portfolio' | 'about' | 'projects' | 'contact'

const windowDefinitions: Record<WindowId, { title: string; width: number; height: number; x: number; y: number }> = {
  portfolio: { title: 'Portfolio OS', width: 540, height: 360, x: 164, y: 104 },
  about: { title: 'About Yug Patel', width: 570, height: 410, x: 200, y: 94 },
  projects: { title: 'Projects', width: 760, height: 560, x: 150, y: 76 },
  contact: { title: 'Contact', width: 480, height: 350, x: 244, y: 130 },
}

interface PortfolioDesktopProps {
  children: ReactNode
}

export default function PortfolioDesktop({ children }: PortfolioDesktopProps) {
  const wm = useWindowManager({ cascadeOrigin: { x: 136, y: 76 } })
  const { ref, binder } = useDesktop(wm, {
    snap: { preview: true, topEdge: 'maximize' },
    magnetism: true,
    keyboard: true,
  })
  const state = useWmState(wm)

  const openWindow = useCallback((id: string) => {
    if (!isWindowId(id)) return

    if (wm.get(id)) {
      wm.focus(id)
      return
    }

    const config = windowDefinitions[id]
    wm.open({ id, ...config, minWidth: 300, minHeight: 220, meta: { kind: id } })
  }, [wm])

  return (
    <div ref={ref} className={styles.desktop}>
      {children}
      <DesktopIcons onOpenWindow={openWindow} />

      {state.order.map((id) => {
        const win = state.windows[id]
        return win ? <PortfolioWindow key={id} binder={binder} win={win} /> : null
      })}

      <WindowShelf state={state} onFocus={(id) => wm.focus(id)} />
      <MacDock onOpenWindow={openWindow} />
    </div>
  )
}

function isWindowId(id: string): id is WindowId {
  return id in windowDefinitions
}

function PortfolioWindow({ binder, win }: { binder: ReturnType<typeof useDesktop>['binder']; win: WindowState }) {
  const ref = useWmWindowRef(binder, win.id)
  const kind = isWindowId(win.id) ? win.id : 'portfolio'

  return (
    <section ref={ref} className={styles.window}>
      <header data-wm-drag className={styles.titlebar}>
        <span data-wm-title>{win.title}</span>
        <span data-wm-controls className={styles.controls}>
          <button type="button" data-wm-minimize aria-label={`Minimize ${win.title}`} />
          <button type="button" data-wm-maximize aria-label={`Maximize ${win.title}`} />
          <button type="button" data-wm-close aria-label={`Close ${win.title}`} />
        </span>
      </header>
      <div data-wm-content className={styles.windowContent}>
        {kind === 'portfolio' && <PortfolioOverview />}
        {kind === 'about' && <AboutContent />}
        {kind === 'projects' && <ProjectsContent />}
        {kind === 'contact' && <ContactContent />}
      </div>
    </section>
  )
}

function PortfolioOverview() {
  return (
    <div className={styles.overview}>
      <div className={styles.overviewIcon}><MonitorCog size={26} /></div>
      <div>
        <p className={styles.eyebrow}>WEB DESKTOP</p>
        <h2>Yug&apos;s Portfolio OS</h2>
        <p>This is the portfolio desktop. Open folders to explore Yug&apos;s background, work, and contact details in movable windows.</p>
      </div>
      <p className={styles.hint}>Drag a title bar to move a window. Drop it at an edge to snap it.</p>
    </div>
  )
}

function AboutContent() {
  return (
    <div className={styles.about}>
      <div className={styles.aboutIcon}><UserRound size={27} /></div>
      <div>
        <p className={styles.eyebrow}>DATA & MACHINE LEARNING</p>
        <h2>Yug Patel</h2>
        <p>Data and machine learning engineer focused on building reliable pipelines, intelligent systems, and practical edge-AI products.</p>
        <div className={styles.tags}>{['Python', 'SQL', 'Spark', 'PyTorch', 'TensorFlow', 'Next.js'].map((skill) => <span key={skill}>{skill}</span>)}</div>
      </div>
    </div>
  )
}

function ProjectsContent() {
  const { projects, loading } = usePortfolio()

  if (loading) return <p className={styles.loading}>Loading projects…</p>

  return (
    <div className={styles.projects}>
      {projects.map((project) => (
        <article key={project.id} className={styles.project}>
          <div><FolderKanban size={17} /><h2>{project.title}</h2></div>
          <p>{project.description}</p>
          <div className={styles.tags}>{project.tech.slice(0, 4).map((tech) => <span key={tech}>{tech}</span>)}</div>
          <a href={project.github_url} target="_blank" rel="noreferrer"><GitFork size={14} />View source <ExternalLink size={12} /></a>
        </article>
      ))}
    </div>
  )
}

function ContactContent() {
  return (
    <div className={styles.contact}>
      <Mail size={28} />
      <p className={styles.eyebrow}>LET&apos;S BUILD SOMETHING USEFUL</p>
      <h2>Get in touch</h2>
      <p>Interested in an ML collaboration, data project, or practical AI work? Let&apos;s talk.</p>
      <a href="mailto:yugpatel2505@gmail.com"><Mail size={16} />Email Yug</a>
      <a href="https://github.com/yp2505" target="_blank" rel="noreferrer"><GitFork size={16} />GitHub <ExternalLink size={13} /></a>
    </div>
  )
}

function WindowShelf({ state, onFocus }: { state: ReturnType<typeof useWmState>; onFocus: (id: string) => void }) {
  const windows = state.order.map((id) => state.windows[id]).filter(Boolean)
  if (windows.length === 0) return null

  return (
    <nav className={styles.shelf} aria-label="Open portfolio windows">
      {windows.map((win) => (
        <button key={win.id} type="button" onClick={() => onFocus(win.id)} aria-pressed={state.focusedId === win.id}>
          {win.title}
        </button>
      ))}
    </nav>
  )
}
