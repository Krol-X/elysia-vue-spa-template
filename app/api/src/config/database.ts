import { existsSync, mkdirSync, writeFileSync } from 'node:fs'

const DEFAULT_DB_PATH = './.data/sqlite.db'

export function resolveDbUrl(url?: string): string {
  const raw = url ?? DEFAULT_DB_PATH
  return raw.startsWith('file:') ? raw : `file:${raw.replace(/^sqlite:/, '')}`
}

export function getDbPath(url?: string): string {
  return resolveDbUrl(url).replace(/^file:/, '')
}

export function ensureDbFile(path: string): void {
  const dir = path.substring(0, path.lastIndexOf('/'))
  if (dir && !existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
  if (!existsSync(path)) {
    writeFileSync(path, '')
  }
}
