import chokidar from 'chokidar'
import { createId } from '../utils/id'
import { getDatabase } from './database'
import { ContextMetadataTable } from '../db/schema'
import { analyzeFile } from './analyzer'
import type { FileMetadata } from './types'
import { BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite'
import Database from 'bun:sqlite'
  
// Types
type WatchEvent = 'add' | 'change' | 'delete'

type WatcherOptions = {
  ignored?: RegExp | string[]
  persistent?: boolean
  rootDir?: string
}

type FileChange = {
  event: WatchEvent
  metadata: FileMetadata
  timestamp: string
}

// Default configuration
const DEFAULT_OPTIONS: WatcherOptions = {
  ignored: /(^|[\/\\])\../, // Ignore dotfiles
  persistent: true,
  rootDir: process.cwd()
}

// Core watcher functionality
const handleFileChange = async (
  event: WatchEvent, 
  path: string, 
  rootDir: string,
  db: BunSQLiteDatabase<Record<string, unknown>> & { $client: Database }
): Promise<void> => {
  const metadata = analyzeFile(path, rootDir)
  
  const change: FileChange = {
    event,
    metadata,
    timestamp: new Date().toISOString()
  }

  // Store rich context in database
  await db.insert(ContextMetadataTable).values({
    id: createId(),
    key: `file_${change.event}`,
    value: JSON.stringify({
      path: change.metadata.path,
      type: change.metadata.type,
      workspace: change.metadata.workspace,
      dependencies: change.metadata.dependencies
    }),
    createdAt: change.timestamp,
    updatedAt: change.timestamp
  })
}

// Main watcher function
export const createFileWatcher = async (rootDir: string) => {
  const db = await getDatabase()
  
  // Enhanced ignore patterns for monorepo
  const ignored = [
    /(^|[\/\\])\../,           // dotfiles
    '**/node_modules/**',      // dependencies
    '**/dist/**',              // build outputs
    '**/.git/**',              // git files
    '**/coverage/**',          // test coverage
    '**/*.log'                 // log files
  ]

  const watcher = chokidar.watch(rootDir, {
    ignored,
    persistent: true,
    ignoreInitial: false,
    awaitWriteFinish: {
      stabilityThreshold: 300,
      pollInterval: 100
    }
  })

  watcher
    .on('add', (path) => handleFileChange('add', path, rootDir, db))
    .on('change', (path) => handleFileChange('change', path, rootDir, db))
    .on('unlink', (path) => handleFileChange('delete', path, rootDir, db))
    .on('error', (error) => console.error('Watcher error:', error))

  return {
    close: () => watcher.close(),
    pause: () => watcher.unwatch('**/*'),
    resume: () => watcher.add(rootDir),
    getWatchedPaths: () => watcher.getWatched()
  }
} 