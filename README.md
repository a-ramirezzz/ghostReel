# GhostReel

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61DAFB.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6.svg)
![Vite](https://img.shields.io/badge/Vite-8-646CFF.svg)

Client-side video editor for creating metadata-free vertical reels with text overlays, filters, and watermarks.

## Features

- **No server upload**: your video never leaves your browser, all processing is local
- **Video trimming** with `VideoTrimmer` to select the segment to export
- **Text overlay** in real time over the video preview
- **Filters with preview** via thumbnails, applied both on screen and in the export
- **Watermark** configurable in logo, position, opacity, and size
- **Export with FFmpeg.wasm**, with quality presets and a progress panel
- **Metadata removal** on export, for "clean" reels

## Tech Stack

- [Vite](https://vite.dev)
- [React](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS v4](https://tailwindcss.com)
- [FFmpeg.wasm](https://ffmpegwasm.netlify.app)

## Getting Started

```bash
npm install
npm run dev
```

### Other Commands

```bash
# Type check
npx tsc --noEmit

# Lint
npm run lint

# Production build
npm run build

# Preview production build
npm run preview
```

## Technical Notes

- FFmpeg.wasm requires the `Cross-Origin-Embedder-Policy: require-corp` and `Cross-Origin-Opener-Policy: same-origin` headers, already configured in `vite.config.ts`
- Fonts are downloaded at export time from [Fontsource](https://fontsource.org) via CDN and written to FFmpeg's virtual filesystem
- The preview uses CSS filters while the export uses FFmpeg's native filters, so there may be subtle differences between the preview and the final result

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a pull request.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

<p align="center">
  Made with 🖤 by <a href="https://github.com/a-ramirezzz">a-ramirezzz</a>
</p>
