import { migrate } from 'drizzle-orm/bun-sqlite/migrator'
import { db, dbConnection } from '@/db'
import { resolve } from 'node:path'

const drizzleFolder = resolve(process.cwd(), 'drizzle')

const command = process.argv[2]

if (command === 'db:migrate') {
  console.log('. Running migrations...')
  migrate(db, { migrationsFolder: drizzleFolder })
  console.log('> Migrations complete')
  process.exit(0)
}

if (command === 'db:seed') {
  console.log('. Seeding database...')

  const email = 'test@test.com'
  const existing = dbConnection.query('SELECT id FROM users WHERE email = ?').get(email) as { id: string } | undefined

  if (!existing) {
    const passwordHash = await Bun.password.hash('testtest')
    const id = crypto.randomUUID()
    const now = Date.now()
    dbConnection.run(
      'INSERT INTO users (id, name, email, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
      [id, 'Test User', email, passwordHash, now, now],
    )
    console.log('> Test user created: test@test.com / testtest')
  } else {
    console.log('. Test user already exists')
  }

  process.exit(0)
}

console.log(`! Unknown command: ${command}`)
console.log('Available commands: db:migrate, db:seed')
process.exit(1)
