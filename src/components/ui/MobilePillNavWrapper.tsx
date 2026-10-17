'use client'

import { useIsDevice } from '@/lib/useIsDevice'
import MobilePillNav from './MobilePillNav'
import MobileBackButton from './MobileBackButton'

/**
 * Renders MobilePillNav + MobileBackButton only on real mobile devices.
 * This component lives in the root layout so the pill nav and back button
 * persist across ALL pages (About, Projects, Contact, etc.).
 */
export default function MobilePillNavWrapper() {
  const { isMobile, isReady } = useIsDevice()

  if (!isReady || !isMobile) return null

  return (
    <>
      <MobilePillNav />
      <MobileBackButton />
    </>
  )
}
