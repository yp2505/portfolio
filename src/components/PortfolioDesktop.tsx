'use client'

import type { ReactNode } from 'react'
import { useDesktop, useWindowManager } from '@surdeddd/wmkit/react'
import DesktopIcons from '@/components/ui/DesktopIcons'
import MacDock from '@/components/ui/MacDock'
import styles from './PortfolioDesktop.module.css'

interface PortfolioDesktopProps {
  children: ReactNode
}

export default function PortfolioDesktop({ children }: PortfolioDesktopProps) {
  const wm = useWindowManager({ cascadeOrigin: { x: 136, y: 76 } })
  const { ref } = useDesktop(wm, {
    snap: { preview: true, topEdge: 'maximize' },
    magnetism: true,
    keyboard: true,
  })

  return (
    <div ref={ref} className={styles.desktop}>
      {children}
      <DesktopIcons />
      <MacDock />
    </div>
  )
}
