'use client'
import { useEffect, useRef, useState } from 'react'

export default function Loader() {
  const [done, setDone] = useState(false)
  const [src, setSrc] = useState('/intro-desktop.mp4')
  const videoRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(max-width: 680px)').matches) {
      setSrc('/intro-mobile.mp4')
    }
    document.body.style.overflow = 'hidden'
  }, [])

  // Fire .play() as soon as src is set — required for iOS autoplay
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = true
    const attempt = video.play()
    if (attempt !== undefined) {
      attempt.catch(() => {
        // If autoplay is blocked, just finish immediately
        finish()
      })
    }
  }, [src])

  const finish = () => {
    if (done) return
    setDone(true)
    document.body.style.overflow = ''
  }

  return (
    <div id="loader" className={done ? 'done' : ''}>
      <video
        ref={videoRef}
        key={src}
        muted
        playsInline
        preload="auto"
        onEnded={finish}
        onError={finish}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  )
}
