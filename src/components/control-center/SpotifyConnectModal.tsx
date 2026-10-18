'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertCircle, LogIn, Check, Sparkles } from 'lucide-react'
import { useControlCenter } from './useControlCenter'

const PRESET_PLAYLISTS = [
  {
    title: "Today's Top Hits",
    url: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M',
    desc: 'The biggest hits right now',
  },
  {
    title: 'Lofi Beats',
    url: 'https://open.spotify.com/playlist/37i9dQZF1DXdLEN7aqioXM',
    desc: 'Chill instrumental beats to code & relax',
  },
  {
    title: 'Deep Focus',
    url: 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ',
    desc: 'Ambient & atmospheric study sessions',
  },
]

export default function SpotifyConnectModal() {
  const {
    isSpotifyModalOpen,
    setSpotifyModalOpen,
    isSpotifyConnected,
    connectSpotifyOAuth,
    connectSpotifyEmbed,
    disconnectSpotify,
    spotifyUser,
    spotifyAuthType,
  } = useControlCenter()

  const [activeTab, setActiveTab] = useState<'oauth' | 'embed'>('oauth')
  const [clientIdInput, setClientIdInput] = useState('')
  const [playlistInput, setPlaylistInput] = useState('')
  const [redirectOrigin, setRedirectOrigin] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const timer = setTimeout(() => {
        setRedirectOrigin(`${window.location.origin}${window.location.pathname}`)
        const savedClientId = localStorage.getItem('spotify_client_id') || ''
        setClientIdInput(savedClientId)
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleStartOAuth = async () => {
    setErrorMsg('')
    try {
      await connectSpotifyOAuth(clientIdInput.trim() || undefined)
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to initialize Spotify authentication')
    }
  }

  const handleConnectEmbed = (url: string) => {
    setErrorMsg('')
    if (!url.trim()) {
      setErrorMsg('Please paste a valid Spotify playlist, album, or track URL')
      return
    }
    connectSpotifyEmbed(url.trim())
    setSpotifyModalOpen(false)
  }

  return (
    <AnimatePresence>
      {isSpotifyModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSpotifyModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10010,
            backgroundColor: 'rgba(0, 0, 0, 0.72)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <motion.div
            initial={{ scale: 0.93, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.93, opacity: 0, y: 10 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 440,
              borderRadius: 24,
              backgroundColor: 'rgba(24, 24, 27, 0.95)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(30, 215, 96, 0.2)',
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              color: '#ffffff',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* Spotify Brand Glyph */}
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: '#1db954',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#000000',
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                  </svg>
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
                    {isSpotifyConnected ? 'Spotify Account' : 'Connect Spotify'}
                  </h3>
                  <p
                    style={{
                      fontSize: 12,
                      color: 'rgba(255, 255, 255, 0.6)',
                      margin: 0,
                      marginTop: 2,
                    }}
                  >
                    Stream and control music directly from this portfolio
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSpotifyModalOpen(false)}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Error message */}
            {errorMsg && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  borderRadius: 10,
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  fontSize: 12,
                  color: '#f87171',
                }}
              >
                <AlertCircle size={15} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Connected State View */}
            {isSpotifyConnected ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                  padding: 16,
                  borderRadius: 16,
                  backgroundColor: 'rgba(30, 215, 96, 0.08)',
                  border: '1px solid rgba(30, 215, 96, 0.25)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: '#1db954',
                      boxShadow: '0 0 10px #1db954',
                    }}
                  />
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#1db954' }}>
                    Connected ({spotifyAuthType === 'oauth' ? 'Spotify OAuth' : 'Spotify Embed Player'})
                  </span>
                </div>

                {spotifyUser?.displayName && (
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>
                    Signed in as: <strong>{spotifyUser.displayName}</strong>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  <button
                    type="button"
                    onClick={() => {
                      disconnectSpotify()
                      setSpotifyModalOpen(false)
                    }}
                    style={{
                      flex: 1,
                      padding: '8px 14px',
                      borderRadius: 10,
                      backgroundColor: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#f87171',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Disconnect Account
                  </button>
                  <button
                    type="button"
                    onClick={() => setSpotifyModalOpen(false)}
                    style={{
                      flex: 1,
                      padding: '8px 14px',
                      borderRadius: 10,
                      backgroundColor: '#1db954',
                      border: 'none',
                      color: '#000000',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Method Tabs */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: 12,
                    padding: 3,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setActiveTab('oauth')}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 10,
                      border: 'none',
                      backgroundColor: activeTab === 'oauth' ? '#1db954' : 'transparent',
                      color: activeTab === 'oauth' ? '#000000' : 'rgba(255, 255, 255, 0.75)',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    Spotify Login (OAuth)
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('embed')}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 10,
                      border: 'none',
                      backgroundColor: activeTab === 'embed' ? '#1db954' : 'transparent',
                      color: activeTab === 'embed' ? '#000000' : 'rgba(255, 255, 255, 0.75)',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    Instant Player (No Setup)
                  </button>
                </div>

                {/* Tab 1: OAuth PKCE Flow */}
                {activeTab === 'oauth' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <p style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.5, margin: 0 }}>
                      Authenticate with your Spotify account to control playback and view your real currently playing tracks.
                    </p>

                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: 11,
                          fontWeight: 600,
                          color: 'rgba(255, 255, 255, 0.65)',
                          marginBottom: 6,
                        }}
                      >
                        Spotify Client ID (Optional if set in .env.local)
                      </label>
                      <input
                        type="text"
                        value={clientIdInput}
                        onChange={(e) => setClientIdInput(e.target.value)}
                        placeholder="e.g. 74d2b... (leave blank to use default)"
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: 10,
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 255, 255, 0.16)',
                          color: '#ffffff',
                          fontSize: 12,
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                      <div
                        style={{
                          marginTop: 6,
                          fontSize: 10,
                          color: 'rgba(255, 255, 255, 0.45)',
                          lineHeight: 1.4,
                        }}
                      >
                        Redirect URI for your Spotify App:{' '}
                        <code style={{ color: '#1db954' }}>{redirectOrigin}</code>
                      </div>
                    </div>

                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.96 }}
                      onClick={handleStartOAuth}
                      style={{
                        width: '100%',
                        padding: '12px 18px',
                        borderRadius: 12,
                        backgroundColor: '#1db954',
                        border: 'none',
                        color: '#000000',
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        boxShadow: '0 4px 16px rgba(30, 215, 96, 0.35)',
                      }}
                    >
                      <LogIn size={16} strokeWidth={2.5} />
                      <span>Authenticate with Spotify</span>
                    </motion.button>
                  </div>
                )}

                {/* Tab 2: Instant Spotify Embed / Playlist */}
                {activeTab === 'embed' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <p style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.5, margin: 0 }}>
                      No Spotify developer app needed. Paste any Spotify playlist, album, or track URL to stream music right now:
                    </p>

                    <div>
                      <input
                        type="text"
                        value={playlistInput}
                        onChange={(e) => setPlaylistInput(e.target.value)}
                        placeholder="https://open.spotify.com/playlist/..."
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: 10,
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 255, 255, 0.16)',
                          color: '#ffffff',
                          fontSize: 12,
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    {/* Presets */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>
                        Or pick a curated collection:
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {PRESET_PLAYLISTS.map((preset) => (
                          <button
                            key={preset.title}
                            type="button"
                            onClick={() => handleConnectEmbed(preset.url)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '8px 12px',
                              borderRadius: 10,
                              backgroundColor: 'rgba(255, 255, 255, 0.06)',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              color: '#ffffff',
                              cursor: 'pointer',
                              textAlign: 'left',
                              transition: 'background-color 0.15s ease',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)' }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)' }}
                          >
                            <div>
                              <div style={{ fontSize: 12, fontWeight: 600 }}>{preset.title}</div>
                              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>
                                {preset.desc}
                              </div>
                            </div>
                            <Sparkles size={14} color="#1db954" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleConnectEmbed(playlistInput)}
                      style={{
                        width: '100%',
                        padding: '10px 16px',
                        borderRadius: 12,
                        backgroundColor: '#1db954',
                        border: 'none',
                        color: '#000000',
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                      }}
                    >
                      <Check size={16} strokeWidth={2.5} />
                      <span>Connect Selected Stream</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
