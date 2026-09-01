import { useCallback, useRef, useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import type { VideoFile } from '../../types'

interface VideoUploaderProps {
  onVideoLoaded: (video: VideoFile) => void
}

const ACCEPTED_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']
const MAX_SIZE_BYTES = 200 * 1024 * 1024
const MAX_DURATION_SECONDS = 60

function formatFileSize(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function truncateName(name: string, maxLength = 30): string {
  if (name.length <= maxLength) return name
  return `${name.slice(0, maxLength - 3)}...`
}

function readVideoMetadata(url: string): Promise<{ duration: number; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.onloadedmetadata = () => {
      resolve({
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
      })
    }
    video.onerror = () => {
      reject(new Error('No se pudo leer el video'))
    }
    video.src = url
  })
}

export function VideoUploader({ onVideoLoaded }: VideoUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [videoFile, setVideoFile] = useState<VideoFile | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const objectUrlRef = useRef<string | null>(null)

  const processFile = useCallback(async (file: File) => {
    setError(null)

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Formato no soportado. Usa MP4, WebM o MOV.')
      return
    }

    if (file.size > MAX_SIZE_BYTES) {
      setError('El archivo supera el máximo de 200MB.')
      return
    }

    const url = URL.createObjectURL(file)

    try {
      const { duration, width, height } = await readVideoMetadata(url)

      if (duration > MAX_DURATION_SECONDS) {
        URL.revokeObjectURL(url)
        setError('El video supera la duración máxima de 60 segundos.')
        return
      }

      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
      }
      objectUrlRef.current = url

      const loaded: VideoFile = {
        file,
        url,
        name: file.name,
        size: file.size,
        duration,
        width,
        height,
      }

      setVideoFile(loaded)
      onVideoLoaded(loaded)
    } catch {
      URL.revokeObjectURL(url)
      setError('No se pudo leer el video. Intenta con otro archivo.')
    }
  }, [onVideoLoaded])

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      void processFile(file)
    }
    event.target.value = ''
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(false)
    const file = event.dataTransfer.files?.[0]
    if (file) {
      void processFile(file)
    }
  }

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(false)
  }

  const handleReset = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
    setVideoFile(null)
    setError(null)
  }

  if (videoFile) {
    return (
      <div className="w-full max-w-2xl mx-auto rounded-2xl border-2 border-zinc-700 p-8 flex flex-col items-center gap-4">
        <div className="w-full text-center">
          <p className="text-lg font-bold break-words">{truncateName(videoFile.name)}</p>
          <div className="mt-2 flex justify-center gap-4 text-sm text-zinc-400">
            <span>{formatFileSize(videoFile.size)}</span>
            <span>{formatDuration(videoFile.duration)}</span>
            <span>{videoFile.width} × {videoFile.height}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="text-sm px-4 py-2 rounded-lg border border-zinc-700 hover:border-zinc-500 transition-colors duration-200"
        >
          Cambiar video
        </button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-3">
      <div
        role="button"
        tabIndex={0}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click()
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`w-full cursor-pointer rounded-2xl border-2 border-dashed p-16 flex flex-col items-center justify-center gap-3 text-center transition-colors duration-200 ${
          isDragOver ? 'border-violet-500 bg-zinc-900/50' : 'border-zinc-700 hover:border-violet-500 hover:bg-zinc-900/50'
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="w-10 h-10 text-zinc-400"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 7.5 12 3m0 0L7.5 7.5M12 3v13.5" />
        </svg>
        <p className="text-lg font-bold">Arrastra tu video aquí</p>
        <p className="text-sm text-zinc-400">o haz clic para seleccionar</p>
        <p className="text-xs text-zinc-500">MP4, WebM, MOV — Máx. 200MB, 60s</p>
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          onChange={handleInputChange}
          className="hidden"
        />
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  )
}
