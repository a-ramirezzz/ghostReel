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
      reject(new Error('Could not read the video'))
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
      setError('Unsupported format. Use MP4, WebM, or MOV.')
      return
    }

    if (file.size > MAX_SIZE_BYTES) {
      setError('The file exceeds the 200MB maximum.')
      return
    }

    const url = URL.createObjectURL(file)

    try {
      const { duration, width, height } = await readVideoMetadata(url)

      if (duration > MAX_DURATION_SECONDS) {
        URL.revokeObjectURL(url)
        setError('The video exceeds the maximum duration of 60 seconds.')
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
      setError('Could not read the video. Try another file.')
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
      <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-lg bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="font-medium text-sm text-zinc-200 truncate">{truncateName(videoFile.name)}</p>
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-violet-400 transition-colors duration-300 flex-shrink-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="w-3.5 h-3.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Change video
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-zinc-800/50 text-[11px] text-zinc-400">
              {formatFileSize(videoFile.size)}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-zinc-800/50 text-[11px] text-zinc-400">
              {formatDuration(videoFile.duration)}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-zinc-800/50 text-[11px] text-zinc-400">
              {videoFile.width} × {videoFile.height}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-6">
      <img src="/ghostreel-icon.jpg" alt="GhostReel" className="w-16 h-16 rounded-2xl" />
      <h1 className="mt-4 text-3xl font-bold bg-gradient-to-r from-violet-400 to-violet-200 bg-clip-text text-transparent">
        GhostReel
      </h1>
      <p className="mt-2 text-sm text-zinc-400">Create clean, metadata-free reels in your browser</p>

      <div className="w-full max-w-lg mt-8 flex flex-col items-center gap-3">
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
          className={`group w-full min-h-[220px] cursor-pointer rounded-2xl border-2 border-dashed p-10 flex flex-col items-center justify-center gap-3 text-center transition-all duration-300 ${
            isDragOver
              ? 'border-violet-500/50 bg-violet-500/5 shadow-[0_0_30px_rgba(139,92,246,0.1)]'
              : 'bg-zinc-900/50 border-zinc-700/50 hover:border-violet-500/50 hover:bg-violet-500/5 hover:shadow-[0_0_30px_rgba(139,92,246,0.1)]'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className={`w-10 h-10 text-zinc-500 group-hover:text-violet-400 transition-all duration-300 ${
              isDragOver ? 'text-violet-400' : 'animate-[pulse_3s_ease-in-out_infinite]'
            }`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 7.5 12 3m0 0L7.5 7.5M12 3v13.5" />
          </svg>
          <p className="text-base font-medium text-zinc-300">Drop your video here</p>
          <p className="text-sm text-zinc-500">or click to browse</p>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800/50 text-[11px] text-zinc-500 mt-4">
            MP4, WebM, MOV — Max 200MB, 60s
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            onChange={handleInputChange}
            className="hidden"
          />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-3 mt-6">
          <span className="flex items-center gap-1.5 text-[11px] text-zinc-500 bg-zinc-900/50 px-3 py-1.5 rounded-full border border-zinc-800/50">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
            No upload
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-zinc-500 bg-zinc-900/50 px-3 py-1.5 rounded-full border border-zinc-800/50">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
            </svg>
            No metadata
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-zinc-500 bg-zinc-900/50 px-3 py-1.5 rounded-full border border-zinc-800/50">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
            </svg>
            100% local
          </span>
        </div>
      </div>
    </div>
  )
}
