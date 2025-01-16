import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import * as schema from './schema'

export function retrieveDb(dbUrl: string) {
  const client = createClient({ 
    url: dbUrl,
  })
  
  return drizzle(client, { 
    schema,
    logger: true 
  })
}

export type DB = ReturnType<typeof retrieveDb>

export { schema };