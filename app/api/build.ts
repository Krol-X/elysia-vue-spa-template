import { rename, unlink } from 'fs/promises';

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
    console.error('Build failed:', result.logs);
    return;
  }

  const outputPath = result.outputs[0]?.path;
  if (outputPath) {
    const newPath = outputPath.replace(/[^/\\]+$/, 'app.exe');
    await rename(outputPath, newPath);
    console.log(`> Built: ${newPath}`);
  }
});
