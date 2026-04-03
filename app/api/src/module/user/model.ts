import { sql } from 'bun'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const User = sqliteTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name', { length: 50 }).notNull(),
  email: text('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash', { length: 255 }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    // @ts-ignore
    .default(sql`(unixepoch() * 1000)`)
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    // @ts-ignore
    .default(sql`(unixepoch() * 1000)`)
    .$onUpdate(() => new Date())
    .notNull(),
})

export type UserDB = typeof User.$inferSelect
export type NewUserDB = typeof User.$inferInsert
