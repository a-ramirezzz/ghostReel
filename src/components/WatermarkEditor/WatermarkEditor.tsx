import { useRef } from 'react'
import type { ChangeEvent } from 'react'
import type { Watermark } from '../../types'

interface WatermarkEditorProps {
  watermark: Watermark | null
  onWatermarkChange: (watermark: Watermark | null) => void
}

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']

const POSITIONS: Watermark['position'][] = ['top-left', 'top-right', 'bottom-left', 'bottom-right']

function PositionIcon({ position }: { position: Watermark['position'] }) {
  const dotPosition: Record<Watermark['position'], string> = {
    'top-left': 'top-1 left-1',
    'top-right': 'top-1 right-1',
    'bottom-left': 'bottom-1 left-1',
    'bottom-right': 'bottom-1 right-1',
  }

  return (
    <span className="relative w-full h-full">
      <span className={`absolute w-1.5 h-1.5 rounded-sm bg-current ${dotPosition[position]}`} />
    </span>
  )
}

export function WatermarkEditor({ watermark, onWatermarkChange }: WatermarkEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    const imageUrl = URL.createObjectURL(file)
    onWatermarkChange({
      imageUrl,
      file,
      position: 'bottom-right',
      opacity: 0.7,
      size: 20,
    })
  }

  const handleRemove = () => {
    if (watermark) {
      URL.revokeObjectURL(watermark.imageUrl)
    }
    onWatermarkChange(null)
  }

  const handlePositionChange = (position: Watermark['position']) => {
    if (!watermark) return
    onWatermarkChange({ ...watermark, position })
  }

  const handleOpacityChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!watermark) return
    onWatermarkChange({ ...watermark, opacity: Number(event.target.value) / 100 })
  }

  const handleSizeChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!watermark) return
    onWatermarkChange({ ...watermark, size: Number(event.target.value) })
  }

  return (
    <section>
      <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-3">Watermark</h2>

      {!watermark && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click()
          }}
          className="h-16 w-full bg-zinc-800 border border-dashed border-zinc-700 rounded-xl flex items-center justify-center gap-2 cursor-pointer hover:border-violet-500 hover:bg-zinc-800/50 transition-all duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="w-5 h-5 text-zinc-400"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 7.5 12 3m0 0L7.5 7.5M12 3v13.5" />
          </svg>
          <span className="text-sm text-zinc-400">Upload logo</span>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}

      {watermark && (
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <img
              src={watermark.imageUrl}
              alt="Logo"
              className="h-12 w-auto rounded bg-zinc-800 p-1"
            />
            <p className="flex-1 text-xs text-zinc-400 truncate">{watermark.file.name}</p>
            <button
              type="button"
              onClick={handleRemove}
              aria-label="Remove watermark"
              className="text-zinc-500 hover:text-red-400 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="w-4 h-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div>
            <p className="text-xs text-zinc-400 mb-2">Position</p>
            <div className="grid grid-cols-2 gap-2 w-fit">
              {POSITIONS.map((position) => {
                const selected = watermark.position === position
                return (
                  <button
                    key={position}
                    type="button"
                    onClick={() => handlePositionChange(position)}
                    aria-label={position}
                    className={`w-10 h-10 rounded-lg border transition-colors flex items-center justify-center ${
                      selected
                        ? 'bg-violet-500/20 border-violet-500 text-violet-400'
                        : 'bg-zinc-800 border-zinc-700 hover:border-zinc-500 text-zinc-500'
                    }`}
                  >
                    <PositionIcon position={position} />
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label htmlFor="watermark-opacity" className="text-xs text-zinc-400 block mb-1">
              Opacity: {Math.round(watermark.opacity * 100)}%
            </label>
            <input
              id="watermark-opacity"
              type="range"
              min={10}
              max={100}
              step={5}
              value={Math.round(watermark.opacity * 100)}
              onChange={handleOpacityChange}
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="watermark-size" className="text-xs text-zinc-400 block mb-1">
              Size: {watermark.size}%
            </label>
            <input
              id="watermark-size"
              type="range"
              min={10}
              max={40}
              step={1}
              value={watermark.size}
              onChange={handleSizeChange}
              className="w-full"
            />
          </div>
        </div>
      )}
    </section>
  )
}
