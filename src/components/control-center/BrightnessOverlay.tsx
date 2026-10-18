'use client'

import React from 'react'
import { useControlCenter } from './useControlCenter'

export default function BrightnessOverlay() {
  const { brightness, isFlashlightOn } = useControlCenter()

  // Min brightness = 20% -> opacity = 0.65 (dimmed display)
  // Max brightness = 100% -> opacity = 0 (crystal clear)
  const overlayOpacity = Math.max(0, Math.min(0.7, ((100 - brightness) / 80) * 0.65))

  return (
    <>
      {overlayOpacity > 0 && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#000000',
            opacity: overlayOpacity,
            pointerEvents: 'none',
            zIndex: 99990,
            transition: 'opacity 0.1s linear',
          }}
        />
      )}

      {isFlashlightOn && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#ffffff',
            opacity: 0.95,
            pointerEvents: 'none',
            zIndex: 99989,
            transition: 'opacity 0.2s ease',
          }}
        />
      )}
    </>
  )
}
