import { Static, t } from 'elysia'

export const UserDto = {
  createBody: t.Object({
    name: t.String({ minLength: 2, maxLength: 50 }),
    email: t.String({ format: 'email' }),
    password: t.String({ minLength: 8, maxLength: 100 }),
  }),
  updateBody: t.Partial(
    t.Object({
      name: t.String({ minLength: 2, maxLength: 50 }),
      email: t.String({ format: 'email' }),
    }),
  ),
  params: t.Object({
    id: t.String({ format: 'uuid' }),
  }),
  response: t.Object({
    id: t.String(),
    name: t.String(),
    email: t.String(),
  }),
}

export type CreateUserBody = Static<typeof UserDto.createBody>
export type UpdateUserBody = Static<typeof UserDto.updateBody>
export type UserId = Static<typeof UserDto.params>
export type UserPublic = Static<typeof UserDto.response>
