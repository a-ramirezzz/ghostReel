import { useRef, useState } from 'react'

interface VideoPreviewProps {
  videoUrl: string
  trimStart?: number
  trimEnd?: number
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function VideoPreview({ videoUrl, trimStart, trimEnd }: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const handleTimeUpdate = () => {
    const video = videoRef.current
    if (!video) return

    if (trimStart !== undefined && trimEnd !== undefined && video.currentTime >= trimEnd) {
      video.currentTime = trimStart
    }

    setCurrentTime(video.currentTime)
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleLoadedData = () => {
    if (videoRef.current && trimStart !== undefined) {
      videoRef.current.currentTime = trimStart
    }
  }

  return (
    <div>
      <div className="aspect-[9/16] max-h-[70vh] mx-auto rounded-2xl overflow-hidden bg-black border border-zinc-800">
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          autoPlay
          muted
          loop
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onLoadedData={handleLoadedData}
          className="w-full h-full object-contain"
        />
      </div>
      <p className="text-xs text-zinc-500 text-center mt-2">
        {formatTime(currentTime)} / {formatTime(duration)}
      </p>
    </div>
  )
}
