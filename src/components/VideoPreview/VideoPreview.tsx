import { useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { useContainerScale } from '../../hooks/useContainerScale'
import { VIDEO_FILTERS } from '../../utils/filters'
import type { TextOverlay, Watermark } from '../../types'

interface VideoPreviewProps {
  videoUrl: string
  trimStart?: number
  trimEnd?: number
  textOverlay?: TextOverlay
  filterId?: string
  watermark?: Watermark | null
}

const EXPORT_WIDTH = 1080

const WATERMARK_POSITION_CLASSES: Record<Watermark['position'], string> = {
  'top-left': 'top-3 left-3',
  'top-right': 'top-3 right-3',
  'bottom-left': 'bottom-3 left-3',
  'bottom-right': 'bottom-3 right-3',
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function VideoPreview({ videoUrl, trimStart, trimEnd, textOverlay, filterId, watermark }: VideoPreviewProps) {
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
  const cssFilter = VIDEO_FILTERS.find((f) => f.id === filterId)?.cssFilter ?? 'none'

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
        className="relative aspect-[9/16] max-h-[70vh] mx-auto rounded-2xl overflow-hidden bg-black border border-zinc-800/50 shadow-2xl shadow-black/50"
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
          style={{ filter: cssFilter }}
        />
        {watermark && (
          <img
            src={watermark.imageUrl}
            alt="Watermark"
            className={`absolute w-auto h-auto pointer-events-none ${WATERMARK_POSITION_CLASSES[watermark.position]}`}
            style={{ maxWidth: `${(watermark.size / 100) * scale * EXPORT_WIDTH}px`, opacity: watermark.opacity }}
          />
        )}
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
      <div className="text-center">
        <span className="text-[11px] text-zinc-500 bg-zinc-900/50 px-3 py-1 rounded-full mt-2 inline-block">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>
    </div>
  )
}
