# Contribuir a GhostReel

¡Gracias por tu interés en contribuir a GhostReel! Este documento te guiará en el proceso.

## Código de conducta

Este proyecto sigue un estándar de respeto y profesionalismo. Sé amable, constructivo y paciente con los demás contribuidores.

## ¿Cómo puedo contribuir?

### Reportar bugs

Si encontraste un bug, abre un [issue](https://github.com/a-ramirezzz/ghostreel/issues) con:

- Una descripción clara del problema
- Pasos para reproducirlo
- Comportamiento esperado vs. comportamiento actual
- Screenshots o videos si es posible
- Tu navegador y sistema operativo

### Sugerir mejoras

Las ideas son bienvenidas. Abre un issue con la etiqueta `enhancement` describiendo:

- Qué problema resuelve tu sugerencia
- Cómo debería funcionar
- Cualquier referencia visual o ejemplo

### Enviar un Pull Request

1. **Fork** el repositorio
2. **Crea una rama** desde `main`:
   ```bash
   git checkout -b feature/mi-nueva-feature
   ```
3. **Haz tus cambios** siguiendo las convenciones del proyecto:
   - TypeScript estricto — sin `any`
   - Solo Tailwind CSS para estilos — sin archivos CSS personalizados
   - Textos de UI en español
   - Nombres de variables y código en inglés
4. **Verifica** que el proyecto compila sin errores:
   ```bash
   npm run build
   ```
5. **Haz commit** de tus cambios con mensajes descriptivos en español:
   ```bash
   git commit -m "feat: agregar nueva funcionalidad X"
   ```
6. **Push** a tu fork:
   ```bash
   git push origin feature/mi-nueva-feature
   ```
7. **Abre un Pull Request** contra la rama `main` del repositorio original

### Convenciones de commits

Usamos el formato de [Conventional Commits](https://www.conventionalcommits.org/) en español:

- `feat:` — Nueva funcionalidad
- `fix:` — Corrección de bug
- `docs:` — Cambios en documentación
- `refactor:` — Refactorización de código
- `style:` — Cambios de formato (no funcionales)

## Proceso de revisión

- Todos los pull requests son revisados por el maintainer del proyecto antes de ser aceptados
- Se puede solicitar cambios o mejoras antes de aprobar el PR
- Solo el maintainer puede hacer merge a `main`

## Entorno de desarrollo

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Verificar tipos
npx tsc --noEmit

# Build de producción
npm run build
```

## ¿Dudas?

Si tienes alguna pregunta, abre un issue con la etiqueta `question` y te responderemos lo antes posible.
