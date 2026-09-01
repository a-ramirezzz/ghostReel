export interface VideoFile {
  file: File;
  url: string; // object URL for preview
  name: string;
  size: number; // in bytes
  duration: number; // in seconds
  width: number;
  height: number;
}

export interface TrimRange {
  start: number;
  end: number;
}

export interface VideoFilter {
  id: string;
  name: string;
  cssFilter: string; // CSS filter() value for preview
  ffmpegFilter: string; // FFmpeg filter_complex string for export (used later)
}

export interface Watermark {
  imageUrl: string; // object URL of the uploaded logo
  file: File; // original file (needed for FFmpeg export later)
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  opacity: number; // 0 to 1
  size: number; // percentage of video width (10-40)
}

export interface TextOverlay {
  text: string;
  fontFamily: string;
  fontSize: number; // in px, relative to the 1080px wide canvas (will be scaled in preview)
  color: string; // hex color
  strokeColor: string; // hex color for text outline
  strokeWidth: number; // outline width in px
  positionY: number; // vertical position as percentage (0 = top, 50 = center, 100 = bottom)
  textAlign: 'left' | 'center' | 'right';
  lineHeight: number; // multiplier, e.g. 1.4
}

export interface ExportPreset {
  id: string;
  name: string;
  description: string;
  width: number;
  height: number;
  crf: number; // quality (lower = better, 18-28 range)
  maxBitrate: string; // e.g., '6M'
}
