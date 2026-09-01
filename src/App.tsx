import { useState } from 'react'
import { VideoUploader } from './components/VideoUploader'
import { VideoPreview } from './components/VideoPreview'
import { VideoTrimmer } from './components/VideoTrimmer'
import { TextEditor } from './components/TextEditor'
import { FilterSelector } from './components/FilterSelector'
import { WatermarkEditor } from './components/WatermarkEditor'
import { ExportPanel } from './components/ExportPanel'
import type { TextOverlay, TrimRange, VideoFile, Watermark } from './types'

const DEFAULT_TEXT_OVERLAY: TextOverlay = {
  text: '',
  fontFamily: 'Cinzel',
  fontSize: 64,
  color: '#FFFFFF',
  strokeColor: '#000000',
  strokeWidth: 2,
  positionY: 50,
  textAlign: 'center',
  lineHeight: 1.4,
}

function App() {
  const [video, setVideo] = useState<VideoFile | null>(null)
  const [trim, setTrim] = useState<TrimRange | null>(null)
  const [textOverlay, setTextOverlay] = useState<TextOverlay>(DEFAULT_TEXT_OVERLAY)
  const [selectedFilterId, setSelectedFilterId] = useState('none')
  const [watermark, setWatermark] = useState<Watermark | null>(null)

  const handleVideoLoaded = (loaded: VideoFile) => {
    setVideo(loaded)
    setTrim({ start: 0, end: loaded.duration })
  }

  const handleReset = () => {
    if (video) {
      URL.revokeObjectURL(video.url)
    }
    if (watermark) {
      URL.revokeObjectURL(watermark.imageUrl)
    }
    setVideo(null)
    setTrim(null)
    setTextOverlay(DEFAULT_TEXT_OVERLAY)
    setSelectedFilterId('none')
    setWatermark(null)
  }

  const handleTrimChange = (start: number, end: number) => {
    setTrim({ start, end })
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/ghostreel-icon.jpg" alt="GhostReel" className="w-8 h-8 rounded-lg" />
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-violet-400 to-violet-200 bg-clip-text text-transparent">
              GhostReel
            </span>
          </div>
        </div>
      </header>
      <main className={video ? 'max-w-6xl mx-auto p-6' : ''}>
        {!video && <VideoUploader onVideoLoaded={handleVideoLoaded} />}
        {video && trim && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between pb-4 mb-2 border-b border-zinc-800/30">
              <button
                type="button"
                onClick={handleReset}
                className="group flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                <span>New video</span>
              </button>
              <p className="text-xs text-zinc-600">{video.name}</p>
            </div>
            <div className="flex gap-6">
              <div className="w-[360px] flex-shrink-0">
                <VideoPreview
                  videoUrl={video.url}
                  trimStart={trim.start}
                  trimEnd={trim.end}
                  textOverlay={textOverlay}
                  filterId={selectedFilterId}
                  watermark={watermark}
                />
              </div>
              <div className="flex-1 min-w-[320px] bg-zinc-900/60 backdrop-blur-sm rounded-2xl p-5 border border-zinc-800/30 overflow-y-auto max-h-[calc(100vh-140px)]">
                <div className="pb-5 mb-5 border-b border-zinc-800/40">
                  <VideoTrimmer
                    videoUrl={video.url}
                    duration={video.duration}
                    trimStart={trim.start}
                    trimEnd={trim.end}
                    onTrimChange={handleTrimChange}
                  />
                </div>
                <div className="pb-5 mb-5 border-b border-zinc-800/40">
                  <TextEditor textOverlay={textOverlay} onTextChange={setTextOverlay} />
                </div>
                <div className="pb-5 mb-5 border-b border-zinc-800/40">
                  <FilterSelector
                    videoUrl={video.url}
                    selectedFilterId={selectedFilterId}
                    onFilterChange={setSelectedFilterId}
                  />
                </div>
                <div className="pb-5 mb-5 border-b border-zinc-800/40">
                  <WatermarkEditor watermark={watermark} onWatermarkChange={setWatermark} />
                </div>
                <div>
                  <ExportPanel
                    videoFile={video}
                    trimStart={trim.start}
                    trimEnd={trim.end}
                    textOverlay={textOverlay}
                    selectedFilterId={selectedFilterId}
                    watermark={watermark}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
