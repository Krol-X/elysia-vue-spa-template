# Elysia + Vue SPA Template

A minimal full-stack template with Vue frontend and Elysia backend.


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
- http://localhost:5173/api/up – API via Vite proxy (dev mode)
- http://localhost:3000/api/up – API direct

### Production
- http://localhost:3030 – Full app (static + API)
- http://localhost:3030/api/up – Health check endpoint


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
bun run dev           # Run in dev mode both frontend and backend (via bin/dev.ts)
bun run dev:api       # Run in dev mode backend only
bun run dev:web       # Run in dev mode frontend only
bun run db:generate   # Generate Drizzle migrations
bun run db:migrate    # Run database migrations
bun run db:seed       # Seed the database
bun run build         # Build everything
bun run build:api     # Build backend only
bun run build:web     # Build frontend only
bun run preview       # Run compiled app
bun run preview:migrate  # Run migrations on compiled app
bun run preview:seed     # Seed the compiled app
bun run format        # Format code with Prettier
```
