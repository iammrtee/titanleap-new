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

    // Start playing as soon as any data is available
    video.addEventListener('canplay', tryPlay, { once: true })
    video.addEventListener('canplaythrough', tryPlay, { once: true })
    video.addEventListener('ended', finish)
    video.addEventListener('error', finish)

    // Hard cap: never block the site for more than 1s
    const bailout = setTimeout(finish, 1000)

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
