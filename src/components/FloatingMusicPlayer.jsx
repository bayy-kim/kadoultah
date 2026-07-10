'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Howl } from 'howler'
import { Play, Pause, SkipForward, SkipBack, X, Music } from 'lucide-react'
import { SONGS } from '../config/content'

// BroadcastChannel untuk sinkron ke aurora-night.html
const BC = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('music-sync') : null

let _ownTs = 0

function broadcast(state) {
  _ownTs = Date.now()
  if (BC) BC.postMessage(state)
  localStorage.setItem('music-state', JSON.stringify({ ...state, ts: _ownTs }))
}

export default function FloatingMusicPlayer({ autoPlay = false }) {
  const [isOpen, setIsOpen] = useState(false)
  const [songIndex, setSongIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const howlerRef = useRef(null)
  const progressInterval = useRef(null)
  const currentSong = SONGS[songIndex]

  // Refs for polling (always fresh)
  const songIndexRef = useRef(songIndex)
  const isPlayingRef = useRef(isPlaying)
  songIndexRef.current = songIndex
  isPlayingRef.current = isPlaying

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (howlerRef.current) howlerRef.current.unload()
      clearInterval(progressInterval.current)
      broadcast({ type: 'stop', songIndex: 0, seek: 0 })
    }
  }, [])

  // Poll localStorage for external changes (from aurora page)
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const raw = localStorage.getItem('music-state')
        if (!raw) return
        const saved = JSON.parse(raw)
        if (!saved || saved.songIndex === undefined) return
        if (saved.ts && saved.ts <= _ownTs) return

        // External change detected!
        _ownTs = saved.ts

        const newIdx = saved.songIndex
        const h = howlerRef.current
        const curIdx = songIndexRef.current
        const curPlaying = isPlayingRef.current

        if (newIdx !== curIdx) {
          // Different song — just update state, useEffect will handle loading
          setSongIndex(newIdx)
        }

        const targetPlaying = saved.type === 'play'
        if (targetPlaying !== curPlaying && h) {
          if (targetPlaying) {
            h.play()
            setIsPlaying(true)
          } else {
            h.pause()
          }
        }
      } catch (e) {}
    }, 600)

    return () => clearInterval(interval)
  }, []) // Only mount once

  // Load & play when song changes
  useEffect(() => {
    if (howlerRef.current) {
      howlerRef.current.unload()
      clearInterval(progressInterval.current)
    }

    broadcast({ type: 'songchange', songIndex })

    const sound = new Howl({
      src: [currentSong.src],
      html5: true,
      preload: true,
      onload: () => setDuration(sound.duration()),
      onplay: () => { setIsPlaying(true); updateProgress(); broadcast({ type: 'play', songIndex }) },
      onpause: () => { setIsPlaying(false); clearInterval(progressInterval.current); broadcast({ type: 'pause', songIndex, seek: howlerRef.current?.seek() || 0 }) },
      onend: () => {
        clearInterval(progressInterval.current)
        setProgress(0)
        // Don't setIsPlaying(false) — keeps true so next song auto-plays
        broadcast({ type: 'pause', songIndex, seek: 0 })
        handleNext()
      },
      onstop: () => {
        setIsPlaying(false)
        clearInterval(progressInterval.current)
        setProgress(0)
        broadcast({ type: 'stop', songIndex, seek: 0 })
      },
    })

    howlerRef.current = sound
    if (isPlaying) sound.play()

    return () => {
      clearInterval(progressInterval.current)
    }
  }, [songIndex])

  const updateProgress = () => {
    clearInterval(progressInterval.current)
    progressInterval.current = setInterval(() => {
      const seek = howlerRef.current?.seek() || 0
      setProgress(seek)
    }, 500)
  }

  const togglePlay = useCallback(() => {
    if (!howlerRef.current) return
    if (isPlaying) {
      howlerRef.current.pause()
    } else {
      howlerRef.current.play()
    }
  }, [isPlaying])

  const handleSeek = (e) => {
    if (!howlerRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    const pos = pct * duration
    howlerRef.current.seek(pos)
    setProgress(pos)
    broadcast({ type: 'seek', songIndex, seek: pos })
  }

  const handlePrev = () => {
    const current = howlerRef.current?.seek() || 0
    if (current > 3) {
      howlerRef.current?.seek(0)
      setProgress(0)
      broadcast({ type: 'seek', songIndex, seek: 0 })
    } else {
      setSongIndex((i) => (i === 0 ? SONGS.length - 1 : i - 1))
    }
  }

  const handleNext = () => {
    setSongIndex((i) => (i === SONGS.length - 1 ? 0 : i + 1))
  }

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const posterGrad = `linear-gradient(135deg, ${currentSong.poster}, ${currentSong.color})`

  return (
    <>
      {/* Circular trigger button */}
      <button
        className="music-trigger"
        onClick={() => setIsOpen(true)}
        aria-label="Open music player"
      >
        <Music size={22} />
      </button>

      {/* Expanded overlay */}
      {isOpen && (
        <div className="music-overlay" onClick={() => setIsOpen(false)}>
          {/* Blur backdrop */}
          <div className="music-backdrop" />

          {/* Card */}
          <div
            className="music-card"
            onClick={(e) => e.stopPropagation()}
            style={{ '--music-color': currentSong.color }}
          >
            {/* Close button */}
            <button className="music-close" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>

            {/* Poster */}
            <div className="music-poster" style={{ background: posterGrad }}>
              <div className="music-poster-icon">🎵</div>
            </div>

            {/* Info */}
            <div className="music-info">
              <h3 className="music-title">{currentSong.title}</h3>
              <p className="music-artist">{currentSong.artist}</p>
            </div>

            {/* Progress bar */}
            <div className="music-progress-wrap">
              <div className="music-progress" onClick={handleSeek}>
                <div
                  className="music-progress-fill"
                  style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }}
                />
                <div
                  className="music-progress-thumb"
                  style={{ left: `${duration ? (progress / duration) * 100 : 0}%` }}
                />
              </div>
              <div className="music-time">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="music-controls">
              <button className="mc-btn" onClick={handlePrev} title="Previous">
                <SkipBack size={20} />
              </button>
              <button className="mc-btn mc-play" onClick={togglePlay}>
                {isPlaying ? <Pause size={28} /> : <Play size={28} />}
              </button>
              <button className="mc-btn" onClick={handleNext} title="Next">
                <SkipForward size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}