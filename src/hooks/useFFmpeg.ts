import { useCallback, useRef, useState } from 'react'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL } from '@ffmpeg/util'

const CORE_BASE_URL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm'

export type FFmpegLoadState = 'idle' | 'loading' | 'ready' | 'error'
export type FFmpegProcessState = 'idle' | 'processing' | 'done' | 'error'

export interface UseFFmpegResult {
  ffmpeg: FFmpeg
  loadFFmpeg: () => Promise<void>
  isLoaded: boolean
  loadState: FFmpegLoadState
  processState: FFmpegProcessState
  progress: number
}

export function useFFmpeg(): UseFFmpegResult {
  const loadPromiseRef = useRef<Promise<void> | null>(null)

  const [loadState, setLoadState] = useState<FFmpegLoadState>('idle')
  const [processState, setProcessState] = useState<FFmpegProcessState>('idle')
  const [progress, setProgress] = useState(0)
  const [ffmpeg] = useState(() => {
    const instance = new FFmpeg()
    instance.on('log', ({ message }) => {
      console.log('[FFmpeg]', message)
    })
    return instance
  })

  const loadFFmpeg = useCallback(async () => {
    if (loadState === 'ready') return
    if (loadPromiseRef.current) return loadPromiseRef.current

    const doLoad = async () => {
      setLoadState('loading')
      setProcessState('idle')
      setProgress(0)

      try {
        ffmpeg.on('progress', ({ progress: value }) => {
          setProgress(Math.min(1, Math.max(0, value)))
        })

        const [coreURL, wasmURL] = await Promise.all([
          toBlobURL(`${CORE_BASE_URL}/ffmpeg-core.js`, 'text/javascript'),
          toBlobURL(`${CORE_BASE_URL}/ffmpeg-core.wasm`, 'application/wasm'),
        ])

        await ffmpeg.load({ coreURL, wasmURL })

        setLoadState('ready')
      } catch (error) {
        setLoadState('error')
        throw error
      } finally {
        loadPromiseRef.current = null
      }
    }

    const promise = doLoad()
    loadPromiseRef.current = promise
    return promise
  }, [ffmpeg, loadState])

  return {
    ffmpeg,
    loadFFmpeg,
    isLoaded: loadState === 'ready',
    loadState,
    processState,
    progress,
  }
}
