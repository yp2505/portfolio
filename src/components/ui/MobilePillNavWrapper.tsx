'use client'

import { useIsDevice } from '@/lib/useIsDevice'
import MobilePillNav from './MobilePillNav'
import MobileBackButton from './MobileBackButton'
import MobileStatusBar from './MobileStatusBar'

/**
 * Renders all mobile-only chrome on every page:
 *  - MobileStatusBar  — yug.dev (left) + live clock (right), like iOS status bar
 *  - MobilePillNav    — centered pill with current page name
 *  - MobileBackButton — ← Home pill on sub-pages
 */
export default function MobilePillNavWrapper() {
  const { isMobile, isReady } = useIsDevice()

  if (!isReady || !isMobile) return null

  return (
    <>
      <MobileStatusBar />
      <MobilePillNav />
      <MobileBackButton />
    </>
  )
}
