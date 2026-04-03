import { Static, t } from 'elysia'

export const AuthDto = {
  signInBody: t.Object({
    email: t.String({ format: 'email' }),
    password: t.String({ minLength: 8, maxLength: 100 }),
  }),
  signInResponse: t.Object({
    accessToken: t.String(),
    tokenType: t.Literal('Bearer'),
    expiresIn: t.Number(),
  }),
  signInError: t.Literal('INVALID_CREDENTIALS'),
}

export type SignInBody = Static<typeof AuthDto.signInBody>
export type SignInResponse = Static<typeof AuthDto.signInResponse>
