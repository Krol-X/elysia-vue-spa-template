import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { User } from './model'
import type { CreateUserBody, UpdateUserBody, UserId, UserPublic } from './dto'

export abstract class UserService {
  static async create(data: CreateUserBody): Promise<UserPublic> {
    const passwordHash = await Bun.password.hash(data.password)

    const [createdUser] = await db
      .insert(User)
      .values({
        name: data.name,
        email: data.email,
        passwordHash,
      })
      .returning()

    return this.toPublic(createdUser)
  }

  static async findAll(): Promise<UserPublic[]> {
    const users = await db.select().from(User)
    return users.map(this.toPublic)
  }

  static async findOne({ id }: UserId): Promise<UserPublic> {
    const user = await db.select().from(User).where(eq(User.id, id))
    if (!user) throw new Error('User not found')
    return this.toPublic(user)
  }

  static async update({ id }: UserId, patch: UpdateUserBody): Promise<UserPublic> {
    // Фильтруем undefined, чтобы Drizzle не перезаписывал поля
    const cleanPatch = Object.fromEntries(Object.entries(patch).filter(([_, v]) => v !== undefined))

    const [updatedUser] = await db
      .update(User)
      .set({ ...cleanPatch, updatedAt: new Date() })
      .where(eq(User.id, id))
      .returning()

    if (!updatedUser) throw new Error('User not found')
    return this.toPublic(updatedUser)
  }

  static async updatePassword({ id }: UserId, newPassword: string): Promise<UserPublic> {
    const passwordHash = await Bun.password.hash(newPassword)

    const [updatedUser] = await db
      .update(User)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(User.id, id))
      .returning()

    if (!updatedUser) throw new Error('User not found')
    return this.toPublic(updatedUser)
  }

  static async remove({ id }: UserId): Promise<{ success: boolean; id: string }> {
    const deleted = await db.delete(User).where(eq(User.id, id)).returning()
    if (deleted.length === 0) throw new Error('User not found')
    return { success: true, id }
  }

  private static toPublic(user: { passwordHash?: string } & Record<string, any>): UserPublic {
    const { passwordHash, ...publicUser } = user
    return publicUser as UserPublic
  }
}
