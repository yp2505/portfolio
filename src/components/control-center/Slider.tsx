'use client'

import React, { useRef, useState, useCallback, KeyboardEvent } from 'react'

interface SliderProps {
  value: number
  onChange: (val: number) => void
  min?: number
  max?: number
  step?: number
  orientation?: 'horizontal' | 'vertical'
  icon?: React.ReactNode
  label: string
  height?: number | string
  width?: number | string
}

export default function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  orientation = 'horizontal',
  icon,
  label,
  height,
  width,
}: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Clamp helper
  const clampValue = useCallback(
    (val: number) => {
      const rounded = Math.round(val / step) * step
      return Math.max(min, Math.min(max, rounded))
    },
    [min, max, step]
  )

  const updateFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      if (!trackRef.current) return
      const rect = trackRef.current.getBoundingClientRect()

      if (orientation === 'horizontal') {
        const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
        const raw = min + percentage * (max - min)
        onChange(clampValue(raw))
      } else {
        // Vertical slider fills from the bottom up (iOS style)
        const percentage = Math.max(0, Math.min(1, (rect.bottom - clientY) / rect.height))
        const raw = min + percentage * (max - min)
        onChange(clampValue(raw))
      }
    },
    [orientation, min, max, clampValue, onChange]
  )

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    setIsDragging(true)
    updateFromPointer(e.clientX, e.clientY)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return
    updateFromPointer(e.clientX, e.clientY)
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      e.currentTarget.releasePointerCapture(e.pointerId)
      setIsDragging(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const delta = (max - min) * 0.05 // 5% step
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
      e.preventDefault()
      onChange(clampValue(value + delta))
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
      e.preventDefault()
      onChange(clampValue(value - delta))
    } else if (e.key === 'Home') {
      e.preventDefault()
      onChange(min)
    } else if (e.key === 'End') {
      e.preventDefault()
      onChange(max)
    }
  }

  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100))

  if (orientation === 'vertical') {
    // iOS Vertical Slider Pill
    return (
      <div
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuenow={Math.round(value)}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-orientation="vertical"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        style={{
          position: 'relative',
          width: width || 68,
          height: height || 154,
          borderRadius: 24,
          backgroundColor: 'rgba(255, 255, 255, 0.14)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.16)',
          overflow: 'hidden',
          cursor: 'ns-resize',
          touchAction: 'none',
          userSelect: 'none',
          outline: 'none',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.15)',
          transform: isDragging ? 'scale(1.03)' : 'scale(1)',
          transition: isDragging ? 'none' : 'transform 0.15s ease',
        }}
      >
        {/* Fill from bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: `${percentage}%`,
            backgroundColor: '#ffffff',
            opacity: 0.92,
            transition: isDragging ? 'none' : 'height 0.1s ease-out',
            pointerEvents: 'none',
          }}
        />

        {/* Icon at the bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            color: percentage > 30 ? '#1c1c1e' : '#ffffff',
            transition: 'color 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </div>
      </div>
    )
  }

  // macOS Horizontal Slider
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        width: width || '100%',
      }}
    >
      <div
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuenow={Math.round(value)}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-orientation="horizontal"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        style={{
          position: 'relative',
          width: '100%',
          height: height || 28,
          borderRadius: 999,
          backgroundColor: 'rgba(255, 255, 255, 0.14)',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          overflow: 'hidden',
          cursor: 'ew-resize',
          touchAction: 'none',
          userSelect: 'none',
          outline: 'none',
          display: 'flex',
          alignItems: 'center',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.2)',
        }}
      >
        {/* Fill from left */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: `${percentage}%`,
            backgroundColor: '#ffffff',
            opacity: 0.95,
            transition: isDragging ? 'none' : 'width 0.1s ease-out',
            pointerEvents: 'none',
          }}
        />

        {/* Embedded icon on the left */}
        {icon && (
          <div
            style={{
              position: 'absolute',
              left: 10,
              pointerEvents: 'none',
              color: percentage > 14 ? '#1c1c1e' : '#ffffff',
              transition: 'color 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
            }}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
