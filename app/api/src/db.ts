import { Database } from 'bun:sqlite'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import { getDbPath, ensureDbFile } from '@/config/database'

const dbPath = getDbPath(process.env.DATABASE_URL)
ensureDbFile(dbPath)

const dbConnection = new Database(dbPath)
const db = drizzle(dbConnection)

export { db, dbConnection, dbPath }
