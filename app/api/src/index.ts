import { Webview, SizeHint } from 'webview-bun'

import cluster from 'node:cluster'
import process from 'node:process'

const port = 3030

if (cluster.isPrimary) {
  const cluster_worker = cluster.fork()

  const webview = new Webview()
  webview.title = 'Elysia + Vue SPA Template + Webview'
  webview.size = {
    width: 1180,
    height: 800,
    hint: SizeHint.NONE,
  }

  webview.navigate(`http://localhost:${port}`)

  webview.run()

  cluster_worker.destroy()
  process.exit(0)
} else {
  await import('./server')
}
