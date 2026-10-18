# Audio Files for Control Center Music Player

Place your local audio tracks in this directory:
- `track1.mp3`: Default track 1 (e.g. "Midnight Coding")
- `track2.mp3`: Default track 2 (e.g. "Silicon Sunset")

You can customize track titles, artist names, albums, and Spotify profile links in:
`src/components/control-center/useControlCenter.tsx`

If no MP3 files are present, the player gracefully falls back to an in-browser Web Audio API ambient synthesizer chime when play is clicked!
