import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import { join, dirname } from 'path';
import { mkdir } from 'fs/promises';
import * as schema from '../../db/schema';

// Define DB type with schema
export type DB = ReturnType<typeof drizzle<typeof schema>>;

// Private singleton instance
let dbInstance: DB | null = null;
let sqliteInstance: Database | null = null;

// Get the brain package root directory
const BRAIN_ROOT = join(dirname(new URL(import.meta.url).pathname), '../../..');

async function ensureDbDirectory() {
  const dbDir = join(BRAIN_ROOT, 'src/db');
  await mkdir(dbDir, { recursive: true });
  return join(dbDir, 'local.db');
}

// Initialize database connection
async function initializeDatabase() {
  if (!dbInstance) {
    const dbPath = await ensureDbDirectory();
    
    // Configure SQLite for better concurrency handling
    sqliteInstance = new Database(dbPath, {
      create: true,
      readwrite: true,
    });
    
    // Enable WAL mode for better concurrency
    sqliteInstance.exec('PRAGMA journal_mode = WAL;');
    sqliteInstance.exec('PRAGMA busy_timeout = 5000;');
    
    dbInstance = drizzle(sqliteInstance, { schema });

    try {
      // Run migrations on initialization
      await migrate(dbInstance, {
        migrationsFolder: join(BRAIN_ROOT, 'src/db/migrations'),
      });
    } catch (error) {
      console.error('Migration failed:', error);
      closeDatabase(); // Clean up on error
      throw error;
    }
  }
  
  return dbInstance;
}

// Get database instance with retry logic
export async function getDatabase(retries = 3): Promise<DB> {
  try {
    return await initializeDatabase();
  } catch (error) {
    if (error instanceof Error && error.message.includes('SQLITE_BUSY') && retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      return getDatabase(retries - 1);
    }
    throw error;
  }
}

// Close database connection
export function closeDatabase() {
  if (sqliteInstance) {
    try {
      sqliteInstance.close();
    } catch (error) {
      console.error('Error closing database:', error);
    } finally {
      sqliteInstance = null;
      dbInstance = null;
    }
  }
}

// Ensure cleanup on process exit
process.on('exit', closeDatabase);
process.on('SIGINT', () => {
  closeDatabase();
  process.exit();
});

