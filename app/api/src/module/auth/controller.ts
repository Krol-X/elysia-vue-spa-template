import { AuthService } from './service'
import type { SignInBody, SignUpBody } from './dto'

export abstract class AuthController {
  static async signUp(body: SignUpBody) {
    return await AuthService.signUp(body)
  }

  static async signIn(body: SignInBody) {
    return await AuthService.signIn(body)
  }
}
