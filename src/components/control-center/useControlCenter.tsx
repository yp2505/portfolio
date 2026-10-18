'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
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
  coverUrl?: string
  spotifyUrl?: string
  durationMs?: number
}

export interface SpotifyUser {
  displayName?: string
  email?: string
  product?: string
  profileUrl?: string
  imageUrl?: string
}

interface ControlCenterContextType {
  // Panel states
  isDesktopControlCenterOpen: boolean
  setDesktopControlCenterOpen: (open: boolean | ((prev: boolean) => boolean)) => void
  isMobileControlCenterOpen: boolean
  setMobileControlCenterOpen: (open: boolean | ((prev: boolean) => boolean)) => void
  isCalendarModalOpen: boolean
  setCalendarModalOpen: (open: boolean | ((prev: boolean) => boolean)) => void

  // Spotify Authentication & State
  isSpotifyModalOpen: boolean
  setSpotifyModalOpen: (open: boolean | ((prev: boolean) => boolean)) => void
  isSpotifyConnected: boolean
  spotifyAuthType: 'oauth' | 'embed' | null
  spotifyUser: SpotifyUser | null
  spotifyEmbedUrl: string | null
  connectSpotifyOAuth: (clientId?: string) => Promise<void>
  connectSpotifyEmbed: (urlOrUri: string) => void
  disconnectSpotify: () => void

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
  currentTrack: Track | null
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

// Helpers for Spotify OAuth PKCE Flow
function generateRandomString(length: number): string {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  const values = crypto.getRandomValues(new Uint8Array(length))
  return Array.from(values)
    .map((x) => possible[x % possible.length])
    .join('')
}

async function sha256(plain: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  return window.crypto.subtle.digest('SHA-256', data)
}

function base64encode(input: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

// Parse Spotify URL to iframe embed URL
function toSpotifyEmbedUrl(input: string): string {
  const clean = input.trim()
  if (clean.includes('/embed/')) return clean

  // Handle open.spotify.com/playlist/ID, /album/ID, /track/ID
  const match = clean.match(/open\.spotify\.com\/(track|playlist|album|artist)\/([a-zA-Z0-9]+)/)
  if (match) {
    const [, type, id] = match
    return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`
  }

  // Handle spotify:playlist:ID etc
  const uriMatch = clean.match(/spotify:(track|playlist|album|artist):([a-zA-Z0-9]+)/)
  if (uriMatch) {
    const [, type, id] = uriMatch
    return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`
  }

  // Fallback to default Today's Top Hits playlist
  return 'https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?utm_source=generator&theme=0'
}

const ControlCenterContext = createContext<ControlCenterContextType | null>(null)

export function ControlCenterProvider({ children }: { children: ReactNode }) {
  const { homeTheme, toggleHomeTheme } = useHomeTheme()

  // Panel toggles
  const [isDesktopControlCenterOpen, setDesktopControlCenterOpen] = useState(false)
  const [isMobileControlCenterOpen, setMobileControlCenterOpen] = useState(false)
  const [isCalendarModalOpen, setCalendarModalOpen] = useState(false)
  const [isSpotifyModalOpen, setSpotifyModalOpen] = useState(false)

  // Spotify Authentication State
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false)
  const [spotifyAuthType, setSpotifyAuthType] = useState<'oauth' | 'embed' | null>(null)
  const [spotifyAccessToken, setSpotifyAccessToken] = useState<string | null>(null)
  const [spotifyUser, setSpotifyUser] = useState<SpotifyUser | null>(null)
  const [spotifyEmbedUrl, setSpotifyEmbedUrl] = useState<string | null>(null)

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

  // Music Player: NO hardcoded tracks by default!
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(180)

  // Calendar Notes: { 'YYYY-MM-DD': 'Note content' }
  const [calendarNotes, setCalendarNotes] = useState<Record<string, string>>({})

  // Spotify API Fetch Helper
  const fetchSpotifyWithAuth = useCallback(
    async (endpoint: string, method: string = 'GET', body?: unknown) => {
      const token = spotifyAccessToken || (typeof window !== 'undefined' ? localStorage.getItem('spotify_access_token') : null)
      if (!token) return null

      try {
        const res = await fetch(`https://api.spotify.com/v1${endpoint}`, {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: body ? JSON.stringify(body) : undefined,
        })

        if (res.status === 204) return true
        if (res.status === 401) {
          // Token expired
          setIsSpotifyConnected(false)
          setSpotifyAccessToken(null)
          try {
            localStorage.removeItem('spotify_access_token')
          } catch {}
          return null
        }
        return await res.json()
      } catch {
        return null
      }
    },
    [spotifyAccessToken]
  )

  // Fetch currently playing track from Spotify
  const refreshSpotifyPlayback = useCallback(async () => {
    const data = await fetchSpotifyWithAuth('/me/player/currently-playing')
    if (data?.item) {
      setCurrentTrack({
        id: data.item.id,
        title: data.item.name,
        artist: data.item.artists?.map((a: { name: string }) => a.name).join(', ') || 'Unknown Artist',
        album: data.item.album?.name || 'Spotify',
        coverUrl: data.item.album?.images?.[0]?.url,
        spotifyUrl: data.item.external_urls?.spotify,
        durationMs: data.item.duration_ms,
      })
      setIsPlaying(data.is_playing || false)
      if (data.progress_ms && data.item.duration_ms) {
        setCurrentTime(Math.floor(data.progress_ms / 1000))
        setDuration(Math.floor(data.item.duration_ms / 1000))
      }
    } else {
      // Check recently played if nothing currently active
      const recent = await fetchSpotifyWithAuth('/me/player/recently-played?limit=1')
      if (recent?.items?.[0]?.track) {
        const track = recent.items[0].track
        setCurrentTrack({
          id: track.id,
          title: track.name,
          artist: track.artists?.map((a: { name: string }) => a.name).join(', ') || 'Unknown Artist',
          album: track.album?.name || 'Spotify',
          coverUrl: track.album?.images?.[0]?.url,
          spotifyUrl: track.external_urls?.spotify,
          durationMs: track.duration_ms,
        })
        setDuration(Math.floor(track.duration_ms / 1000))
        setIsPlaying(false)
      }
    }
  }, [fetchSpotifyWithAuth])

  // Hydration-safe initial state loading
  useEffect(() => {
    const timer = setTimeout(async () => {
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

        // Connection effectiveType
        const nav = typeof navigator !== 'undefined' ? (navigator as unknown as { connection?: { effectiveType?: string } }) : null
        if (nav?.connection?.effectiveType) {
          setNetworkType(nav.connection.effectiveType.toUpperCase())
        }

        // Restore Spotify State
        const savedAuthType = localStorage.getItem('spotify_auth_type') as 'oauth' | 'embed' | null
        const savedToken = localStorage.getItem('spotify_access_token')
        const savedEmbed = localStorage.getItem('spotify_embed_url')

        if (savedAuthType === 'embed' && savedEmbed) {
          setIsSpotifyConnected(true)
          setSpotifyAuthType('embed')
          setSpotifyEmbedUrl(savedEmbed)
        } else if (savedAuthType === 'oauth' && savedToken) {
          setIsSpotifyConnected(true)
          setSpotifyAuthType('oauth')
          setSpotifyAccessToken(savedToken)

          // Fetch Spotify user profile
          const userRes = await fetch('https://api.spotify.com/v1/me', {
            headers: { Authorization: `Bearer ${savedToken}` },
          })
          if (userRes.ok) {
            const userData = await userRes.json()
            setSpotifyUser({
              displayName: userData.display_name,
              email: userData.email,
              product: userData.product,
              profileUrl: userData.external_urls?.spotify,
              imageUrl: userData.images?.[0]?.url,
            })
          }
        }
      } catch {
        // localStorage security or disabled
      }
    }, 0)

    return () => clearTimeout(timer)
  }, [])

