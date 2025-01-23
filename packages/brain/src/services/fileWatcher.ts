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
type QueueItem = {
  event: WatchEvent
  path: string
  rootDir: string
}

class OperationQueue {
  private queue: QueueItem[] = []
  private processing = false
  private db: BunSQLiteDatabase<Record<string, unknown>> & { $client: Database }
  private batchSize = 50
  private batchTimeout = 1000 // 1 second

  constructor(db: BunSQLiteDatabase<Record<string, unknown>> & { $client: Database }) {
    this.db = db
  }

  async add(item: QueueItem) {
    this.queue.push(item)
    if (!this.processing) {
      this.processing = true
      setTimeout(() => this.processBatch(), this.batchTimeout)
    }
  }

  private async processBatch() {
    try {
      const batch = this.queue.splice(0, this.batchSize)
      if (batch.length === 0) {
        this.processing = false
        return
      }

      const changes = batch.map(item => ({
        metadata: analyzeFile(item.path, item.rootDir),
        event: item.event,
        timestamp: new Date().toISOString()
      }))

      // Batch insert with retries
      let retries = 3
      while (retries > 0) {
        try {
          await this.db.insert(ContextMetadataTable).values(
            changes.map(change => ({
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
            }))
          )
          break
        } catch (error) {
          if (error instanceof Error && error.message.includes('SQLITE_BUSY') && retries > 1) {
            retries--
            await new Promise(resolve => setTimeout(resolve, 1000))
            continue
          }
          throw error
        }
      }
    } catch (error) {
      console.error('Error processing batch:', error)
    } finally {
      if (this.queue.length > 0) {
        setTimeout(() => this.processBatch(), this.batchTimeout)
      } else {
        this.processing = false
      }
    }
  }
}

// Main watcher function
export const createFileWatcher = async (rootDir: string) => {
  const db = await getDatabase()
  const queue = new OperationQueue(db)
  
  // Enhanced ignore patterns
  const ignored = [
    /(^|[\/\\])\../,           // dotfiles
    '**/node_modules/**',      // dependencies
    '**/dist/**',              // build outputs
    '**/.git/**',              // git files
    '**/coverage/**',          // test coverage
    '**/*.log',                // log files
    '**/local.db*',            // SQLite database files
    '**/migrations/**',        // Database migrations
    '**/.DS_Store',            // macOS files
    '**/tmp/**',               // Temporary files
    '**/.next/**',             // Next.js build
    '**/build/**'              // Build directories
  ]

  const watcher = chokidar.watch(rootDir, {
    ignored,
    persistent: true,
    ignoreInitial: false,
    awaitWriteFinish: {
      stabilityThreshold: 1000, // Increased to 1 second
      pollInterval: 200
    },
    ignorePermissionErrors: true,
    atomic: true // For atomic writes
  })

  const handleFileChange = (event: WatchEvent, path: string) => {
    queue.add({ event, path, rootDir })
  }

  watcher
    .on('add', (path) => handleFileChange('add', path))
    .on('change', (path) => handleFileChange('change', path))
    .on('unlink', (path) => handleFileChange('delete', path))
    .on('error', (error) => console.error('Watcher error:', error))

  return {
    close: async () => {
      await watcher.close()
    },
    pause: () => watcher.unwatch('**/*'),
    resume: () => watcher.add(rootDir),
    getWatchedPaths: () => watcher.getWatched()
  }
} 