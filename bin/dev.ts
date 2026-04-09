const apiProc = Bun.spawn(['bun', 'run', '--cwd', 'app/api', 'dev'], {
  stdout: 'pipe',
  stderr: 'pipe',
});

const webProc = Bun.spawn(['bun', 'run', '--cwd', 'app/web', 'dev'], {
  stdin: 'inherit',
  stdout: 'pipe',
  stderr: 'pipe',
});

async function pipeOutput(
  source: ReadableStream,
  target: NodeJS.WriteStream,
  prefix: string,
) {
  const reader = source.getReader();
  const decoder = new TextDecoder();
  try {
    while (true) {
      const {done, value} = await reader.read();
      if (done) break;
      const text = decoder.decode(value);
      for (const line of text.split('\n')) {
        if (line.trim()) {
          target.write(`[${prefix}] ${line}\n`);
        }
      }
    }
  } catch (error) {
    // Ignore stream errors during shutdown
  }
}

pipeOutput(apiProc.stdout, process.stdout, 'API');
pipeOutput(apiProc.stderr, process.stderr, '!API!');
pipeOutput(webProc.stdout, process.stdout, 'WEB');
pipeOutput(webProc.stderr, process.stderr, '!WEB!');

function cleanup() {
  apiProc.kill();
  webProc.kill();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

apiProc.exited.then(() => {
  webProc.kill();
  process.exit();
});

webProc.exited.then(() => {
  apiProc.kill();
  process.exit();
});
