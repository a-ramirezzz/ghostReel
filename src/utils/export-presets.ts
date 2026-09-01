import type { ExportPreset } from '../types'

export const EXPORT_PRESETS: ExportPreset[] = [
  {
    id: 'optimized',
    name: 'Facebook Optimized',
    description: '1080×1920 · Medium bitrate · Ready to upload',
    width: 1080,
    height: 1920,
    crf: 23,
    maxBitrate: '6M',
  },
  {
    id: 'high-quality',
    name: 'High Quality',
    description: '1080×1920 · High bitrate · Archive / backup',
    width: 1080,
    height: 1920,
    crf: 18,
    maxBitrate: '10M',
  },
]
