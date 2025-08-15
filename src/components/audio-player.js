import React, { useRef, useEffect, useState } from 'react'

const AudioPlayer = ({ url, isPlaying, onPlay, onPause, onEnded, onError }) => {
  const audioRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error('Audio play error:', error)
          onError?.(error)
        })
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, onError])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadStart = () => setIsLoading(true)
    const handleCanPlay = () => setIsLoading(false)
    const handleEnded = () => onEnded?.()
    const handleError = (error) => onError?.(error)

    audio.addEventListener('loadstart', handleLoadStart)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart)
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
    }
  }, [onEnded, onError])

  if (!url) return null

  return (
    <audio
      ref={audioRef}
      src={url}
      preload="metadata"
      style={{ display: 'none' }}
    />
  )
}

export default AudioPlayer