  // Handle Spotify OAuth Callback redirect (?code=...)
  useEffect(() => {
    if (typeof window === 'undefined') return

    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    if (!code) return

    const exchangeSpotifyCode = async () => {
      try {
        const codeVerifier = localStorage.getItem('spotify_code_verifier') || ''
        const clientId =
          localStorage.getItem('spotify_client_id') ||
          process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID ||
          '74d2b27160754881a7b4512e09880858'

        const redirectUri = `${window.location.origin}${window.location.pathname}`

        const body = new URLSearchParams({
          client_id: clientId,
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: redirectUri,
          code_verifier: codeVerifier,
        })

        const response = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: body,
        })

        if (!response.ok) {
          throw new Error('Failed to exchange Spotify authorization code')
        }

        const data = await response.json()
        const token = data.access_token

        localStorage.setItem('spotify_access_token', token)
        localStorage.setItem('spotify_auth_type', 'oauth')
        localStorage.setItem('spotify_connected', 'true')
        if (data.refresh_token) {
          localStorage.setItem('spotify_refresh_token', data.refresh_token)
        }

        // Clean the address bar
        window.history.replaceState({}, document.title, window.location.pathname)

        setSpotifyAccessToken(token)
        setSpotifyAuthType('oauth')
        setIsSpotifyConnected(true)

        // Fetch User profile
        const userRes = await fetch('https://api.spotify.com/v1/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (userRes.ok) {
          const userData = await userRes.json()
          setSpotifyUser({
            displayName: userData.display_name,
            email: userData.email,
            product: userData.product,
            profileUrl: userData.external_urls?.spotify,
            imageUrl: userData.images?.[0]?.url,
          })
        }
      } catch {
        // Fallback gracefully
      }
    }

