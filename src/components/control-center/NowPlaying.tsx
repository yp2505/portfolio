'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, SkipBack, SkipForward, Music, ExternalLink } from 'lucide-react'
import { useControlCenter, SPOTIFY_PROFILE_URL } from './useControlCenter'

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
  } = useControlCenter()

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
          {currentTrack.coverUrl ? (
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <Music size={22} color="rgba(255,255,255,0.7)" />
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
            {currentTrack.title}
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
            {currentTrack.artist}
          </div>
        </div>

        {/* Spotify Link Button */}
        <a
          href={SPOTIFY_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          title="Open Spotify"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '4px 8px',
            borderRadius: 8,
            backgroundColor: 'rgba(30, 215, 96, 0.15)',
            border: '1px solid rgba(30, 215, 96, 0.3)',
            color: '#1ed760',
            textDecoration: 'none',
            fontSize: 11,
            fontWeight: 600,
            flexShrink: 0,
            transition: 'all 0.15s ease',
          }}
        >
          <span>Spotify</span>
          <ExternalLink size={10} strokeWidth={2.5} />
        </a>
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
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              width: `${progressPercent}%`,
              backgroundColor: '#ffffff',
              borderRadius: 2,
              transition: 'width 0.15s linear',
            }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 10,
            color: 'rgba(255, 255, 255, 0.45)',
            fontFamily: "'JetBrains Mono', monospace",
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
        <motion.button
          type="button"
          whileTap={{ scale: 0.85 }}
          onClick={prevTrack}
          style={{
            background: 'none',
            border: 'none',
            padding: 4,
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Previous track"
        >
          <SkipBack size={18} fill="currentColor" />
        </motion.button>

        <motion.button
          type="button"
          whileTap={{ scale: 0.88 }}
          onClick={togglePlayPause}
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            border: 'none',
            color: '#1c1c1e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause size={17} fill="currentColor" />
          ) : (
            <Play size={17} fill="currentColor" style={{ marginLeft: 2 }} />
          )}
        </motion.button>

        <motion.button
          type="button"
          whileTap={{ scale: 0.85 }}
          onClick={nextTrack}
          style={{
            background: 'none',
            border: 'none',
            padding: 4,
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Next track"
        >
          <SkipForward size={18} fill="currentColor" />
        </motion.button>
      </div>
    </div>
  )
}
