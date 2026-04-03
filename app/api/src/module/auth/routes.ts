import { Elysia } from 'elysia'
import { AuthController } from './controller'
import { AuthDto } from './dto'

export const AuthRoutes = new Elysia({ prefix: '/auth' }).post(
  '/sign-in',
  ({ body }) => AuthController.signIn(body),
  {
    body: AuthDto.signInBody,
    response: AuthDto.signInResponse,
    detail: { summary: 'Sign in', tags: ['Auth'] },
  },
)
