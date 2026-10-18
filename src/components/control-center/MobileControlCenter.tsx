'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
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
  Zap,
  Smartphone,
  X,
  ChevronDown,
  Info,
} from 'lucide-react'
import { useControlCenter } from './useControlCenter'
import Slider from './Slider'
import CalendarCard from './CalendarCard'
import NowPlaying from './NowPlaying'

export default function MobileControlCenter() {
  const {
    isMobileControlCenterOpen,
    setMobileControlCenterOpen,
    isRealOnline,
    isSimulatedOffline,
    toggleSimulatedOffline,
    isBluetoothOn,
    toggleBluetooth,
    isAirDropOn,
    toggleAirDrop,
    isCellularOn,
    toggleCellular,
    brightness,
    setBrightness,
    volume,
    setVolume,
    isMuted,
    isFocusOn,
    toggleFocus,
    isFlashlightOn,
    toggleFlashlight,
    homeTheme,
    toggleHomeTheme,
  } = useControlCenter()

  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)
  const [showCalendarModal, setShowCalendarModal] = useState(false)
  const sheetRef = useRef<HTMLDivElement>(null)

  // Real vs simulated Wi-Fi state
  const isWifiActive = isRealOnline && !isSimulatedOffline

  // Sound icon helper
  const renderSoundIcon = () => {
    if (isMuted || volume === 0) return <VolumeX size={20} />
    if (volume < 40) return <Volume1 size={20} />
    return <Volume2 size={20} />
  }

  // Global touch gesture handler for swiping down from top-right corner to open
  useEffect(() => {
    let startX = 0
    let startY = 0
    let tracking = false

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return
      const touch = e.touches[0]
      const screenWidth = window.innerWidth
      // Only trigger if starting in top 60px and in the right 45% of screen
      if (touch.clientY <= 64 && touch.clientX >= screenWidth * 0.55) {
        startX = touch.clientX
        startY = touch.clientY
        tracking = true
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!tracking || e.touches.length !== 1) return
      const touch = e.touches[0]
      const deltaY = touch.clientY - startY
      const deltaX = Math.abs(touch.clientX - startX)

      // If dragged down > 45px with mostly vertical motion, open Control Center
      if (deltaY > 45 && deltaY > deltaX) {
        tracking = false
        setMobileControlCenterOpen(true)
      }
    }

    const handleTouchEnd = () => {
      tracking = false
    }

    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [setMobileControlCenterOpen])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileControlCenterOpen) {
        setMobileControlCenterOpen(false)
        setShowCalendarModal(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMobileControlCenterOpen, setMobileControlCenterOpen])

  // Drag down or up to dismiss with Framer Motion drag
  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    // If swiped up with negative velocity or dragged up > 80px, close
    if (info.offset.y < -70 || info.velocity.y < -300) {
      setMobileControlCenterOpen(false)
    }
  }

  // Dismiss tooltip when tapping elsewhere
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setMobileControlCenterOpen(false)
      setActiveTooltip(null)
    }
  }

  return (
    <>
      <AnimatePresence>
        {isMobileControlCenterOpen && (
          <motion.div
            data-mobile-control-center-backdrop="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={handleBackdropClick}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9990,
              backgroundColor: 'rgba(0, 0, 0, 0.45)',
              backdropFilter: 'blur(36px) saturate(180%)',
              WebkitBackdropFilter: 'blur(36px) saturate(180%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)',
              paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)',
              paddingLeft: 16,
              paddingRight: 16,
            }}
          >
            {/* Draggable Control Center Sheet Container */}
            <motion.div
              ref={sheetRef}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0.25, bottom: 0.05 }}
              onDragEnd={handleDragEnd}
              initial={{ y: '-100%', opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '-100%', opacity: 0 }}
              transition={{
                type: 'spring',
                damping: 32,
                stiffness: 350,
                mass: 0.8,
              }}
              style={{
                width: '100%',
                maxWidth: 420,
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                touchAction: 'pan-y',
              }}
            >
              {/* Top Handle / Status Indicator */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '4px 6px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      color: 'rgba(255, 255, 255, 0.65)',
                    }}
                  >
                    Control Center
                  </span>
                  {isSimulatedOffline && (
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        padding: '2px 6px',
                        borderRadius: 10,
                        backgroundColor: 'rgba(245, 158, 11, 0.2)',
                        color: '#fbbf24',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                      }}
                    >
                      Offline Mode
                    </span>
                  )}
                </div>

                {/* Close Button / Pull indicator */}
                <button
                  type="button"
                  onClick={() => setMobileControlCenterOpen(false)}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                  aria-label="Close Control Center"
                >
                  <ChevronDown size={18} strokeWidth={2.5} />
                </button>
              </div>

              {/* Tooltip Banner (if active) */}
              <AnimatePresence>
                {activeTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    style={{
                      borderRadius: 12,
                      padding: '8px 12px',
                      backgroundColor: 'rgba(0, 0, 0, 0.75)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      fontSize: 11,
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 8,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Info size={14} color="#38bdf8" />
                      <span>{activeTooltip}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTooltip(null)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'rgba(255,255,255,0.7)',
                        padding: 2,
                        cursor: 'pointer',
                      }}
                    >
                      <X size={12} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 2-Column Main Section: Connectivity (2x2) & Now Playing */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 14,
                  alignItems: 'stretch',
                }}
              >
                {/* 2x2 Connectivity Block */}
                <div
                  style={{
                    borderRadius: 24,
                    backgroundColor: 'rgba(255, 255, 255, 0.12)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.16)',
                    padding: 12,
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 12,
                    alignItems: 'center',
                    justifyItems: 'center',
                    aspectRatio: '1 / 1',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
                  }}
                >
                  {/* Cellular Tile */}
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.88 }}
                    onClick={() => {
                      toggleCellular()
                      setActiveTooltip(
                        'Cellular: Decorative toggle. Browsers cannot modify physical mobile data antennas.'
                      )
                    }}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      backgroundColor: isCellularOn ? '#34c759' : 'rgba(255, 255, 255, 0.15)',
                      border: 'none',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease',
                      boxShadow: isCellularOn ? '0 2px 8px rgba(52, 199, 89, 0.4)' : 'none',
                    }}
                    aria-label="Cellular Data (Decorative)"
                  >
                    <Smartphone size={22} strokeWidth={2.2} />
                  </motion.button>

                  {/* Wi-Fi Tile */}
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.88 }}
                    onClick={() => {
                      toggleSimulatedOffline()
                      setActiveTooltip(
                        isWifiActive
                          ? 'Wi-Fi: Simulating site offline mode. Real hardware connection remains active.'
                          : 'Wi-Fi: Simulated offline mode disabled. Site is online.'
                      )
                    }}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      backgroundColor: isWifiActive ? '#007aff' : 'rgba(255, 255, 255, 0.15)',
                      border: 'none',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease',
                      boxShadow: isWifiActive ? '0 2px 8px rgba(0, 122, 255, 0.4)' : 'none',
                    }}
                    aria-label={`Wi-Fi: ${isWifiActive ? 'Connected' : 'Offline (Simulated)'}`}
                  >
                    {isWifiActive ? (
                      <Wifi size={22} strokeWidth={2.2} />
                    ) : (
                      <WifiOff size={22} strokeWidth={2.2} />
                    )}
                  </motion.button>

                  {/* Bluetooth Tile */}
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.88 }}
                    onClick={() => {
                      toggleBluetooth()
                      setActiveTooltip(
                        'Bluetooth: Decorative toggle. Browsers cannot turn off device Bluetooth.'
                      )
                    }}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      backgroundColor: isBluetoothOn ? '#007aff' : 'rgba(255, 255, 255, 0.15)',
                      border: 'none',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease',
                      boxShadow: isBluetoothOn ? '0 2px 8px rgba(0, 122, 255, 0.4)' : 'none',
                    }}
                    aria-label="Bluetooth (Decorative)"
                  >
                    <Bluetooth size={22} strokeWidth={2.2} />
                  </motion.button>

                  {/* AirDrop Tile */}
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.88 }}
                    onClick={() => {
                      toggleAirDrop()
                      setActiveTooltip(
                        'AirDrop: Decorative toggle. Web apps cannot access Apple AirDrop services.'
                      )
                    }}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      backgroundColor: isAirDropOn ? '#007aff' : 'rgba(255, 255, 255, 0.15)',
                      border: 'none',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease',
                      boxShadow: isAirDropOn ? '0 2px 8px rgba(0, 122, 255, 0.4)' : 'none',
                    }}
                    aria-label="AirDrop (Decorative)"
                  >
                    <Radio size={22} strokeWidth={2.2} />
                  </motion.button>
                </div>

                {/* Now Playing Widget */}
                <div
                  style={{
                    borderRadius: 24,
                    backgroundColor: 'rgba(255, 255, 255, 0.12)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.16)',
                    padding: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    aspectRatio: '1 / 1',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <NowPlaying compact />
                </div>
              </div>

              {/* Middle Section: Two Tall Vertical Pill Sliders & Quick Tiles */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 14,
                  alignItems: 'stretch',
                }}
              >
                {/* Left Column: Quick Action Tiles (Dark Mode, Focus, Calendar, Flashlight) */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 12,
                  }}
                >
                  {/* Dark / Light Mode */}
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.92 }}
                    onClick={toggleHomeTheme}
                    style={{
                      aspectRatio: '1 / 1',
                      borderRadius: 22,
                      backgroundColor: 'rgba(255, 255, 255, 0.12)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.16)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      color: '#ffffff',
                      cursor: 'pointer',
                      padding: 8,
                    }}
                    aria-label={`Toggle Theme (Current: ${homeTheme})`}
                  >
                    {homeTheme === 'dark' ? (
                      <Moon size={22} color="#f59e0b" fill="#f59e0b" />
                    ) : (
                      <Sun size={22} color="#fbbf24" />
                    )}
                    <span style={{ fontSize: 10, fontWeight: 600 }}>
                      {homeTheme === 'dark' ? 'Dark' : 'Light'}
                    </span>
                  </motion.button>

                  {/* Focus / DND */}
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.92 }}
                    onClick={toggleFocus}
                    style={{
                      aspectRatio: '1 / 1',
                      borderRadius: 22,
                      backgroundColor: isFocusOn
                        ? '#5856d6'
                        : 'rgba(255, 255, 255, 0.12)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.16)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      color: '#ffffff',
                      cursor: 'pointer',
                      padding: 8,
                      boxShadow: isFocusOn ? '0 4px 12px rgba(88, 86, 214, 0.4)' : 'none',
                    }}
                    aria-label={`Focus: ${isFocusOn ? 'On' : 'Off'}`}
                  >
                    <Moon size={22} color="#ffffff" />
                    <span style={{ fontSize: 10, fontWeight: 600 }}>Focus</span>
                  </motion.button>

                  {/* Flashlight (Decorative / Screen glow) */}
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.92 }}
                    onClick={toggleFlashlight}
                    style={{
                      aspectRatio: '1 / 1',
                      borderRadius: 22,
                      backgroundColor: isFlashlightOn
                        ? '#ffffff'
                        : 'rgba(255, 255, 255, 0.12)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.16)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      color: isFlashlightOn ? '#000000' : '#ffffff',
                      cursor: 'pointer',
                      padding: 8,
                      boxShadow: isFlashlightOn ? '0 4px 16px rgba(255, 255, 255, 0.6)' : 'none',
                    }}
                    aria-label={`Flashlight: ${isFlashlightOn ? 'On' : 'Off'}`}
                  >
                    <Zap size={22} color={isFlashlightOn ? '#000000' : '#ffffff'} />
                    <span style={{ fontSize: 10, fontWeight: 600 }}>Flashlight</span>
                  </motion.button>

                  {/* Calendar Modal Launcher */}
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setShowCalendarModal(true)}
                    style={{
                      aspectRatio: '1 / 1',
                      borderRadius: 22,
                      backgroundColor: 'rgba(255, 255, 255, 0.12)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.16)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      color: '#ffffff',
                      cursor: 'pointer',
                      padding: 8,
                    }}
                    aria-label="Open Calendar & Notes"
                  >
                    <CalendarIcon size={22} color="#38bdf8" />
                    <span style={{ fontSize: 10, fontWeight: 600 }}>Calendar</span>
                  </motion.button>
                </div>

                {/* Right Column: Two Tall Vertical Pill Sliders (Brightness & Sound) */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 12,
                    justifyItems: 'center',
                  }}
                >
                  {/* Brightness Pill */}
                  <Slider
                    orientation="vertical"
                    value={brightness}
                    onChange={setBrightness}
                    min={20}
                    max={100}
                    label="Display Brightness"
                    icon={<Sun size={20} />}
                    width="100%"
                    height="100%"
                  />

                  {/* Volume Pill */}
                  <Slider
                    orientation="vertical"
                    value={isMuted ? 0 : volume}
                    onChange={setVolume}
                    min={0}
                    max={100}
                    label="Sound Volume"
                    icon={renderSoundIcon()}
                    width="100%"
                    height="100%"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calendar Overlay Modal */}
      <AnimatePresence>
        {showCalendarModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCalendarModal(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 10005,
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 16,
            }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: 360,
                borderRadius: 24,
                backgroundColor: 'rgba(28, 28, 30, 0.92)',
                backdropFilter: 'blur(40px)',
                WebkitBackdropFilter: 'blur(40px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
                padding: 18,
                position: 'relative',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CalendarIcon size={18} color="#38bdf8" />
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>
                    Calendar & Notes
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCalendarModal(false)}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  aria-label="Close Calendar"
                >
                  <X size={16} />
                </button>
              </div>

              <CalendarCard />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
