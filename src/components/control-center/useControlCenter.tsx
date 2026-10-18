'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useSyncExternalStore,
  ReactNode,
} from 'react'
import { useHomeTheme } from '@/lib/themeContext'

export const SPOTIFY_PROFILE_URL = 'https://open.spotify.com'

export interface Track {
  id: string
  title: string
  artist: string
  album: string
  src: string
  coverUrl?: string
}

export const DEFAULT_TRACKS: Track[] = [
  {
    id: 'track-1',
    title: 'Midnight Coding',
    artist: 'Yug Patel',
    album: 'Dev Beats Vol. 1',
    src: '/audio/track1.mp3',
    coverUrl: '/assets/profile_photo.png',
  },
  {
    id: 'track-2',
    title: 'Silicon Sunset',
    artist: 'Lofi Horizon',
    album: 'Deep Focus',
    src: '/audio/track2.mp3',
    coverUrl: '/assets/PP.png',
  },
]

interface ControlCenterContextType {
  // Panel states
  isDesktopControlCenterOpen: boolean
  setDesktopControlCenterOpen: (open: boolean | ((prev: boolean) => boolean)) => void
  isMobileControlCenterOpen: boolean
  setMobileControlCenterOpen: (open: boolean | ((prev: boolean) => boolean)) => void
  isCalendarModalOpen: boolean
  setCalendarModalOpen: (open: boolean | ((prev: boolean) => boolean)) => void

  // Connectivity
  isRealOnline: boolean
  isSimulatedOffline: boolean
  toggleSimulatedOffline: () => void
  networkType: string
  isBluetoothOn: boolean
  toggleBluetooth: () => void
  isAirDropOn: boolean
  toggleAirDrop: () => void
  isCellularOn: boolean
  toggleCellular: () => void

  // System controls
  brightness: number
  setBrightness: (val: number) => void
  volume: number
  setVolume: (val: number) => void
  isMuted: boolean
  toggleMute: () => void
  isFocusOn: boolean
  toggleFocus: () => void
  isFlashlightOn: boolean
  toggleFlashlight: () => void

  // Theme
  homeTheme: 'light' | 'dark'
  toggleHomeTheme: () => void

  // Audio / Music player
  tracks: Track[]
  currentTrackIndex: number
  currentTrack: Track
  isPlaying: boolean
  currentTime: number
  duration: number
  togglePlayPause: () => void
  nextTrack: () => void
  prevTrack: () => void
  seekTrack: (time: number) => void

  // Calendar notes
  calendarNotes: Record<string, string>
  saveCalendarNote: (dateKey: string, note: string) => void
  deleteCalendarNote: (dateKey: string) => void
}

function subscribeOnline(callback: () => void) {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener('online', callback)
  window.addEventListener('offline', callback)
  return () => {
    window.removeEventListener('online', callback)
    window.removeEventListener('offline', callback)
  }
}

function getOnlineSnapshot() {
  return typeof navigator !== 'undefined' ? navigator.onLine : true
}

function getServerOnlineSnapshot() {
  return true
}

const ControlCenterContext = createContext<ControlCenterContextType | null>(null)

