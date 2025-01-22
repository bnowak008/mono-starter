import { drizzle } from 'drizzle-orm/bun-sqlite'
import { Database } from 'bun:sqlite'
import * as schema from './schema'

export function retrieveDb(dbPath: string) {
  const sqlite = new Database(dbPath)
  
  return drizzle(sqlite, { 
    schema,
    logger: true 
  })
}

export type DB = ReturnType<typeof retrieveDb>
export { schema } 