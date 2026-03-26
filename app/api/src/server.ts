import { Elysia } from 'elysia'
import { staticPlugin } from '@elysiajs/static'
import { isProduction } from '@app/shared'

const port = 3030

const app = new Elysia()
  .get('/api/up', () => ({
    status: 'ok',
    production: isProduction(),
  }))
  .use(
    isProduction() ? await staticPlugin({ assets: '.', prefix: '/', indexHTML: true }) : (a) => a,
  )
  .listen(port)

export type App = typeof app

console.log(`> Production: ${isProduction()}`)
console.log(`> Server listening: ${app.server!.url.href}`)
