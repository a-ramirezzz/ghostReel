import { useRef } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'

interface VideoTrimmerProps {
  videoUrl: string
  duration: number
  trimStart: number
  trimEnd: number
  onTrimChange: (start: number, end: number) => void
}

const MIN_GAP_SECONDS = 1

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function snap(value: number): number {
  return Math.round(value * 10) / 10
}

export function VideoTrimmer({ videoUrl, duration, trimStart, trimEnd, onTrimChange }: VideoTrimmerProps) {
  const barRef = useRef<HTMLDivElement>(null)
  const hiddenVideoRef = useRef<HTMLVideoElement>(null)

  const positionToTime = (clientX: number): number => {
    const bar = barRef.current
    if (!bar || duration <= 0) return 0
    const rect = bar.getBoundingClientRect()
    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1)
    return snap(ratio * duration)
  }

  const startDragging = (which: 'start' | 'end') => (event: ReactMouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()

    const anchorStart = trimStart
    const anchorEnd = trimEnd

    const handleMove = (moveEvent: MouseEvent) => {
      const time = positionToTime(moveEvent.clientX)
      if (which === 'start') {
        const newStart = snap(clamp(time, 0, anchorEnd - MIN_GAP_SECONDS))
        onTrimChange(newStart, anchorEnd)
      } else {
        const newEnd = snap(clamp(time, anchorStart + MIN_GAP_SECONDS, duration))
        onTrimChange(anchorStart, newEnd)
      }
    }

    const handleUp = () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)
  }

  const handleBarClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    const time = positionToTime(event.clientX)
    if (hiddenVideoRef.current) {
      hiddenVideoRef.current.currentTime = time
    }
  }

  const startPct = duration > 0 ? (trimStart / duration) * 100 : 0
  const endPct = duration > 0 ? (trimEnd / duration) * 100 : 0

  return (
    <section>
      <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">Recortar video</h3>

      <video ref={hiddenVideoRef} src={videoUrl} muted className="hidden" />

      <div ref={barRef} onClick={handleBarClick} className="h-2 bg-zinc-800 rounded-full relative cursor-pointer">
        <div
          className="absolute top-0 h-full bg-violet-500/60 rounded-full pointer-events-none"
          style={{ left: `${startPct}%`, width: `${endPct - startPct}%` }}
        />
        <div
          onMouseDown={startDragging('start')}
          onClick={(event) => event.stopPropagation()}
          className="w-4 h-4 rounded-full bg-violet-500 border-2 border-zinc-950 absolute top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing shadow-lg"
          style={{ left: `calc(${startPct}% - 0.5rem)` }}
        />
        <div
          onMouseDown={startDragging('end')}
          onClick={(event) => event.stopPropagation()}
          className="w-4 h-4 rounded-full bg-violet-500 border-2 border-zinc-950 absolute top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing shadow-lg"
          style={{ left: `calc(${endPct}% - 0.5rem)` }}
        />
      </div>

      <div className="flex justify-between mt-2">
        <span className="text-xs text-zinc-400">Inicio: {formatTime(trimStart)}</span>
        <span className="text-xs text-zinc-400">Fin: {formatTime(trimEnd)}</span>
      </div>

      <p className="text-xs text-zinc-500 text-center mt-1">Duración: {formatTime(trimEnd - trimStart)}</p>
    </section>
  )
}
