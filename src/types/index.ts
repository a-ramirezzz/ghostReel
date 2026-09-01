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
