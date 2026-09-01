# GhostReel

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61DAFB.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6.svg)
![Vite](https://img.shields.io/badge/Vite-8-646CFF.svg)

Editor de video 100% del lado del cliente para crear reels verticales sin metadatos, con overlays de texto, filtros y marcas de agua. Todo el procesamiento ocurre en el navegador — ningún archivo se sube a un servidor.

## Características

- **Sin subida a servidor**: el video nunca sale de tu navegador, todo el procesamiento es local
- **Recorte de video** con `VideoTrimmer` para seleccionar el segmento a exportar
- **Overlay de texto** en tiempo real sobre el preview del video
- **Filtros con preview** mediante thumbnails, aplicados tanto en pantalla como en la exportación
- **Marca de agua** configurable en logo, posición, opacidad y tamaño
- **Exportación con FFmpeg.wasm**, con presets de calidad y panel de progreso
- **Eliminación de metadatos** al exportar, para reels "limpios"

## Stack técnico

- [Vite](https://vite.dev)
- [React](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS v4](https://tailwindcss.com)
- [FFmpeg.wasm](https://ffmpegwasm.netlify.app)

## Empezando

```bash
npm install
npm run dev
```

### Otros comandos

```bash
# Verificar tipos
npx tsc --noEmit

# Lint
npm run lint

# Build de producción
npm run build

# Previsualizar build de producción
npm run preview
```

## Notas técnicas

- FFmpeg.wasm requiere los headers `Cross-Origin-Embedder-Policy: require-corp` y `Cross-Origin-Opener-Policy: same-origin`, ya configurados en `vite.config.ts`
- Las fuentes se descargan en tiempo de exportación desde [Fontsource](https://fontsource.org) vía CDN y se escriben al filesystem virtual de FFmpeg
- El preview usa CSS filters mientras que la exportación usa los filtros nativos de FFmpeg, por lo que puede haber diferencias sutiles entre preview y resultado final

## Contribuir

Las contribuciones son bienvenidas. Por favor lee [CONTRIBUTING.md](CONTRIBUTING.md) antes de enviar un pull request.

## Licencia

Este proyecto está bajo la licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

---

<p align="center">
  Hecho con 🖤 por <a href="https://github.com/a-ramirezzz">a-ramirezzz</a>
</p>
