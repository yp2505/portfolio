'use client'

import { useCallback, type ReactNode } from 'react'
import type { WindowState } from '@surdeddd/wmkit'
import { useDesktop, useWindowManager, useWmState, useWmWindowRef } from '@surdeddd/wmkit/react'
import DesktopIcons from '@/components/ui/DesktopIcons'
import MacDock from '@/components/ui/MacDock'
import About from '@/components/sections/About'
import PortfolioShowcase from '@/components/sections/PortfolioShowcase'
import ContactSection from '@/components/sections/contact/ContactSection'
import styles from './PortfolioDesktop.module.css'

type WindowId = 'about' | 'projects' | 'contact'

const windowDefinitions: Record<WindowId, { title: string; width: number; height: number; x: number; y: number }> = {
  about: { title: 'About Yug Patel', width: 860, height: 620, x: 146, y: 60 },
  projects: { title: 'Projects', width: 980, height: 650, x: 110, y: 48 },
  contact: { title: 'Contact', width: 980, height: 650, x: 132, y: 52 },
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
    wm.open({ id, ...config, minWidth: 420, minHeight: 320, meta: { kind: id } })
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
  const kind = isWindowId(win.id) ? win.id : null

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
        {kind === 'about' && <About />}
        {kind === 'projects' && <PortfolioShowcase />}
        {kind === 'contact' && <ContactSection />}
      </div>
    </section>
  )
}

function WindowShelf({ state, onFocus }: { state: ReturnType<typeof useWmState>; onFocus: (id: string) => void }) {
  const windows = state.order.flatMap((id) => {
    const win = state.windows[id]
    return win ? [win] : []
  })
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
