import { defineConfig } from 'drizzle-kit'
import { resolveDbUrl } from '@/config/database'

export default defineConfig({
  out: './drizzle',
  schema: './src/module/**/model.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: resolveDbUrl(process.env.DATABASE_URL),
  },
})
