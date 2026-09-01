import { useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { useContainerScale } from '../../hooks/useContainerScale'
import type { TextOverlay } from '../../types'

interface VideoPreviewProps {
  videoUrl: string
  trimStart?: number
  trimEnd?: number
  textOverlay?: TextOverlay
}

const EXPORT_WIDTH = 1080

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function VideoPreview({ videoUrl, trimStart, trimEnd, textOverlay }: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const scale = useContainerScale(containerRef, EXPORT_WIDTH)

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

  const showText = Boolean(textOverlay && textOverlay.text.trim().length > 0)

  let textStyle: CSSProperties = {}
  if (textOverlay && showText) {
    const scaledFontSize = textOverlay.fontSize * scale
    const scaledStrokeWidth = textOverlay.strokeWidth * scale

    textStyle = {
      fontFamily: textOverlay.fontFamily,
      fontSize: `${scaledFontSize}px`,
      color: textOverlay.color,
      textAlign: textOverlay.textAlign,
      lineHeight: textOverlay.lineHeight,
      padding: '0 8%',
      width: '100%',
      wordWrap: 'break-word',
      whiteSpace: 'pre-wrap',
    }

    if (textOverlay.strokeWidth > 0) {
      const sw = scaledStrokeWidth
      const sc = textOverlay.strokeColor
      textStyle.textShadow = `${sw}px ${sw}px 0 ${sc}, -${sw}px ${sw}px 0 ${sc}, ${sw}px -${sw}px 0 ${sc}, -${sw}px -${sw}px 0 ${sc}`
    }
  }

  return (
    <div>
      <div
        ref={containerRef}
        className="relative aspect-[9/16] max-h-[70vh] mx-auto rounded-2xl overflow-hidden bg-black border border-zinc-800"
      >
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
        {showText && textOverlay && (
          <div className="absolute inset-0 flex justify-center pointer-events-none overflow-hidden">
            <div
              className="absolute"
              style={{ top: `${textOverlay.positionY}%`, transform: 'translateY(-50%)', ...textStyle }}
            >
              {textOverlay.text}
            </div>
          </div>
        )}
      </div>
      <p className="text-xs text-zinc-500 text-center mt-2">
        {formatTime(currentTime)} / {formatTime(duration)}
      </p>
    </div>
  )
}
