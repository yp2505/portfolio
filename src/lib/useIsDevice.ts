import { useState, useEffect } from 'react'

/**
 * Detects whether the user is on a real mobile/touch device.
 *
 * Combines three signals for maximum accuracy:
 *  1. navigator.userAgent — detects iOS, Android, etc.
 *  2. (pointer: coarse) — true on touch-only screens
 *  3. window.innerWidth < 768 — pixel-width fallback
 *
 * A desktop browser window narrowed to 390px still returns false
 * because pointer will be "fine" (mouse). A real iPhone returns true
 * even if somehow given a wide viewport.
 */
export function useIsDevice() {
  const [isMobile, setIsMobile] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    function detect() {
      const ua = navigator.userAgent
      const isUaMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
      const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches
      const isNarrow = window.innerWidth < 768

      // True mobile = UA says mobile OR (touch pointer AND narrow screen)
      const mobile = isUaMobile || (isCoarsePointer && isNarrow)
      setIsMobile(mobile)
      setIsReady(true)
    }

    detect()

    // Re-check on resize (for browser DevTools device emulation)
    window.addEventListener('resize', detect)
    return () => window.removeEventListener('resize', detect)
  }, [])

  return { isMobile, isReady }
}
