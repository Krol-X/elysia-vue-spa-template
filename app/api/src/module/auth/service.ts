import { status } from 'elysia'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { User } from '@/module/user/model'
import { UserService } from '@/module/user/service'
import type { SignInBody, SignInResponse, SignUpBody, SignUpResponse } from './dto'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production'
const TOKEN_EXPIRES_IN = 3600 // 1 hour

export abstract class AuthService {
  static async signUp({ name, email, password }: SignUpBody): Promise<SignUpResponse> {
    const existingUser = await db.select().from(User).where(eq(User.email, email))
    if (existingUser.length > 0) {
      throw status(409, 'USER_ALREADY_EXISTS')
    }

    const createdUser = await UserService.create({ name, email, password })
    return createdUser
  }

  static async signIn({ email, password }: SignInBody): Promise<SignInResponse> {
    const [user] = await db.select().from(User).where(eq(User.email, email))

    if (!user) {
      throw status(400, 'INVALID_CREDENTIALS')
    }

    const isValidPassword = await Bun.password.verify(password, user.passwordHash)

    if (!isValidPassword) {
      throw status(400, 'INVALID_CREDENTIALS')
    }

    // Простая генерация токена (в продакшене используйте JWT библиотеку)
    const payload = {
      sub: user.id,
      email: user.email,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + TOKEN_EXPIRES_IN,
    }

    const encodedPayload = btoa(JSON.stringify(payload))
    const signature = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(`${encodedPayload}.${JWT_SECRET}`),
    )
    const signatureHex = Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')

    const accessToken = `${encodedPayload}.${signatureHex}`

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: TOKEN_EXPIRES_IN,
    }
  }
}
