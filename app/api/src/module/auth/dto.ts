import { Static, t } from 'elysia'

export const AuthDto = {
  signUpBody: t.Object({
    name: t.String({ minLength: 2, maxLength: 50 }),
    email: t.String({ format: 'email' }),
    password: t.String({ minLength: 8, maxLength: 100 }),
  }),
  signInBody: t.Object({
    email: t.String({ format: 'email' }),
    password: t.String({ minLength: 8, maxLength: 100 }),
  }),
  signInResponse: t.Object({
    accessToken: t.String(),
    tokenType: t.Literal('Bearer'),
    expiresIn: t.Number(),
  }),
  signUpResponse: t.Object({
    id: t.String(),
    name: t.String(),
    email: t.String(),
  }),
  signInError: t.Literal('INVALID_CREDENTIALS'),
  signUpError: t.Literal('USER_ALREADY_EXISTS'),
}

export type SignUpBody = Static<typeof AuthDto.signUpBody>
export type SignInBody = Static<typeof AuthDto.signInBody>
export type SignInResponse = Static<typeof AuthDto.signInResponse>
export type SignUpResponse = Static<typeof AuthDto.signUpResponse>