export function ControlCenterProvider({ children }: { children: ReactNode }) {
  const { homeTheme, toggleHomeTheme } = useHomeTheme()

  // Panel toggles
  const [isDesktopControlCenterOpen, setDesktopControlCenterOpen] = useState(false)
  const [isMobileControlCenterOpen, setMobileControlCenterOpen] = useState(false)
  const [isCalendarModalOpen, setCalendarModalOpen] = useState(false)

  // Connectivity
  const isRealOnline = useSyncExternalStore(subscribeOnline, getOnlineSnapshot, getServerOnlineSnapshot)
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false)
  const [networkType, setNetworkType] = useState('Wi-Fi')
  const [isBluetoothOn, setIsBluetoothOn] = useState(true)
  const [isAirDropOn, setIsAirDropOn] = useState(true)
  const [isCellularOn, setIsCellularOn] = useState(true)

  // System Controls
  const [brightness, setBrightnessState] = useState(100)
  const [volume, setVolumeState] = useState(80)
  const [isMuted, setIsMuted] = useState(false)
  const [isFocusOn, setIsFocusOn] = useState(false)
  const [isFlashlightOn, setIsFlashlightOn] = useState(false)

  // Music Player
  const [tracks] = useState<Track[]>(DEFAULT_TRACKS)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(180) // default 3:00 placeholder
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const synthOscRef = useRef<OscillatorNode | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const nextTrackRef = useRef<() => void>(() => {})

  // Calendar Notes: { 'YYYY-MM-DD': 'Note content' }
  const [calendarNotes, setCalendarNotes] = useState<Record<string, string>>({})

  // Hydration-safe initial state loading via microtask/timeout to prevent cascading synchronous renders
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const savedBrightness = localStorage.getItem('cc_brightness')
        if (savedBrightness !== null) {
          const val = Number(savedBrightness)
          if (!isNaN(val) && val >= 20 && val <= 100) setBrightnessState(val)
        }

        const savedVolume = localStorage.getItem('cc_volume')
        if (savedVolume !== null) {
          const val = Number(savedVolume)
          if (!isNaN(val) && val >= 0 && val <= 100) setVolumeState(val)
        }

        const savedMuted = localStorage.getItem('cc_muted')
        if (savedMuted !== null) setIsMuted(savedMuted === 'true')

        const savedSimOffline = localStorage.getItem('cc_sim_offline')
        if (savedSimOffline !== null) setIsSimulatedOffline(savedSimOffline === 'true')

        const savedFocus = localStorage.getItem('cc_focus')
        if (savedFocus !== null) setIsFocusOn(savedFocus === 'true')

        const savedNotes = localStorage.getItem('cc_calendar_notes')
        if (savedNotes) {
          setCalendarNotes(JSON.parse(savedNotes))
        }

        // Connection effectiveType where supported
        const nav = typeof navigator !== 'undefined' ? (navigator as unknown as { connection?: { effectiveType?: string } }) : null
        if (nav?.connection?.effectiveType) {
          setNetworkType(nav.connection.effectiveType.toUpperCase())
        }
      } catch {
        // localStorage security error or disabled
      }
    }, 0)

    return () => clearTimeout(timer)
  }, [])

  // Audio initialization
  useEffect(() => {
    if (typeof window === 'undefined') return

    const audio = new Audio()
    audio.preload = 'none'
    audioRef.current = audio

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration)
      }
    }

    const handleEnded = () => {
      nextTrackRef.current()
    }

    const handleError = () => {
      setIsPlaying(false)
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    return () => {
      audio.pause()
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
    }
  }, [])

  // Volume sync to audio element
  useEffect(() => {
    if (audioRef.current) {
      const effectiveVolume = isMuted ? 0 : volume / 100
      audioRef.current.volume = effectiveVolume
    }
  }, [volume, isMuted])

  // Brightness setter with bounds
  const setBrightness = (val: number) => {
    const clamped = Math.max(20, Math.min(100, Math.round(val)))
    setBrightnessState(clamped)
    try {
      localStorage.setItem('cc_brightness', clamped.toString())
    } catch {
      // Ignored
    }
  }

  // Volume setter
  const setVolume = (val: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(val)))
    setVolumeState(clamped)
    if (clamped > 0 && isMuted) {
      setIsMuted(false)
      try {
        localStorage.setItem('cc_muted', 'false')
      } catch {
        // Ignored
      }
    }
    try {
      localStorage.setItem('cc_volume', clamped.toString())
    } catch {
      // Ignored
    }
  }

  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev
      try {
        localStorage.setItem('cc_muted', next.toString())
      } catch {
        // Ignored
      }
      return next
    })
  }

  // Simulated offline toggle
  const toggleSimulatedOffline = () => {
    setIsSimulatedOffline((prev) => {
      const next = !prev
      try {
        localStorage.setItem('cc_sim_offline', next.toString())
      } catch {
        // Ignored
      }
      return next
    })
  }

  // Focus toggle
  const toggleFocus = () => {
    setIsFocusOn((prev) => {
      const next = !prev
      try {
        localStorage.setItem('cc_focus', next.toString())
      } catch {
        // Ignored
      }
      return next
    })
  }

  // Decorative toggles
  const toggleBluetooth = () => setIsBluetoothOn((prev) => !prev)
  const toggleAirDrop = () => setIsAirDropOn((prev) => !prev)
  const toggleCellular = () => setIsCellularOn((prev) => !prev)
  const toggleFlashlight = () => setIsFlashlightOn((prev) => !prev)

  // Music controls (Web Audio ambient synth fallback if MP3 not found)
  const playSynthesizerFallback = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        audioCtxRef.current = new AudioContextClass()
      }
      const ctx = audioCtxRef.current
      if (ctx.state === 'suspended') {
        ctx.resume()
      }
      if (synthOscRef.current) {
        synthOscRef.current.stop()
        synthOscRef.current.disconnect()
      }
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      // Pleasant ambient F# major chord tone
      osc.frequency.setValueAtTime(220, ctx.currentTime)
      gain.gain.setValueAtTime((volume / 100) * 0.08, ctx.currentTime)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      synthOscRef.current = osc
    } catch {
      // AudioContext disallowed before user interaction
    }
  }, [volume])

  const stopSynthesizerFallback = useCallback(() => {
    try {
      if (synthOscRef.current) {
        synthOscRef.current.stop()
        synthOscRef.current.disconnect()
        synthOscRef.current = null
      }
    } catch {
      // Ignored
    }
  }, [])

  const currentTrack = tracks[currentTrackIndex] || tracks[0]

  const togglePlayPause = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      stopSynthesizerFallback()
      setIsPlaying(false)
    } else {
      audioRef.current.src = currentTrack.src
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true)
        })
        .catch(() => {
          // Local mp3 file not found in /public/audio, use relaxing synth fallback
          playSynthesizerFallback()
          setIsPlaying(true)
        })
    }
  }

  const nextTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length)
  }, [tracks.length])

  const prevTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length)
  }, [tracks.length])

  useEffect(() => {
    nextTrackRef.current = nextTrack
  }, [nextTrack])

  // Track change sync effect
  useEffect(() => {
    if (!audioRef.current) return
    const track = tracks[currentTrackIndex] || tracks[0]
    audioRef.current.src = track.src
    if (isPlaying) {
      audioRef.current.play().catch(() => playSynthesizerFallback())
    }
  }, [currentTrackIndex, isPlaying, tracks, playSynthesizerFallback])

  const seekTrack = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  // Calendar Notes
  const saveCalendarNote = (dateKey: string, note: string) => {
    setCalendarNotes((prev) => {
      const updated = { ...prev, [dateKey]: note }
      try {
        localStorage.setItem('cc_calendar_notes', JSON.stringify(updated))
      } catch {
        // Ignored
      }
      return updated
    })
  }

  const deleteCalendarNote = (dateKey: string) => {
    setCalendarNotes((prev) => {
      const updated = { ...prev }
      delete updated[dateKey]
      try {
        localStorage.setItem('cc_calendar_notes', JSON.stringify(updated))
      } catch {
        // Ignored
      }
      return updated
    })
  }

  return (
    <ControlCenterContext.Provider
      value={{
        isDesktopControlCenterOpen,
        setDesktopControlCenterOpen,
        isMobileControlCenterOpen,
        setMobileControlCenterOpen,
        isCalendarModalOpen,
        setCalendarModalOpen,

        isRealOnline,
        isSimulatedOffline,
        toggleSimulatedOffline,
        networkType,
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
        toggleMute,
        isFocusOn,
        toggleFocus,
        isFlashlightOn,
        toggleFlashlight,

        homeTheme,
        toggleHomeTheme,

        tracks,
        currentTrackIndex,
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        togglePlayPause,
        nextTrack,
        prevTrack,
        seekTrack,

        calendarNotes,
        saveCalendarNote,
        deleteCalendarNote,
      }}
    >
      {children}
    </ControlCenterContext.Provider>
  )
}

export function useControlCenter() {
  const context = useContext(ControlCenterContext)
  if (!context) {
    throw new Error('useControlCenter must be used within a ControlCenterProvider')
  }
  return context
}
