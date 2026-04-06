import { copyFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

function copyDirRecursive(src: string, dest: string): void {
  if (!existsSync(dest)) {
    mkdirSync(dest, { recursive: true })
  }
  for (const entry of readdirSync(src)) {
    const s = join(src, entry)
    const d = join(dest, entry)
    if (statSync(s).isDirectory()) {
      copyDirRecursive(s, d)
    } else {
      copyFileSync(s, d)
    }
  }
}

await Bun.build({
  entrypoints: ['src/index.ts'],
  target: 'bun',
  outdir: '../../dist',
  minify: {
    whitespace: true,
    identifiers: false,
    syntax: true,
  },
  compile: {
    outfile: 'app',
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
}).then(async (result) => {
  if (!result.success) {
    console.error('Build failed:', result.logs)
    return
  }

  const drizzleSrc = './drizzle'
  const drizzleDest = '../../dist/drizzle'
  if (existsSync(drizzleSrc)) {
    copyDirRecursive(drizzleSrc, drizzleDest)
    console.log('> Copied drizzle migrations to dist')
  }
})
