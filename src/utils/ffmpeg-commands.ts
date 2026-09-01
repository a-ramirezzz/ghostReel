import type { ExportPreset, TextOverlay, Watermark } from '../types'

interface WatermarkExportOptions {
  inputFile: string
  position: Watermark['position']
  opacity: number
  size: number // percentage of video width
}

export interface BuildFFmpegArgsOptions {
  inputFile: string
  outputFile: string
  trimStart: number
  trimEnd: number
  filterCssToFfmpeg: string // the ffmpegFilter string from VideoFilter
  textOverlay: TextOverlay | null
  watermark: WatermarkExportOptions | null
  preset: ExportPreset
  fontFile?: string // path to a font file written into FFmpeg's virtual filesystem
}

/**
 * Escapes text for safe use inside an FFmpeg drawtext `text=''` value.
 * Order matters: backslashes must be escaped before quotes/colons that
 * introduce new backslashes.
 */
function escapeDrawtextValue(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/:/g, '\\:')
    .replace(/'/g, "'\\''")
}

function getWatermarkOverlayPosition(position: Watermark['position']): string {
  switch (position) {
    case 'top-left':
      return '20:20'
    case 'top-right':
      return 'main_w-overlay_w-20:20'
    case 'bottom-left':
      return '20:main_h-overlay_h-20'
    case 'bottom-right':
      return 'main_w-overlay_w-20:main_h-overlay_h-20'
  }
}

function getTextX(textAlign: TextOverlay['textAlign']): string {
  switch (textAlign) {
    case 'left':
      return '40'
    case 'right':
      return 'w-text_w-40'
    case 'center':
    default:
      return '(w-text_w)/2'
  }
}

function getTextY(positionY: number, lineIndex: number, lineCount: number, lineHeightPx: number): string {
  const fraction = positionY / 100
  if (lineCount === 1) {
    return `h*${fraction}-text_h/2`
  }
  const blockHeight = lineHeightPx * lineCount
  return `h*${fraction}-${blockHeight / 2}+${lineIndex * lineHeightPx}`
}

export function buildFFmpegArgs(options: BuildFFmpegArgsOptions): string[] {
  const { inputFile, outputFile, trimStart, trimEnd, filterCssToFfmpeg, textOverlay, watermark, preset, fontFile } =
    options

  const duration = trimEnd - trimStart

  const filters: string[] = []
  let currentLabel = '0:v'
  let labelCounter = 0
  const nextLabel = () => `v${labelCounter++}`

  // a. Video filter
  if (filterCssToFfmpeg) {
    const out = nextLabel()
    filters.push(`[${currentLabel}]${filterCssToFfmpeg}[${out}]`)
    currentLabel = out
  }

  // b. Scale to target resolution
  {
    const out = nextLabel()
    filters.push(
      `[${currentLabel}]scale=${preset.width}:${preset.height}:force_original_aspect_ratio=decrease,pad=${preset.width}:${preset.height}:(ow-iw)/2:(oh-ih)/2[${out}]`
    )
    currentLabel = out
  }

  // c. Watermark overlay
  if (watermark) {
    const wmWidth = Math.round(preset.width * (watermark.size / 100))
    filters.push(`[1:v]scale=${wmWidth}:-1,format=rgba,colorchannelmixer=aa=${watermark.opacity}[wm]`)
    const overlayPosition = getWatermarkOverlayPosition(watermark.position)
    const out = nextLabel()
    filters.push(`[${currentLabel}][wm]overlay=${overlayPosition}[${out}]`)
    currentLabel = out
  }

  // d. Text overlay — one drawtext filter per line, stacked vertically.
  // Note: this FFmpeg.wasm core build has no fontconfig support, so
  // drawtext has no built-in default face — an explicit `fontfile`
  // (pre-written into the virtual filesystem) is required or the
  // filter fails to initialize entirely.
  if (textOverlay && textOverlay.text.trim()) {
    const lines = textOverlay.text.split(/\r?\n/)
    const lineHeightPx = Math.round(textOverlay.fontSize * textOverlay.lineHeight)
    const x = getTextX(textOverlay.textAlign)
    const fontFileParam = fontFile ? [`fontfile='${escapeDrawtextValue(fontFile)}'`] : []

    lines.forEach((line, index) => {
      const escapedText = escapeDrawtextValue(line)
      const y = getTextY(textOverlay.positionY, index, lines.length, lineHeightPx)
      const drawtext = [
        ...fontFileParam,
        `text='${escapedText}'`,
        `fontsize=${textOverlay.fontSize}`,
        `fontcolor=${textOverlay.color}`,
        `borderw=${textOverlay.strokeWidth}`,
        `bordercolor=${textOverlay.strokeColor}`,
        `x=${x}`,
        `y=${y}`,
      ].join(':')
      const out = nextLabel()
      filters.push(`[${currentLabel}]drawtext=${drawtext}[${out}]`)
      currentLabel = out
    })
  }

  const args: string[] = ['-ss', String(trimStart), '-i', inputFile]

  if (watermark) {
    args.push('-i', watermark.inputFile)
  }

  const maxrateNumeric = parseFloat(preset.maxBitrate)
  const bufsize = `${maxrateNumeric * 2}${preset.maxBitrate.replace(/[0-9.]/g, '')}`

  args.push(
    '-t',
    String(duration),
    '-filter_complex',
    filters.join(';'),
    '-map',
    `[${currentLabel}]`,
    '-map',
    '0:a?',
    '-c:v',
    'libx264',
    '-preset',
    'medium',
    '-crf',
    String(preset.crf),
    '-maxrate',
    preset.maxBitrate,
    '-bufsize',
    bufsize,
    '-pix_fmt',
    'yuv420p',
    '-c:a',
    'aac',
    '-b:a',
    '128k',
    '-movflags',
    '+faststart',
    '-map_metadata',
    '-1',
    '-fflags',
    '+bitexact',
    outputFile
  )

  return args
}
