// TTF (not woff2): FFmpeg.wasm's drawtext uses freetype directly and
// cannot parse woff2, so we download the raw TrueType files.
const FONT_URLS: Record<string, string> = {
  'Cinzel': 'https://cdn.jsdelivr.net/fontsource/fonts/cinzel@latest/latin-700-normal.ttf',
  'Playfair Display': 'https://cdn.jsdelivr.net/fontsource/fonts/playfair-display@latest/latin-700-normal.ttf',
  'Montserrat': 'https://cdn.jsdelivr.net/fontsource/fonts/montserrat@latest/latin-700-normal.ttf',
  'Inter': 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-600-normal.ttf',
  'Cormorant Garamond': 'https://cdn.jsdelivr.net/fontsource/fonts/cormorant-garamond@latest/latin-600-normal.ttf',
}

const FALLBACK_FONT = 'Inter'

export async function downloadFont(fontFamily: string): Promise<Uint8Array> {
  const url = FONT_URLS[fontFamily] ?? FONT_URLS[FALLBACK_FONT]
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`No se pudo descargar la fuente (${response.status}): ${url}`)
  }
  return new Uint8Array(await response.arrayBuffer())
}

export function getFontFileName(_fontFamily: string): string {
  return 'font.ttf'
}
