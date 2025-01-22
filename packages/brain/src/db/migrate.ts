import { drizzle } from 'drizzle-orm/bun-sqlite';
import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import { Database } from 'bun:sqlite';
import { join } from 'path';
import { mkdir } from 'fs/promises';

async function runMigrations() {
  try {
    // Ensure the db directory exists
    const dbDir = join(process.cwd(), 'src/db');
    await mkdir(dbDir, { recursive: true });
    
    const dbPath = join(dbDir, 'local.db');
    const sqlite = new Database(dbPath);
    const db = drizzle(sqlite);
    
    console.log('Running migrations...');
    await migrate(db, {
      migrationsFolder: join(process.cwd(), 'src/db/migrations'),
    });
    console.log('Migrations completed successfully');
    
    sqlite.close();
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations().catch(console.error); 