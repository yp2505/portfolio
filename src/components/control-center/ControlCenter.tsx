'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wifi,
  WifiOff,
  Bluetooth,
  Radio,
  Moon,
  Sun,
  Volume2,
  Volume1,
  VolumeX,
  Calendar as CalendarIcon,
  ChevronRight,
} from 'lucide-react'
import { useControlCenter } from './useControlCenter'
import Slider from './Slider'
import NowPlaying from './NowPlaying'
import CalendarCard from './CalendarCard'

export default function ControlCenter() {
  const {
    isDesktopControlCenterOpen,
    setDesktopControlCenterOpen,
    isRealOnline,
    isSimulatedOffline,
    toggleSimulatedOffline,
    networkType,
    isBluetoothOn,
    toggleBluetooth,
    isAirDropOn,
    toggleAirDrop,
    brightness,
    setBrightness,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    isFocusOn,
    toggleFocus,
    homeTheme,
    toggleHomeTheme,
  } = useControlCenter()

  const panelRef = useRef<HTMLDivElement>(null)
  const [showCalendarInPanel, setShowCalendarInPanel] = useState(false)
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)

  // Close on outside click
  useEffect(() => {
    if (!isDesktopControlCenterOpen) return

    const handlePointerDown = (e: PointerEvent) => {
      // Don't close if clicking inside panel or the trigger in TopMenu
      const target = e.target as HTMLElement
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        !target.closest('[data-control-center-trigger]')
      ) {
        setDesktopControlCenterOpen(false)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDesktopControlCenterOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isDesktopControlCenterOpen, setDesktopControlCenterOpen])

  // Effective Wi-Fi status
  const isWifiActive = isRealOnline && !isSimulatedOffline

  // Sound icon helper
  const renderSoundIcon = () => {
    if (isMuted || volume === 0) return <VolumeX size={15} />
    if (volume < 40) return <Volume1 size={15} />
    return <Volume2 size={15} />
  }

  return (
    <AnimatePresence>
      {isDesktopControlCenterOpen && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, scale: 0.94, y: -6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: -6 }}
          transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
          style={{
            position: 'fixed',
            top: 34,
            right: 12,
            width: 344,
            maxHeight: 'calc(100vh - 44px)',
            overflowY: 'auto',
            transformOrigin: 'top right',
            zIndex: 1000,
            borderRadius: 20,
            backgroundColor: 'rgba(28, 28, 30, 0.72)',
            backdropFilter: 'blur(30px) saturate(190%)',
            WebkitBackdropFilter: 'blur(30px) saturate(190%)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0,0,0,0.2)',
            padding: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            color: '#ffffff',
            userSelect: 'none',
          }}
        >
          {/* Top Section: 2 Columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {/* Left: Connectivity Block (large rounded card) */}
            <div
              style={{
                borderRadius: 14,
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.09)',
                padding: '10px 10px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              {/* Wi-Fi Row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  position: 'relative',
                }}
              >
                <button
                  type="button"
                  onClick={toggleSimulatedOffline}
                  onMouseEnter={() => setActiveTooltip('wifi')}
                  onMouseLeave={() => setActiveTooltip(null)}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    backgroundColor: isWifiActive ? '#007aff' : 'rgba(255, 255, 255, 0.16)',
                    border: 'none',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'background-color 0.15s ease',
                  }}
                  aria-label="Toggle simulated Wi-Fi"
                >
                  {isWifiActive ? <Wifi size={15} /> : <WifiOff size={15} />}
                </button>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#ffffff' }}>Wi-Fi</div>
                  <div
                    style={{
                      fontSize: 10,
                      color: isWifiActive ? 'rgba(255,255,255,0.7)' : '#ff9f0a',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {isSimulatedOffline
                      ? 'Offline (Sim)'
                      : isRealOnline
                      ? networkType
                      : 'Disconnected'}
                  </div>
                </div>

                {/* Tooltip */}
                {activeTooltip === 'wifi' && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 36,
                      left: 0,
                      right: 0,
                      backgroundColor: 'rgba(0,0,0,0.85)',
                      padding: 6,
                      borderRadius: 6,
                      fontSize: 10,
                      color: 'rgba(255,255,255,0.9)',
                      zIndex: 20,
                      pointerEvents: 'none',
                    }}
                  >
                    Real status: {isRealOnline ? 'Online' : 'Offline'}. Click to toggle simulated
                    offline mode for this portfolio.
                  </div>
                )}
              </div>

              {/* Bluetooth Row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  position: 'relative',
                }}
              >
                <button
                  type="button"
                  onClick={toggleBluetooth}
                  onMouseEnter={() => setActiveTooltip('bluetooth')}
                  onMouseLeave={() => setActiveTooltip(null)}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    backgroundColor: isBluetoothOn ? '#007aff' : 'rgba(255, 255, 255, 0.16)',
                    border: 'none',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'background-color 0.15s ease',
                  }}
                  aria-label="Toggle Bluetooth (decorative)"
                >
                  <Bluetooth size={15} />
                </button>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#ffffff' }}>Bluetooth</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)' }}>
                    {isBluetoothOn ? 'On' : 'Off'}
                  </div>
                </div>

                {/* Tooltip */}
                {activeTooltip === 'bluetooth' && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 36,
                      left: 0,
                      right: 0,
                      backgroundColor: 'rgba(0,0,0,0.85)',
                      padding: 6,
                      borderRadius: 6,
                      fontSize: 10,
                      color: 'rgba(255,255,255,0.9)',
                      zIndex: 20,
                      pointerEvents: 'none',
                    }}
                  >
                    Decorative toggle. Browsers cannot alter device hardware Bluetooth.
                  </div>
                )}
              </div>

              {/* AirDrop Row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  position: 'relative',
                }}
              >
                <button
                  type="button"
                  onClick={toggleAirDrop}
                  onMouseEnter={() => setActiveTooltip('airdrop')}
                  onMouseLeave={() => setActiveTooltip(null)}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    backgroundColor: isAirDropOn ? '#007aff' : 'rgba(255, 255, 255, 0.16)',
                    border: 'none',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'background-color 0.15s ease',
                  }}
                  aria-label="Toggle AirDrop (decorative)"
                >
                  <Radio size={15} />
                </button>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#ffffff' }}>AirDrop</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)' }}>
                    {isAirDropOn ? 'Contacts Only' : 'Off'}
                  </div>
                </div>

                {/* Tooltip */}
                {activeTooltip === 'airdrop' && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 36,
                      left: 0,
                      right: 0,
                      backgroundColor: 'rgba(0,0,0,0.85)',
                      padding: 6,
                      borderRadius: 6,
                      fontSize: 10,
                      color: 'rgba(255,255,255,0.9)',
                      zIndex: 20,
                      pointerEvents: 'none',
                    }}
                  >
                    Decorative AirDrop toggle.
                  </div>
                )}
              </div>
            </div>

            {/* Right: Focus Tile & Dark Mode Tile */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* Focus / Do Not Disturb Tile */}
              <button
                type="button"
                onClick={toggleFocus}
                style={{
                  flex: 1,
                  borderRadius: 14,
                  backgroundColor: isFocusOn ? 'rgba(88, 86, 214, 0.35)' : 'rgba(255, 255, 255, 0.08)',
                  border: isFocusOn
                    ? '1px solid rgba(88, 86, 214, 0.6)'
                    : '1px solid rgba(255, 255, 255, 0.09)',
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  cursor: 'pointer',
                  textAlign: 'left',
                  color: '#ffffff',
                  transition: 'all 0.15s ease',
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    backgroundColor: isFocusOn ? '#5856d6' : 'rgba(255,255,255,0.16)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Moon size={15} fill={isFocusOn ? '#ffffff' : 'none'} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>Focus</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)' }}>
                    {isFocusOn ? 'Do Not Disturb' : 'Off'}
                  </div>
                </div>
              </button>

              {/* Dark/Light Mode Theme Tile (Really Toggles Site Theme) */}
              <button
                type="button"
                onClick={toggleHomeTheme}
                style={{
                  flex: 1,
                  borderRadius: 14,
                  backgroundColor:
                    homeTheme === 'dark' ? 'rgba(56, 189, 248, 0.22)' : 'rgba(255, 255, 255, 0.16)',
                  border:
                    homeTheme === 'dark'
                      ? '1px solid rgba(56, 189, 248, 0.45)'
                      : '1px solid rgba(255, 255, 255, 0.15)',
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  cursor: 'pointer',
                  textAlign: 'left',
                  color: '#ffffff',
                  transition: 'all 0.15s ease',
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    backgroundColor: homeTheme === 'dark' ? '#38bdf8' : 'rgba(255,255,255,0.2)',
                    color: homeTheme === 'dark' ? '#1c1c1e' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {homeTheme === 'dark' ? <Moon size={15} /> : <Sun size={15} />}
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>Theme</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)' }}>
                    {homeTheme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Middle: Sliders Card (Display & Sound) */}
          <div
            style={{
              borderRadius: 14,
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.09)',
              padding: '10px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            {/* Display Brightness Slider */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.7)',
                }}
              >
                <span>Display</span>
                <span>{brightness}%</span>
              </div>
              <Slider
                value={brightness}
                onChange={setBrightness}
                min={20}
                max={100}
                label="Display Brightness"
                icon={<Sun size={15} />}
                height={28}
              />
            </div>

            {/* Sound Volume Slider */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.7)',
                }}
              >
                <span>Sound</span>
                <span
                  onClick={toggleMute}
                  style={{ cursor: 'pointer', textDecoration: isMuted ? 'line-through' : 'none' }}
                >
                  {isMuted ? 'Muted' : `${volume}%`}
                </span>
              </div>
              <Slider
                value={isMuted ? 0 : volume}
                onChange={(val) => {
                  setVolume(val)
                }}
                min={0}
                max={100}
                label="Sound Volume"
                icon={renderSoundIcon()}
                height={28}
              />
            </div>
          </div>

          {/* Now Playing Card */}
          <div
            style={{
              borderRadius: 14,
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.09)',
              padding: '10px 12px',
            }}
          >
            <NowPlaying compact />
          </div>

          {/* Calendar Widget Toggle Card */}
          <div
            style={{
              borderRadius: 14,
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.09)',
              padding: '8px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div
              onClick={() => setShowCalendarInPanel(!showCalendarInPanel)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 7,
                    backgroundColor: '#ff3b30',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                  }}
                >
                  <CalendarIcon size={14} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 600 }}>Interactive Calendar</span>
              </div>
              <motion.div
                animate={{ rotate: showCalendarInPanel ? 90 : 0 }}
                transition={{ duration: 0.15 }}
                style={{ color: 'rgba(255,255,255,0.5)', display: 'flex' }}
              >
                <ChevronRight size={15} />
              </motion.div>
            </div>

            {/* Embedded Calendar View */}
            <AnimatePresence>
              {showCalendarInPanel && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ overflow: 'hidden', paddingTop: 6 }}
                >
                  <CalendarCard />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
