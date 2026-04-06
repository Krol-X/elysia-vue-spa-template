import { Elysia } from 'elysia'
import { staticPlugin } from '@elysiajs/static'
import { isProduction } from '@app/shared'
import { UserRoutes } from '@/module/user/routes'
import { AuthRoutes } from '@/module/auth/routes'

const port = process.env.PORT || (isProduction() ? 3030 : 3000)

const api = new Elysia({ prefix: '/api' })
  .get('/up', () => ({
    status: 'ok',
    production: isProduction(),
  }))
  .use(UserRoutes)
  .use(AuthRoutes)

const app = new Elysia()
  .use(
    isProduction()
      ? await staticPlugin({
        assets: '.',
        prefix: '/',
        indexHTML: true,
      })
      : (app) => app,
  )
  .use(api)
  .listen(port)

export type App = typeof app

console.log(`> Listening on ${app.server!.url}`)
