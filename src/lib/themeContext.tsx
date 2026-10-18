'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
  homeTheme: Theme
  toggleHomeTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
  homeTheme: 'light',
  toggleHomeTheme: () => {},
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [homeTheme, setHomeTheme] = useState<Theme>('light')

  // Persist theme across navigation
  useEffect(() => {
    try {
      const saved = localStorage.getItem('homeWallpaper') as Theme | null
      if (saved === 'dark' || saved === 'light') {
        const timer = setTimeout(() => setHomeTheme(saved), 0)
        return () => clearTimeout(timer)
      }
    } catch {
      // localStorage security error or disabled
    }
  }, [])

  const toggleHomeTheme = () => {
    setHomeTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light'
      localStorage.setItem('homeWallpaper', next)
      return next
    })
  }

  return (
    <ThemeContext.Provider value={{ homeTheme, toggleHomeTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useHomeTheme = () => useContext(ThemeContext)
