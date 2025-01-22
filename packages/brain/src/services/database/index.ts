import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import { join } from 'path';
import { mkdir } from 'fs/promises';
import * as schema from '../../db/schema';

// Private singleton instance
let dbInstance: ReturnType<typeof drizzle> | null = null;
let sqliteInstance: Database | null = null;

async function ensureDbDirectory() {
  const dbDir = join(process.cwd(), 'src/db');
  await mkdir(dbDir, { recursive: true });
  return join(dbDir, 'local.db');
}

// Initialize database connection
async function initializeDatabase() {
  if (!dbInstance) {
    const dbPath = await ensureDbDirectory();
    sqliteInstance = new Database(dbPath);
    dbInstance = drizzle(sqliteInstance, { schema });

    // Run migrations on initialization
    await migrate(dbInstance, {
      migrationsFolder: join(process.cwd(), 'src/db/migrations'),
    });
  }
  return dbInstance;
}

// Get database instance
export async function getDatabase() {
  return initializeDatabase();
}

// Close database connection
export function closeDatabase() {
  if (sqliteInstance) {
    sqliteInstance.close();
    sqliteInstance = null;
    dbInstance = null;
  }
}
