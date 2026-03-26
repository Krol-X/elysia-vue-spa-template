const serverBuild = await Bun.build({
  entrypoints: ['src/server.ts'],
  target: 'bun',
  minify: {
    whitespace: true,
    identifiers: false,
    syntax: true,
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
})

if (!serverBuild.success) {
  console.error('Server build failed:', serverBuild.logs)
  process.exit(1)
}

const serverCode = await serverBuild.outputs[0].text()

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
    __SERVER_CODE__: JSON.stringify(serverCode),
  },
}).then(async (result) => {
  if (!result.success) {
    console.error('Build failed:', result.logs)
    return
  }
})

export {}
