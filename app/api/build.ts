import { rename } from 'fs/promises'
import { Glob } from 'bun'

const isWindows = process.platform === 'win32'
const appName = isWindows ? 'app.exe' : 'app'

await Bun.build({
  entrypoints: ['src/index.ts'],
  target: 'bun',
  bundle: true,
  outdir: '../../dist',
  minify: {
    whitespace: true,
    identifiers: false,
    syntax: true,
  },
  compile: true,
  define: {
    'process.env.NODE_ENV': '"production"',
  },
}).then(async (result) => {
  if (!result.success) {
    console.error('Build failed:', result.logs)
    return
  }

  const outputPath = result.outputs[0]?.path
  if (outputPath) {
    const newPath = outputPath.replace(/[^/\\]+$/, appName)
    await rename(outputPath, newPath)
    console.log(`> Built: ${newPath}`)
  }
})
