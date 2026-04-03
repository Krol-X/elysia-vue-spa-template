import { AuthService } from './service'
import { SignInBody } from './dto'

export abstract class AuthController {
  static async signIn(body: SignInBody) {
    return await AuthService.signIn(body)
  }
}
