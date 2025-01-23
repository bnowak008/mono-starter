import { join, dirname } from 'path'
import { readFileSync } from 'fs'
import { parse as parseTs } from '@typescript-eslint/typescript-estree'
import type { DB } from '../db'
import type { FileMetadata } from './types'
import type { CodeContext, DependencyInfo, Relationship, CodePattern, ContextHistory } from '../types'
import { analyzeFile } from './analyzer'
import { ContextMetadataTable } from '../db/schema'
import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'

// Shared state management using closures
const createStateManager = () => {
  const cache = new Map<string, FileMetadata>()
  const relationships = new Map<string, Set<string>>()

  return {
    getCache: () => cache,
    getRelationships: () => relationships,
    clearCache: (path: string) => cache.delete(path),
    clearRelationship: (path: string) => relationships.delete(path)
  }
}

const state = createStateManager()

// Helper functions
const resolveImportPath = (sourcePath: string, importPath: string): string => {
  if (importPath.startsWith('.')) {
    return join(dirname(sourcePath), importPath)
  }
  return importPath
}

const getFileMetadata = async (filePath: string): Promise<FileMetadata> => {
  const cache = state.getCache()
  if (cache.has(filePath)) {
    return cache.get(filePath)!
  }

  const metadata = analyzeFile(filePath, process.cwd())
  cache.set(filePath, metadata)
  return metadata
}

const analyzeDependencies = async (filePath: string): Promise<DependencyInfo[]> => {
  const dependencies: DependencyInfo[] = []
  const content = readFileSync(filePath, 'utf-8')

  try {
    const ast = parseTs(content, {
      jsx: true,
      loc: true
    })

    ast.body.forEach(node => {
      if (node.type === 'ImportDeclaration') {
        const importPath = node.source.value
        dependencies.push({
          path: resolveImportPath(filePath, importPath),
          type: 'import',
          name: node.specifiers.map(s => s.local.name).join(', ')
        })
      }
    })
  } catch (error) {
    console.warn(`Failed to parse ${filePath}:`, error)
  }

  return dependencies
}

const findRelationships = async (filePath: string): Promise<Relationship[]> => {
  const relationships: Relationship[] = []
  const deps = await analyzeDependencies(filePath)
  const relationshipMap = state.getRelationships()

  deps.forEach(dep => {
    relationships.push({
      source: filePath,
      target: dep.path,
      type: 'imports',
      strength: 1
    })

    if (!relationshipMap.has(filePath)) {
      relationshipMap.set(filePath, new Set())
    }
    relationshipMap.get(filePath)!.add(dep.path)
  })

  return relationships
}

const detectPatterns = async (filePath: string): Promise<CodePattern[]> => {
  const patterns: CodePattern[] = []
  const content = readFileSync(filePath, 'utf-8')

  if (filePath.includes('components') && content.includes('React.')) {
    patterns.push({
      id: 'react-component',
      type: 'component',
      frequency: 1,
      locations: [filePath]
    })
  }

  if (content.includes('useState') || content.includes('useEffect')) {
    patterns.push({
      id: 'react-hook',
      type: 'hook',
      frequency: 1,
      locations: [filePath]
    })
  }

  return patterns
}

const getHistory = async (db: DB, filePath: string): Promise<ContextHistory[]> => {
  const history = await db.query.ContextMetadataTable.findMany({
    where: eq(ContextMetadataTable.key, `file_${filePath}`),
    orderBy: (fields, { desc }) => [desc(fields.createdAt)]
  })

  return history.map(entry => ({
    timestamp: entry.createdAt,
    type: JSON.parse(entry.value || '{}').type || 'update',
    metadata: JSON.parse(entry.value || '{}')
  }))
}

export type FileChange = {
  event: 'create' | 'update' | 'delete'
  metadata: FileMetadata
  timestamp: Date
}

export const buildContext = async (db: DB, filePath: string): Promise<CodeContext> => {
  const metadata = await getFileMetadata(filePath)
  const dependencies = await analyzeDependencies(filePath)
  const relationships = await findRelationships(filePath)
  const patterns = await detectPatterns(filePath)
  const history = await getHistory(db, filePath)

  return {
    filePath,
    metadata,
    dependencies,
    relationships,
    patterns,
    history
  }
}

export const updateContext = async (db: DB, event: FileChange): Promise<void> => {
  const { metadata, timestamp } = event
  
  state.clearCache(metadata.path)
  
  if (event.event === 'delete') {
    state.clearRelationship(metadata.path)
  }

  await db.insert(ContextMetadataTable).values([{
    id: nanoid(),
    key: `file_${metadata.path}`,
    value: JSON.stringify({
      ...metadata,
      type: event.event
    }),
    createdAt: timestamp.toISOString(),
    updatedAt: timestamp.toISOString()
  }])
} 