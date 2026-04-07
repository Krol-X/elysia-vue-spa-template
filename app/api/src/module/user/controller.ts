import { status } from 'elysia'
import { UserService } from './service'
import { UserId } from './dto'

export abstract class UserController {
  static create(body: any) {
    return UserService.create(body)
  }

  static findAll() {
    return UserService.findAll()
  }

  static findOne(params: UserId) {
    try {
      return UserService.findOne(params)
    } catch (e: any) {
      throw status(404, e.message)
    }
  }

  static update(params: UserId, body: any) {
    try {
      return UserService.update(params, body)
    } catch (e: any) {
      throw status(404, e.message)
    }
  }

  static remove(params: UserId) {
    try {
      return UserService.remove(params)
    } catch (e: any) {
      throw status(404, e.message)
    }
  }

  static updatePassword(params: UserId, body: { password: string }) {
    try {
      return UserService.updatePassword(params, body.password)
    } catch (e: any) {
      throw status(404, e.message)
    }
  }
}
