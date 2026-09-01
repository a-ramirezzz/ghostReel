import { useState } from 'react'
import { fetchFile } from '@ffmpeg/util'
import { useFFmpeg } from '../../hooks/useFFmpeg'
import { buildFFmpegArgs } from '../../utils/ffmpeg-commands'
import { downloadFont, getFontFileName } from '../../utils/font-loader'
import { VIDEO_FILTERS } from '../../utils/filters'
import { EXPORT_PRESETS } from '../../utils/export-presets'
import type { ExportPreset, TextOverlay, VideoFile, Watermark } from '../../types'

interface ExportPanelProps {
  videoFile: VideoFile
  trimStart: number
  trimEnd: number
  textOverlay: TextOverlay
  selectedFilterId: string
  watermark: Watermark | null
}

type ExportStatus = 'idle' | 'loading-engine' | 'processing' | 'done' | 'error'

const INPUT_FILENAME = 'input.mp4'
const WATERMARK_FILENAME = 'watermark.png'
const OUTPUT_FILENAME = 'output.mp4'

export function ExportPanel({ videoFile, trimStart, trimEnd, textOverlay, selectedFilterId, watermark }: ExportPanelProps) {
  const { ffmpeg, loadFFmpeg, isLoaded, progress } = useFFmpeg()
  const [selectedPreset, setSelectedPreset] = useState<ExportPreset>(
    EXPORT_PRESETS.find((preset) => preset.id === 'optimized') ?? EXPORT_PRESETS[0]
  )
  const [status, setStatus] = useState<ExportStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const cleanupVirtualFiles = async () => {
    const filesToClean = [INPUT_FILENAME, OUTPUT_FILENAME, getFontFileName(textOverlay.fontFamily)]
    if (watermark) {
      filesToClean.push(WATERMARK_FILENAME)
    }

    for (const file of filesToClean) {
      try {
        await ffmpeg.deleteFile(file)
      } catch {
        // file may not exist, ignore
      }
    }
  }

  const handleExport = async () => {
    setErrorMessage(null)

    try {
      if (!isLoaded) {
        setStatus('loading-engine')
        await loadFFmpeg()
      }

      setStatus('processing')

      let hasTextOverlay = textOverlay.text.trim().length > 0
      const fontFileName = getFontFileName(textOverlay.fontFamily)

      await ffmpeg.writeFile(INPUT_FILENAME, await fetchFile(videoFile.file))
      if (watermark) {
        await ffmpeg.writeFile(WATERMARK_FILENAME, await fetchFile(watermark.file))
      }
      if (hasTextOverlay) {
        // The font must be in FFmpeg's virtual filesystem before exec, or
        // drawtext fails to initialize. If the download fails, export
        // without the text overlay instead of blocking the whole export.
        try {
          const fontData = await downloadFont(textOverlay.fontFamily)
          await ffmpeg.writeFile(fontFileName, fontData)
        } catch (error) {
          console.warn('[GhostReel] Could not download the font, exporting without text:', error)
          hasTextOverlay = false
        }
      }

      const filter = VIDEO_FILTERS.find((item) => item.id === selectedFilterId)

      const args = buildFFmpegArgs({
        inputFile: INPUT_FILENAME,
        outputFile: OUTPUT_FILENAME,
        trimStart,
        trimEnd,
        filterCssToFfmpeg: filter?.ffmpegFilter ?? '',
        textOverlay: hasTextOverlay ? textOverlay : null,
        watermark: watermark
          ? {
              inputFile: WATERMARK_FILENAME,
              position: watermark.position,
              opacity: watermark.opacity,
              size: watermark.size,
            }
          : null,
        preset: selectedPreset,
        fontFile: hasTextOverlay ? fontFileName : undefined,
      })

      console.log('[GhostReel] Full FFmpeg command:', ['ffmpeg', ...args].join(' '))

      // FFmpeg.wasm sometimes throws Aborted() during cleanup even though
      // the export completed and the output file is valid — don't fail yet,
      // try to read the output first.
      let execSucceeded = true
      try {
        await ffmpeg.exec(args)
      } catch (execError) {
        console.warn('[GhostReel] FFmpeg exec threw (may still have succeeded):', execError)
        execSucceeded = false
      }

      let data: Awaited<ReturnType<typeof ffmpeg.readFile>>
      try {
        data = await ffmpeg.readFile(OUTPUT_FILENAME)
      } catch {
        if (!execSucceeded) {
          throw new Error('Export failed. Try a shorter video or a different format.')
        }
        throw new Error('FFmpeg did not generate the output file. Check the console for FFmpeg logs.')
      }
      const bytes = data instanceof Uint8Array ? data : new TextEncoder().encode(data)
      const blob = new Blob([new Uint8Array(bytes)], { type: 'video/mp4' })
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = `ghostreel_${Date.now()}.mp4`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      setTimeout(() => URL.revokeObjectURL(url), 5000)

      await cleanupVirtualFiles()

      setStatus('done')
    } catch (error) {
      console.error(error)
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred while exporting the video.')
      setStatus('error')
    }
  }

  const buttonLabel =
    status === 'loading-engine'
      ? 'Loading engine...'
      : status === 'processing'
        ? 'Processing...'
        : status === 'done'
          ? 'Done! Download'
          : 'Export video'

  const buttonClasses =
    status === 'done'
      ? 'bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-lg shadow-green-500/20'
      : status === 'processing'
        ? 'bg-violet-700 text-white'
        : 'bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30'

  const isBusy = status === 'loading-engine' || status === 'processing'

  return (
    <section>
      <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-3">Export</h2>

      <p className="text-xs text-zinc-400 mb-2">Export quality</p>
      <div className="flex flex-col gap-2">
        {EXPORT_PRESETS.map((preset) => {
          const selected = preset.id === selectedPreset.id
          return (
            <button
              key={preset.id}
              type="button"
              disabled={isBusy}
              onClick={() => setSelectedPreset(preset)}
              className={`w-full p-3 rounded-xl border transition-colors cursor-pointer text-left disabled:cursor-not-allowed disabled:opacity-60 ${
                selected ? 'bg-violet-500/10 border-violet-500/60' : 'bg-zinc-800 border-zinc-700 hover:border-zinc-500'
              }`}
            >
              <div className="flex items-center gap-1.5">
                {preset.id === 'optimized' ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    className="w-3.5 h-3.5 text-zinc-400"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.6 9h16.8M3.6 15h16.8M12 3a14.7 14.7 0 0 1 0 18 14.7 14.7 0 0 1 0-18Z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    className="w-3.5 h-3.5 text-zinc-400"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
                  </svg>
                )}
                <p className="text-sm font-medium text-zinc-100">{preset.name}</p>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">{preset.description}</p>
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={handleExport}
        disabled={isBusy}
        className={`w-full mt-4 flex items-center justify-center gap-2 font-semibold py-3 rounded-xl transition-all duration-300 disabled:cursor-not-allowed ${buttonClasses}`}
      >
        {status === 'loading-engine' && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            className="w-4 h-4 animate-spin"
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth={3}
              strokeOpacity={0.25}
            />
            <path
              d="M21 12a9 9 0 0 0-9-9"
              stroke="currentColor"
              strokeWidth={3}
              strokeLinecap="round"
            />
          </svg>
        )}
        {status !== 'loading-engine' && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="w-4 h-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M7.5 12 12 16.5m0 0L16.5 12M12 16.5V3" />
          </svg>
        )}
        <span>{buttonLabel}</span>
      </button>

      {status === 'processing' && (
        <div className="mt-3">
          <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-600 to-violet-400 rounded-full transition-all duration-300 animate-pulse"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
          <p className="text-xs text-zinc-400 text-center mt-1">{Math.round(progress * 100)}%</p>
          <p className="text-xs text-zinc-500 text-center mt-1">This may take 1-3 minutes</p>
        </div>
      )}

      {status === 'error' && (
        <div className="mt-3">
          <p className="text-red-400 text-sm">{errorMessage}</p>
          <button
            type="button"
            onClick={handleExport}
            className="mt-2 text-sm text-zinc-300 hover:text-zinc-100 underline transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}
    </section>
  )
}
