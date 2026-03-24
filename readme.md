# Elysia + Vue SPA Template

A minimal full-stack template with Vue frontend and Elysia backend, compiled into a single executable.

## Quick Start

```
# Install dependencies
bun install

# Development
bun run dev

# Production
bun run build
bun run preview
```

## Project structure

```
- app
  - api  # backend (Elysia)
  - web  # frontend (Vue, Vite)
- dist
  - app(.exe)   # compiled server
  - index.html  # SPA entry
```

## Scripts

```
bun run build         # Build everything
bun run build:api     # Build backend only
bun run build:web     # Build frontend only
bun run preview       # Run compiled app
```
