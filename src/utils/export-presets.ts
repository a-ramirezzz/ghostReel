import type { ExportPreset } from '../types'

export const EXPORT_PRESETS: ExportPreset[] = [
  {
    id: 'optimized',
    name: 'Facebook Optimizado',
    description: '1080×1920 · Bitrate medio · Ideal para subir',
    width: 1080,
    height: 1920,
    crf: 23,
    maxBitrate: '6M',
  },
  {
    id: 'high-quality',
    name: 'Alta Calidad',
    description: '1080×1920 · Bitrate alto · Archivo / respaldo',
    width: 1080,
    height: 1920,
    crf: 18,
    maxBitrate: '10M',
  },
]
