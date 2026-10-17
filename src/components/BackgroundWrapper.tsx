'use client'

import { usePathname } from 'next/navigation'
import { useHomeTheme } from '@/lib/themeContext'
import { motion } from 'framer-motion'

export default function BackgroundWrapper() {
  const pathname = usePathname()
  const { homeTheme } = useHomeTheme()
  const isHome = pathname === '/'

  const bg = isHome
    ? homeTheme === 'dark'
      ? 'url(/assets/dark.jpg)'
      : 'url(/assets/light.jpg)'
    : 'url(/assets/dark.jpg)'

  return (
    <motion.div
      key={bg}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: bg,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        zIndex: -1,
      }}
    />
  )
}
