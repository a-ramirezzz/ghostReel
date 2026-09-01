import type { TextOverlay } from '../../types'

interface TextEditorProps {
  textOverlay: TextOverlay
  onTextChange: (overlay: TextOverlay) => void
}

const MAX_LENGTH = 200

const FONT_OPTIONS: { label: string; value: string }[] = [
  { label: 'Playfair Display', value: 'Playfair Display' },
  { label: 'Cinzel', value: 'Cinzel' },
  { label: 'Montserrat', value: 'Montserrat' },
  { label: 'Inter', value: 'Inter' },
  { label: 'Cormorant Garamond', value: 'Cormorant Garamond' },
]

const COLOR_PRESETS: string[] = ['#FFFFFF', '#F5F5DC', '#FFD700', '#E2E8F0', '#A78BFA', '#F87171']

export function TextEditor({ textOverlay, onTextChange }: TextEditorProps) {
  const update = (patch: Partial<TextOverlay>) => {
    onTextChange({ ...textOverlay, ...patch })
  }

  const outlineEnabled = textOverlay.strokeWidth > 0

  return (
    <section>
      <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-3">Text</h2>
      <div className="space-y-5">
        <div>
          <textarea
            value={textOverlay.text}
            onChange={(e) => update({ text: e.target.value.slice(0, MAX_LENGTH) })}
            maxLength={MAX_LENGTH}
            rows={3}
            placeholder="Type your quote here..."
            className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-3 text-zinc-100 text-sm resize-none placeholder:text-zinc-600 focus:outline-none focus:border-violet-500 transition-colors"
          />
          <p className="text-xs text-zinc-500 text-right mt-1">
            {textOverlay.text.length} / {MAX_LENGTH}
          </p>
        </div>

        <div>
          <p className="text-xs text-zinc-400 mb-1">Font</p>
          <div className="flex flex-wrap gap-1.5">
            {FONT_OPTIONS.map((font) => {
              const selected = textOverlay.fontFamily === font.value
              return (
                <button
                  key={font.value}
                  type="button"
                  onClick={() => update({ fontFamily: font.value })}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] border transition-colors ${
                    selected
                      ? 'bg-violet-500/20 border-violet-500 text-violet-300'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-300'
                  }`}
                  style={{ fontFamily: `"${font.value}", sans-serif` }}
                >
                  {font.label}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <p className="text-xs text-zinc-400 mb-1">Size: {textOverlay.fontSize}px</p>
          <input
            type="range"
            min={24}
            max={120}
            step={2}
            value={textOverlay.fontSize}
            onChange={(e) => update({ fontSize: Number(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <p className="text-xs text-zinc-400 mb-1">Text color</p>
          <div className="flex items-center gap-2">
            {COLOR_PRESETS.map((color) => {
              const selected = textOverlay.color.toLowerCase() === color.toLowerCase()
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => update({ color })}
                  aria-label={color}
                  style={{ backgroundColor: color }}
                  className={`w-7 h-7 rounded-full cursor-pointer border-2 transition-all ${
                    selected ? 'border-violet-400 scale-110' : 'border-transparent'
                  }`}
                />
              )
            })}
            <input
              type="color"
              value={textOverlay.color}
              onChange={(e) => update({ color: e.target.value })}
              className="w-7 h-7 rounded-full cursor-pointer border-2 border-zinc-700 bg-zinc-800"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-zinc-400">Text outline</p>
            <button
              type="button"
              role="switch"
              aria-checked={outlineEnabled}
              onClick={() =>
                update({
                  strokeWidth: outlineEnabled ? 0 : 2,
                  strokeColor: textOverlay.strokeColor === '' ? '#000000' : textOverlay.strokeColor,
                })
              }
              className={`relative w-9 h-5 rounded-full transition-colors ${
                outlineEnabled ? 'bg-violet-500' : 'bg-zinc-700'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  outlineEnabled ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {outlineEnabled && (
            <div className="space-y-3 mt-2">
              <div className="flex items-center gap-2">
                {COLOR_PRESETS.map((color) => {
                  const selected = textOverlay.strokeColor.toLowerCase() === color.toLowerCase()
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => update({ strokeColor: color })}
                      aria-label={color}
                      style={{ backgroundColor: color }}
                      className={`w-5 h-5 rounded-full cursor-pointer border-2 transition-all ${
                        selected ? 'border-violet-400 scale-110' : 'border-transparent'
                      }`}
                    />
                  )
                })}
                <input
                  type="color"
                  value={textOverlay.strokeColor}
                  onChange={(e) => update({ strokeColor: e.target.value })}
                  className="w-5 h-5 rounded-full cursor-pointer border-2 border-zinc-700 bg-zinc-800"
                />
              </div>
              <div>
                <p className="text-xs text-zinc-400 mb-1">Width: {textOverlay.strokeWidth}px</p>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={textOverlay.strokeWidth}
                  onChange={(e) => update({ strokeWidth: Number(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <p className="text-xs text-zinc-400 mb-1">Position: {textOverlay.positionY}%</p>
          <input
            type="range"
            min={10}
            max={90}
            step={1}
            value={textOverlay.positionY}
            onChange={(e) => update({ positionY: Number(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <p className="text-xs text-zinc-400 mb-1">Alignment</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => update({ textAlign: 'left' })}
              aria-label="Align left"
              className={`px-3 py-2 rounded-lg border transition-colors ${
                textOverlay.textAlign === 'left'
                  ? 'bg-violet-500/20 border-violet-500 text-violet-300'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-300'
              }`}
            >
              <svg viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                <path d="M0 1H16M0 5.5H10M0 10H14" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => update({ textAlign: 'center' })}
              aria-label="Align center"
              className={`px-3 py-2 rounded-lg border transition-colors ${
                textOverlay.textAlign === 'center'
                  ? 'bg-violet-500/20 border-violet-500 text-violet-300'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-300'
              }`}
            >
              <svg viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                <path
                  d="M0 1H16M3 5.5H13M1 10H15"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => update({ textAlign: 'right' })}
              aria-label="Align right"
              className={`px-3 py-2 rounded-lg border transition-colors ${
                textOverlay.textAlign === 'right'
                  ? 'bg-violet-500/20 border-violet-500 text-violet-300'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-300'
              }`}
            >
              <svg viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                <path d="M0 1H16M6 5.5H16M2 10H16" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
