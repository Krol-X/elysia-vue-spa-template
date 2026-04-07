import { dbConnection } from '@/db'

const email = 'test@test.com'
const existing = dbConnection.query('SELECT id FROM users WHERE email = ?').get(email) as
  | { id: string }
  | undefined

if (!existing) {
  const passwordHash = await Bun.password.hash('testtest')
  const id = crypto.randomUUID()
  const now = Date.now()
  dbConnection.run(
    'INSERT INTO users (id, name, email, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
    [id, 'Test User', email, passwordHash, now, now],
  )
  console.log('✅ Test user created: test@test.com / testtest')
} else {
  console.log('ℹ️  Test user already exists')
}
