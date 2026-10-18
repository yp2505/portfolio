'use client'

// src/components/OsFrame.tsx
// ─────────────────────────────────────────────────────────────
// Drop-in React component that embeds the OS.js server inside
// an <iframe> and exposes a clean bridge API via a forwarded ref.
//
// Usage:
//   const osRef = useRef<OsFrameHandle>(null)
//   <OsFrame ref={osRef} onReady={() => console.log('booted!')} />
//   osRef.current?.switchTab('projects')
// ─────────────────────────────────────────────────────────────

import {
  forwardRef,
  useRef,
  useEffect,
  useCallback,
  useImperativeHandle,
} from 'react'

function getOsOrigin() {
  const value = process.env.NEXT_PUBLIC_OSJS_ORIGIN?.trim()

  if (!value) return undefined

  try {
    const url = new URL(value)
    const isHttp = url.protocol === 'http:' || url.protocol === 'https:'
    const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1'

    // Local OS.js works in `next dev`, but is never usable by a deployed visitor.
    if (!isHttp || (process.env.NODE_ENV === 'production' && isLocalhost)) return undefined

    return url.origin
  } catch {
    return undefined
  }
}

// This public value is inlined by Next.js at build time.
const OS_ORIGIN = getOsOrigin()
export const isOsFrameConfigured = Boolean(OS_ORIGIN)

// ── Public bridge API (exposed to parent via ref) ────────────
export interface OsFrameHandle {
  /** Launch any OS.js app by its registered name */
  launchApp:   (appName: string, args?: Record<string, unknown>) => void
  /** Open Portfolio Viewer on a specific tab, optionally a specific file */
  openFile:    (tab: 'about' | 'projects' | 'images', file?: string) => void
  /** Switch the active tab inside an already-open Portfolio Viewer */
  switchTab:   (tab: 'about' | 'projects' | 'images') => void
  /** Bring the Portfolio Viewer window to focus */
  focusWindow: () => void
}

interface OsFrameProps {
  /** Fired once OS.js has fully booted and confirmed OSJS_READY */
  onReady?: () => void
  className?: string
  style?: React.CSSProperties
}

const OsFrame = forwardRef<OsFrameHandle, OsFrameProps>(
  ({ onReady, className, style }, ref) => {
    const iframeRef = useRef<HTMLIFrameElement>(null)
    // Track whether OS.js has confirmed it's ready before sending messages
    const isReadyRef = useRef(false)

    // ── postMessage sender ───────────────────────────────────
    const send = useCallback((type: string, payload?: unknown) => {
      if (!isReadyRef.current || !OS_ORIGIN) {
        console.warn('[OsFrame] OS.js not ready yet — dropping:', type)
        return
      }
      iframeRef.current?.contentWindow?.postMessage(
        { type, payload },
        OS_ORIGIN,
      )
    }, [])

    // ── Expose bridge methods to parent components ───────────
    useImperativeHandle(ref, () => ({
      launchApp:   (appName, args = {}) => send('LAUNCH_APP',   { appName, args }),
      openFile:    (tab, file)          => send('OPEN_FILE',    { tab, file }),
      switchTab:   (tab)                => send('SWITCH_TAB',   { tab }),
      focusWindow: ()                   => send('FOCUS_WINDOW', {}),
    }), [send])

    // ── Listen for OSJS_READY from the iframe ───────────────
    useEffect(() => {
      const handleMessage = (event: MessageEvent) => {
        // Strict origin check — only accept from our OS.js server
        if (event.origin !== OS_ORIGIN) return

        if (event.data?.type === 'OSJS_READY') {
          isReadyRef.current = true
          onReady?.()
          console.log('[OsFrame] OS.js is ready ✓')
        }
      }

      window.addEventListener('message', handleMessage)
      return () => window.removeEventListener('message', handleMessage)
    }, [onReady])

    if (!OS_ORIGIN) return null

    return (
      <iframe
        ref={iframeRef}
        src={OS_ORIGIN}
        title="Portfolio OS — Yug Patel"
        // Minimal sandbox: scripts + same-origin for OS.js to work,
        // popups for any links the OS opens, forms for VFS uploads.
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        allow="fullscreen"
        className={className}
        style={{
          width:   '100%',
          height:  '100%',
          border:  'none',
          display: 'block',
          ...style,
        }}
      />
    )
  },
)

OsFrame.displayName = 'OsFrame'
export default OsFrame
