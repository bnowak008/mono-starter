import type { FileMetadata } from '../services/types'

export type CodeContext = {
  filePath: string
  metadata: FileMetadata
  dependencies: DependencyInfo[]
  relationships: Relationship[]
  patterns: CodePattern[]
  history: ContextHistory[]
}

export type DependencyInfo = {
  path: string
  type: 'import' | 'export' | 'uses' | 'implements' | 'extends'
  name: string
}

export type Relationship = {
  source: string
  target: string
  type: RelationType
  strength: number // 0-1 indicating how strong the relationship is
}

export type RelationType = 
  | 'imports' 
  | 'implements'
  | 'extends'
  | 'uses'
  | 'similar'
  | 'related'

export type CodePattern = {
  id: string
  type: PatternType
  frequency: number
  locations: string[] // file paths where this pattern appears
}

export type PatternType =
  | 'function'
  | 'component'
  | 'hook'
  | 'utility'
  | 'test'
  | 'style'
  | 'config'

export type ContextHistory = {
  timestamp: string
  type: 'create' | 'update' | 'delete'
  metadata: FileMetadata
}

export type Rule = {
  id: string
  name: string
  description?: string
  category?: string
  pattern: string | RegExp
  context: string[]
  action: (context: CodeContext) => RuleMatch | null
}

export type RuleMatch = {
  ruleId: string
  confidence: number // 0-1 indicating how confident we are in this match
  suggestion?: string
  relatedFiles?: string[]
}

export type Suggestion = {
  type: 'pattern' | 'import' | 'completion' | 'refactor'
  content: string
  context?: CodeContext
  confidence: number
} 