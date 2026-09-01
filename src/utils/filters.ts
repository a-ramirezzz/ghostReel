import type { VideoFilter } from '../types'

export const VIDEO_FILTERS: VideoFilter[] = [
  {
    id: 'none',
    name: 'Original',
    cssFilter: 'none',
    ffmpegFilter: '',
  },
  {
    id: 'grayscale',
    name: 'B/N',
    cssFilter: 'grayscale(100%)',
    ffmpegFilter: 'colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3',
  },
  {
    id: 'sepia',
    name: 'Sepia',
    cssFilter: 'sepia(80%) saturate(120%)',
    ffmpegFilter: 'colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131',
  },
  {
    id: 'high-contrast',
    name: 'Contrast',
    cssFilter: 'contrast(140%) saturate(110%)',
    ffmpegFilter: 'eq=contrast=1.4:saturation=1.1',
  },
  {
    id: 'warm',
    name: 'Warm',
    cssFilter: 'sepia(20%) saturate(140%) brightness(105%)',
    ffmpegFilter: 'eq=saturation=1.4:brightness=0.05,colorbalance=rs=0.1:gs=0.05:bs=-0.1',
  },
  {
    id: 'cool',
    name: 'Cool',
    cssFilter: 'saturate(90%) brightness(105%) hue-rotate(10deg)',
    ffmpegFilter: 'eq=saturation=0.9:brightness=0.05,colorbalance=rs=-0.1:gs=0:bs=0.15',
  },
]
