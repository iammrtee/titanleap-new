'use client'
import { useEffect, useRef, useState } from 'react'

export default function Loader() {
  const [done, setDone] = useState(false)
  const finishedRef = useRef(false)
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    document.body.style.overflow = 'hidden'

    const finish = () => {
      if (finishedRef.current) return
      finishedRef.current = true
      setDone(true)
      document.body.style.overflow = ''
      document.body.classList.add('site-ready')
    }

    // Pick source based on screen width
    const isMobile = window.matchMedia('(max-width: 680px)').matches
    video.src = isMobile ? '/intro-mobile.mp4' : '/intro-desktop.mp4'
    video.muted = true
    video.load() // Force reload — critical for iOS on refresh

    let playStarted = false
    const tryPlay = () => {
      if (playStarted) return
      playStarted = true
      video.play().catch(() => {
        // Still blocked — retry once after a short delay (iOS sometimes needs a tick)
        setTimeout(() => {
          video.play().catch(finish)
        }, 200)
      })
    }

    // canplaythrough = enough data buffered to play without stalling
    video.addEventListener('canplaythrough', tryPlay, { once: true })
    // canplay fires earlier — only use it if we already have enough data (readyState 3+)
    video.addEventListener('canplay', () => {
      if (video.readyState >= 3) tryPlay()
    }, { once: true })
    video.addEventListener('ended', finish)
    video.addEventListener('error', finish)

    // Safety net: never block the site for more than 10s
    const bailout = setTimeout(finish, 10000)

    return () => {
      clearTimeout(bailout)
      video.removeEventListener('ended', finish)
      video.removeEventListener('error', finish)
    }
  }, [])

  return (
    <div id="loader" className={done ? 'done' : ''}>
      <video
        ref={videoRef}
        playsInline
        preload="auto"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
      />
    </div>
  )
}
