'use client'

import { usePathname } from 'next/navigation'

export default function BackgroundWrapper() {
  const pathname = usePathname()
  const isHome = pathname === '/'

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: isHome ? 'url(/assets/light.jpg)' : 'url(/assets/dark.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        zIndex: -1,
      }}
    />
  )
}