    exchangeSpotifyCode()
  }, [])

  // Poll Spotify playback when OAuth is active
  useEffect(() => {
    if (!isSpotifyConnected || spotifyAuthType !== 'oauth') return

    const timer = setTimeout(() => {
      refreshSpotifyPlayback()
    }, 0)
    const interval = setInterval(refreshSpotifyPlayback, 6000)
    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [isSpotifyConnected, spotifyAuthType, refreshSpotifyPlayback])

  // Connect via Spotify OAuth (PKCE)
  const connectSpotifyOAuth = async (customClientId?: string) => {
    const clientId =
      customClientId?.trim() ||
      process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID ||
      '74d2b27160754881a7b4512e09880858'

    if (!clientId) {
      throw new Error('Please enter a Spotify Client ID')
    }

    try {
      localStorage.setItem('spotify_client_id', clientId)
    } catch {}

    const codeVerifier = generateRandomString(64)
    try {
      localStorage.setItem('spotify_code_verifier', codeVerifier)
    } catch {}

    const hashed = await sha256(codeVerifier)
    const codeChallenge = base64encode(hashed)

    const redirectUri = `${window.location.origin}${window.location.pathname}`
    const scope = [
      'user-read-currently-playing',
      'user-read-playback-state',
      'user-modify-playback-state',
      'user-read-recently-played',
      'user-read-email',
      'user-read-private',
    ].join(' ')

    const authUrl = new URL('https://accounts.spotify.com/authorize')
    authUrl.search = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      scope: scope,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      redirect_uri: redirectUri,
    }).toString()

    window.location.href = authUrl.toString()
  }

  // Connect via Spotify Embed / Playlist URL
  const connectSpotifyEmbed = (urlOrUri: string) => {
    const embedUrl = toSpotifyEmbedUrl(urlOrUri)
    setIsSpotifyConnected(true)
    setSpotifyAuthType('embed')
    setSpotifyEmbedUrl(embedUrl)

    try {
      localStorage.setItem('spotify_connected', 'true')
      localStorage.setItem('spotify_auth_type', 'embed')
      localStorage.setItem('spotify_embed_url', embedUrl)
    } catch {}
  }

  // Disconnect Spotify
  const disconnectSpotify = () => {
    setIsSpotifyConnected(false)
    setSpotifyAuthType(null)
    setSpotifyAccessToken(null)
    setSpotifyUser(null)
    setSpotifyEmbedUrl(null)
    setCurrentTrack(null)
    setIsPlaying(false)

    try {
      localStorage.removeItem('spotify_connected')
      localStorage.removeItem('spotify_auth_type')
      localStorage.removeItem('spotify_access_token')
      localStorage.removeItem('spotify_refresh_token')
      localStorage.removeItem('spotify_embed_url')
    } catch {}
  }

  // Player controls
  const togglePlayPause = async () => {
    if (spotifyAuthType === 'oauth') {
      if (isPlaying) {
        await fetchSpotifyWithAuth('/me/player/pause', 'PUT')
        setIsPlaying(false)
      } else {
        await fetchSpotifyWithAuth('/me/player/play', 'PUT')
        setIsPlaying(true)
      }
    } else {
      setIsPlaying((prev) => !prev)
    }
  }

  const nextTrack = async () => {
    if (spotifyAuthType === 'oauth') {
      await fetchSpotifyWithAuth('/me/player/next', 'POST')
      setTimeout(refreshSpotifyPlayback, 500)
    }
  }

  const prevTrack = async () => {
    if (spotifyAuthType === 'oauth') {
      await fetchSpotifyWithAuth('/me/player/previous', 'POST')
      setTimeout(refreshSpotifyPlayback, 500)
    }
  }

  const seekTrack = async (timeInSeconds: number) => {
    setCurrentTime(timeInSeconds)
    if (spotifyAuthType === 'oauth') {
      await fetchSpotifyWithAuth(`/me/player/seek?position_ms=${Math.floor(timeInSeconds * 1000)}`, 'PUT')
    }
  }

  // Brightness setter with bounds
  const setBrightness = (val: number) => {
    const clamped = Math.max(20, Math.min(100, Math.round(val)))
    setBrightnessState(clamped)
    try {
      localStorage.setItem('cc_brightness', clamped.toString())
    } catch {}
  }

  // Volume setter
  const setVolume = (val: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(val)))
    setVolumeState(clamped)
    if (clamped > 0 && isMuted) {
      setIsMuted(false)
      try {
        localStorage.setItem('cc_muted', 'false')
      } catch {}
    }
    try {
      localStorage.setItem('cc_volume', clamped.toString())
    } catch {}
  }

  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev
      try {
        localStorage.setItem('cc_muted', next.toString())
      } catch {}
      return next
    })
  }

  // Simulated offline toggle
  const toggleSimulatedOffline = () => {
    setIsSimulatedOffline((prev) => {
      const next = !prev
      try {
        localStorage.setItem('cc_sim_offline', next.toString())
      } catch {}
      return next
    })
  }

  // Focus toggle
  const toggleFocus = () => {
    setIsFocusOn((prev) => {
      const next = !prev
      try {
        localStorage.setItem('cc_focus', next.toString())
      } catch {}
      return next
    })
  }

  // Decorative toggles
  const toggleBluetooth = () => setIsBluetoothOn((prev) => !prev)
  const toggleAirDrop = () => setIsAirDropOn((prev) => !prev)
  const toggleCellular = () => setIsCellularOn((prev) => !prev)
  const toggleFlashlight = () => setIsFlashlightOn((prev) => !prev)

  // Calendar Notes
  const saveCalendarNote = (dateKey: string, note: string) => {
    setCalendarNotes((prev) => {
      const updated = { ...prev, [dateKey]: note }
      try {
        localStorage.setItem('cc_calendar_notes', JSON.stringify(updated))
      } catch {}
      return updated
    })
  }

  const deleteCalendarNote = (dateKey: string) => {
    setCalendarNotes((prev) => {
      const updated = { ...prev }
      delete updated[dateKey]
      try {
        localStorage.setItem('cc_calendar_notes', JSON.stringify(updated))
      } catch {}
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

        isSpotifyModalOpen,
        setSpotifyModalOpen,
        isSpotifyConnected,
        spotifyAuthType,
        spotifyUser,
        spotifyEmbedUrl,
        connectSpotifyOAuth,
        connectSpotifyEmbed,
        disconnectSpotify,

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
