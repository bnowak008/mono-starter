import type { FileMetadata } from './types'
import type { CodeContext, CodePattern, Suggestion, RuleMatch } from '../types'
import { buildContext } from './context-builder'
import { evaluateContext } from './rules'
import { getDatabase } from './database'
import { ContextMetadataTable } from '../db/schema'
import { like } from 'drizzle-orm'

export async function findRelatedFiles(filePath: string): Promise<FileMetadata[]> {
  const db = await getDatabase()
  const context = await buildContext(db, filePath)
  const relatedPaths = new Set<string>()
  
  // Add direct dependencies
  context.dependencies.forEach(dep => relatedPaths.add(dep.path))
  
  // Add files with similar patterns
  context.patterns.forEach(pattern => {
    pattern.locations.forEach(loc => {
      if (loc !== filePath) relatedPaths.add(loc)
    })
  })
  
  // Get metadata for each related file
  const relatedFiles: FileMetadata[] = []
  for (const path of relatedPaths) {
    const relatedContext = await buildContext(db, path)
    relatedFiles.push(relatedContext.metadata)
  }
  
  return relatedFiles
}

export async function suggestPatterns(context: CodeContext): Promise<Suggestion[]> {
  const suggestions: Suggestion[] = []
  
  // Get rule matches
  const matches = await evaluateContext(context)
  
  // Convert matches to suggestions
  matches.forEach((match: RuleMatch) => {
    if (match.suggestion) {
      suggestions.push({
        type: 'pattern',
        content: match.suggestion,
        confidence: match.confidence,
        context
      })
    }
  })
  
  // Add import suggestions based on common patterns
  const patterns = await findCommonPatterns(context.patterns)
  patterns.forEach(pattern => {
    suggestions.push({
      type: 'pattern',
      content: `Consider using pattern: ${pattern.id}`,
      confidence: pattern.frequency / 10, // Normalize frequency to 0-1
      context
    })
  })
  
  return suggestions.sort((a, b) => b.confidence - a.confidence)
}

async function findCommonPatterns(currentPatterns: CodePattern[]): Promise<CodePattern[]> {
  const db = await getDatabase()
  const allPatterns = new Map<string, CodePattern>()
  
  // Get all pattern occurrences from history
  const history = await db.query.ContextMetadataTable.findMany({
    where: like(ContextMetadataTable.value, '%pattern%')
  })
  
  history.forEach(entry => {
    try {
      const value = JSON.parse(entry.value || '{}')
      if (value.patterns) {
        value.patterns.forEach((pattern: CodePattern) => {
          const existing = allPatterns.get(pattern.id)
          if (existing) {
            existing.frequency += pattern.frequency
            existing.locations = [...new Set([...existing.locations, ...pattern.locations])]
          } else {
            allPatterns.set(pattern.id, { ...pattern })
          }
        })
      }
    } catch (error) {
      console.warn('Failed to parse pattern history:', error)
    }
  })
  
  return Array.from(allPatterns.values())
    .filter(pattern => !currentPatterns.find(p => p.id === pattern.id))
    .sort((a, b) => b.frequency - a.frequency)
}
