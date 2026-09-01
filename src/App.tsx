import { useState } from 'react'
import { VideoUploader } from './components/VideoUploader'
import { VideoPreview } from './components/VideoPreview'
import { VideoTrimmer } from './components/VideoTrimmer'
import type { TrimRange, VideoFile } from './types'

function App() {
  const [video, setVideo] = useState<VideoFile | null>(null)
  const [trim, setTrim] = useState<TrimRange | null>(null)

  const handleVideoLoaded = (loaded: VideoFile) => {
    setVideo(loaded)
    setTrim({ start: 0, end: loaded.duration })
  }

  const handleReset = () => {
    if (video) {
      URL.revokeObjectURL(video.url)
    }
    setVideo(null)
    setTrim(null)
  }

  const handleTrimChange = (start: number, end: number) => {
    setTrim({ start, end })
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="p-6">
        <h1 className="text-2xl font-bold">👻 GhostReel</h1>
      </header>
      <main className="max-w-6xl mx-auto p-6">
        {!video && <VideoUploader onVideoLoaded={handleVideoLoaded} />}
        {video && trim && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  className="w-5 h-5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                <span>Nuevo video</span>
              </button>
              <p className="text-sm text-zinc-500">{video.name}</p>
            </div>
            <div className="flex gap-6">
              <div className="w-[360px] flex-shrink-0">
                <VideoPreview videoUrl={video.url} trimStart={trim.start} trimEnd={trim.end} />
              </div>
              <div className="flex-1 min-w-[320px] bg-zinc-900 rounded-2xl p-6">
                <VideoTrimmer
                  videoUrl={video.url}
                  duration={video.duration}
                  trimStart={trim.start}
                  trimEnd={trim.end}
                  onTrimChange={handleTrimChange}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
