import { Webview, SizeHint } from 'webview-bun'

const port = 3030

declare const __SERVER_CODE__: string

const blob = new Blob([__SERVER_CODE__], { type: 'application/typescript' })
const worker = new Worker(URL.createObjectURL(blob))

const webview = new Webview()
webview.title = 'Elysia + Vue SPA Template + Webview'
webview.size = {
  width: 1180,
  height: 800,
  hint: SizeHint.NONE,
}

webview.navigate(`http://localhost:${port}`)

webview.run()

worker.terminate()
process.exit(0)
