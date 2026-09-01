import { useEffect, useRef, useState } from 'react'
import { VIDEO_FILTERS } from '../../utils/filters'

interface FilterSelectorProps {
  videoUrl: string
  selectedFilterId: string
  onFilterChange: (filterId: string) => void
}

export function FilterSelector({ videoUrl, selectedFilterId, onFilterChange }: FilterSelectorProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [thumbnail, setThumbnail] = useState<string | null>(null)

  useEffect(() => {
    setThumbnail(null)
  }, [videoUrl])

  const captureFrame = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || thumbnail) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    setThumbnail(canvas.toDataURL('image/jpeg', 0.8))
  }

  return (
    <section>
      <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">Filtro</h2>
      <video
        ref={videoRef}
        src={videoUrl}
        muted
        playsInline
        preload="auto"
        onLoadedData={captureFrame}
        onSeeked={captureFrame}
        className="hidden"
      />
      <canvas ref={canvasRef} className="hidden" />
      <div className="flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
        {VIDEO_FILTERS.map((filter) => {
          const selected = filter.id === selectedFilterId
          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => onFilterChange(filter.id)}
              className={`w-16 h-28 rounded-lg overflow-hidden cursor-pointer border-2 transition-all flex-shrink-0 relative ${
                selected ? 'border-violet-500 shadow-lg shadow-violet-500/20' : 'border-zinc-700 hover:border-zinc-500'
              }`}
            >
              {thumbnail && (
                <img
                  src={thumbnail}
                  alt={filter.name}
                  style={{ filter: filter.cssFilter }}
                  className="object-cover w-full h-full"
                />
              )}
              <span className="text-[10px] text-center text-zinc-300 bg-gradient-to-t from-black/80 to-transparent absolute bottom-0 inset-x-0 py-1">
                {filter.name}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
