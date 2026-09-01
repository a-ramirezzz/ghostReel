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
