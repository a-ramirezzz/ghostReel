# Contributing to GhostReel

Thank you for your interest in contributing to GhostReel! This document will guide you through the process.

## Code of Conduct

This project follows a standard of respect and professionalism. Be kind, constructive, and patient with other contributors.

## How can I contribute?

### Reporting Bugs

If you found a bug, open an [issue](https://github.com/a-ramirezzz/ghostreel/issues) with:

- A clear description of the problem
- Steps to reproduce it
- Expected behavior vs. actual behavior
- Screenshots or videos if possible
- Your browser and operating system

### Suggesting Improvements

Ideas are welcome. Open an issue with the `enhancement` label describing:

- What problem your suggestion solves
- How it should work
- Any visual reference or example

### Submitting a Pull Request

1. **Fork** the repository
2. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/my-new-feature
   ```
3. **Make your changes** following the project's conventions:
   - Strict TypeScript — no `any`
   - Tailwind CSS only for styles — no custom CSS files
   - UI text in English
   - Variable names and code in English
4. **Verify** that the project builds without errors:
   ```bash
   npm run build
   ```
5. **Commit** your changes with descriptive messages in Spanish:
   ```bash
   git commit -m "feat: agregar nueva funcionalidad X"
   ```
6. **Push** to your fork:
   ```bash
   git push origin feature/my-new-feature
   ```
7. **Open a Pull Request** against the `main` branch of the original repository

### Commit Conventions

We use the [Conventional Commits](https://www.conventionalcommits.org/) format in Spanish:

- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation changes
- `refactor:` — Code refactoring
- `style:` — Formatting changes (non-functional)

## Review Process

- All pull requests are reviewed by the project maintainer before being accepted
- Changes or improvements may be requested before approving the PR
- Only the maintainer can merge into `main`

## Development Environment

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Type check
npx tsc --noEmit

# Production build
npm run build
```

## Questions?

If you have any questions, open an issue with the `question` label and we'll respond as soon as possible.
