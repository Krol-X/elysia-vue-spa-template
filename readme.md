# Elysia + Vue SPA Template

A minimal full-stack template with Vue frontend and Elysia backend, compiled into a single executable.


## Quick Start

```bash
# Install dependencies
bun install

# Development
bun run dev

# Production
bun run build
bun run preview
```


## Default Links

### Development
- http://localhost:5173 – Vite dev server (frontend + API proxy)
- http://localhost:5173/api/up – API через Vite proxy
- http://localhost:3000/api/up – API напрямую

### Production
- http://localhost:3030 – Full app (static + API)
- http://localhost:3030/api/up – Health check endpoint

> В dev-режиме работай на `localhost:5173` – Vite проксирует `/api/*` на backend.


## Project Structure

```
- app
  - api  # backend (Elysia)
  - web  # frontend (Vue, Vite)
- dist
  - app(.exe)   # compiled server
  - index.html  # SPA entry
```


## Scripts

```bash
bun run dev           # Run both frontend and backend
bun run dev:api       # Run backend only
bun run dev:web       # Run frontend only
bun run build         # Build everything
bun run build:api     # Build backend only
bun run build:web     # Build frontend only
bun run preview       # Run compiled app
```


## Todo

- [ ] add Eden
- [ ] implement support embedded files patch for @elysiajs/static
