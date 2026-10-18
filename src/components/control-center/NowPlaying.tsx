'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, SkipBack, SkipForward, ExternalLink, LogIn, Disc3 } from 'lucide-react'
import { useControlCenter } from './useControlCenter'

interface NowPlayingProps {
  compact?: boolean
}

function formatTime(seconds: number) {
  if (isNaN(seconds) || seconds < 0) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

export default function NowPlaying({ compact = false }: NowPlayingProps) {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlayPause,
    nextTrack,
    prevTrack,
    seekTrack,
    isSpotifyConnected,
    spotifyAuthType,
    spotifyEmbedUrl,
    setSpotifyModalOpen,
  } = useControlCenter()

  // 1. DISCONNECTED STATE: User must authenticate first (no preconfigured songs)
  if (!isSpotifyConnected) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          width: '100%',
          padding: compact ? '8px 4px' : '12px 6px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            width: '100%',
          }}
        >
          {/* Spotify Logo Avatar */}
          <div
            style={{
              width: compact ? 42 : 48,
              height: compact ? 42 : 48,
              borderRadius: 12,
              backgroundColor: 'rgba(30, 215, 96, 0.14)',
              border: '1px solid rgba(30, 215, 96, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1db954',
              flexShrink: 0,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
          </div>

          {/* Description */}
          <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>
              Spotify Music
            </div>
            <div
              style={{
                fontSize: 11,
                color: 'rgba(255, 255, 255, 0.6)',
                marginTop: 2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Authenticate to play songs here
            </div>
          </div>
        </div>

        {/* Connect Button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setSpotifyModalOpen(true)}
          style={{
            width: '100%',
            padding: '8px 14px',
            borderRadius: 10,
            backgroundColor: '#1db954',
            border: 'none',
            color: '#000000',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 7,
            boxShadow: '0 3px 12px rgba(30, 215, 96, 0.3)',
          }}
        >
          <LogIn size={14} strokeWidth={2.5} />
          <span>Connect Your Spotify</span>
        </motion.button>
      </div>
    )
  }

  // 2. CONNECTED VIA EMBED PLAYER
  if (spotifyAuthType === 'embed') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#1db954',
                boxShadow: '0 0 8px #1db954',
              }}
            />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#1db954' }}>
              Spotify Connected
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSpotifyModalOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.6)',
              fontSize: 11,
              cursor: 'pointer',
              padding: '2px 4px',
            }}
          >
            Change
          </button>
        </div>

        <iframe
          src={
            spotifyEmbedUrl ||
            'https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?utm_source=generator&theme=0'
          }
          width="100%"
          height={compact ? '80' : '152'}
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          style={{ borderRadius: 12 }}
          title="Spotify Web Player"
        />
      </div>
    )
  }

  // 3. CONNECTED VIA SPOTIFY OAUTH
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    seekTrack(clickRatio * duration)
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: compact ? 8 : 12,
        width: '100%',
      }}
    >
      {/* Top: Artwork + Meta */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Album Artwork */}
        <div
          style={{
            width: compact ? 44 : 52,
            height: compact ? 44 : 52,
            borderRadius: 10,
            overflow: 'hidden',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          {currentTrack?.coverUrl ? (
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <Disc3 size={22} color="#1db954" />
          )}
        </div>

        {/* Track Title & Artist */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#ffffff',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              letterSpacing: '-0.01em',
            }}
          >
            {currentTrack?.title || 'No Track Active'}
          </div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.55)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              marginTop: 2,
            }}
          >
            {currentTrack?.artist || 'Play a track on your Spotify app'}
          </div>
        </div>

        {/* Status / Link Button */}
        <button
          type="button"
          onClick={() => setSpotifyModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '4px 8px',
            borderRadius: 8,
            backgroundColor: 'rgba(30, 215, 96, 0.15)',
            border: '1px solid rgba(30, 215, 96, 0.3)',
            color: '#1ed760',
            fontSize: 11,
            fontWeight: 600,
            cursor: 'pointer',
            flexShrink: 0,
          }}
          title="Spotify Account Settings"
        >
          <span>Spotify</span>
          <ExternalLink size={10} strokeWidth={2.5} />
        </button>
      </div>

      {/* Progress Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div
          onClick={handleProgressBarClick}
          style={{
            position: 'relative',
            width: '100%',
            height: 4,
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            cursor: 'pointer',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${progressPercent}%`,
              height: '100%',
              backgroundColor: '#1db954',
              borderRadius: 2,
              transition: 'width 0.2s linear',
            }}
          />
        </div>

        {/* Timestamps */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 10,
            color: 'rgba(255, 255, 255, 0.45)',
            fontFeatureSettings: '"tnum"',
          }}
        >
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Playback Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
        }}
      >
        <button
          type="button"
          onClick={prevTrack}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.8)',
            cursor: 'pointer',
            padding: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Previous Track"
        >
          <SkipBack size={16} />
        </button>

        <motion.button
          type="button"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={togglePlayPause}
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            border: 'none',
            color: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
          }}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause size={18} fill="#000000" />
          ) : (
            <Play size={18} fill="#000000" style={{ marginLeft: 2 }} />
          )}
        </motion.button>

        <button
          type="button"
          onClick={nextTrack}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.8)',
            cursor: 'pointer',
            padding: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Next Track"
        >
          <SkipForward size={16} />
        </button>
      </div>
    </div>
  )
}
