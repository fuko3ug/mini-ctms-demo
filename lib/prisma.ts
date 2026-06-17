import path from 'node:path'
import { PrismaClient } from '@/generated/prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaLibSql } from '@prisma/adapter-libsql'

function getLocalDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL ?? 'file:./dev.db'
  if (!databaseUrl.startsWith('file:')) {
    return databaseUrl
  }

  const dbPath = databaseUrl.slice('file:'.length)
  const resolvedPath = path.isAbsolute(dbPath)
    ? dbPath
    : path.join(process.cwd(), dbPath)

  return `file:${resolvedPath}`
}

function createPrismaClient() {
  const tursoUrl = process.env.TURSO_DATABASE_URL
  const tursoAuthToken = process.env.TURSO_AUTH_TOKEN

  if (tursoUrl && tursoAuthToken) {
    const adapter = new PrismaLibSql({
      url: tursoUrl,
      authToken: tursoAuthToken,
    })
    return new PrismaClient({ adapter })
  }

  const adapter = new PrismaBetterSqlite3({ url: getLocalDatabaseUrl() })
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
