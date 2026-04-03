import { Elysia, t } from 'elysia'
import { UserController } from './controller'
import { UserDto } from './dto'

export const UserRoutes = new Elysia({ prefix: '/users' })
  .post('/', ({ body }) => UserController.create(body), {
    body: UserDto.createBody,
    response: UserDto.response,
    detail: { summary: 'Create user', tags: ['Users'] },
  })
  .get('/', () => UserController.findAll(), {
    response: t.Array(UserDto.response),
    detail: { summary: 'List users', tags: ['Users'] },
  })
  .get('/:id', ({ params }) => UserController.findOne(params), {
    params: UserDto.params,
    response: UserDto.response,
    detail: { summary: 'Get user', tags: ['Users'] },
  })
  .patch('/:id', ({ params, body }) => UserController.update(params, body), {
    params: UserDto.params,
    body: UserDto.updateBody,
    response: UserDto.response,
    detail: { summary: 'Update user', tags: ['Users'] },
  })
  .delete('/:id', ({ params }) => UserController.remove(params), {
    params: UserDto.params,
    response: t.Object({ success: t.Boolean(), id: t.String() }),
    detail: { summary: 'Delete user', tags: ['Users'] },
  })
