'use client'

import MacWindow from '@/components/ui/MacWindow'
import PortfolioOsDesktop from '@/components/PortfolioOsDesktop'

export default function OsPage() {
  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <MacWindow title="Portfolio OS — Yug Patel">
        <PortfolioOsDesktop />
      </MacWindow>
    </div>
  )
}
