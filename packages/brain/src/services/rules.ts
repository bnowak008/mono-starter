import type { Rule, RuleMatch, CodeContext } from '../types'
import { buildContext } from './context-builder'
import { getDatabase } from './database'
import { RulesTable } from '../db/schema'
import { createId } from '../utils/id'
import { eq } from 'drizzle-orm'

const rules: Map<string, Rule> = new Map()

// Add type assertion to include value property
type RuleRecord = typeof RulesTable.$inferSelect & { value: string | null }

export const initializeRules = async () => {
  const db = await getDatabase()
  
  // Load rules from database
  const dbRules = (await db.query.RulesTable.findMany()) as RuleRecord[]
  
  dbRules.forEach(dbRule => {
    try {
      const pattern = dbRule.value ? JSON.parse(dbRule.value).pattern : null
      if (pattern) {
        rules.set(dbRule.id, {
          id: dbRule.id,
          name: dbRule.name,
          description: dbRule.description || undefined,
          category: dbRule.category || undefined,
          pattern: new RegExp(pattern),
          context: JSON.parse(dbRule.value || '{}').context || [],
          action: createRuleAction(pattern)
        })
      }
    } catch (error) {
      console.warn(`Failed to parse rule ${dbRule.id}:`, error)
    }
  })
}

const createRuleAction = (pattern: string): Rule['action'] => {
  return (context: CodeContext) => {
    const regex = new RegExp(pattern)
    const match = regex.test(JSON.stringify(context))
    
    if (match) {
      return {
        ruleId: createId(),
        confidence: 0.8,
        suggestion: `Pattern '${pattern}' matched in ${context.filePath}`
      }
    }
    
    return null
  }
}

export const evaluateContext = async (context: CodeContext): Promise<RuleMatch[]> => {
  const matches: RuleMatch[] = []
  
  for (const rule of rules.values()) {
    try {
      const match = rule.action(context)
      if (match) {
        matches.push({
          ...match,
          ruleId: rule.id
        })
      }
    } catch (error) {
      console.warn(`Rule ${rule.id} evaluation failed:`, error)
    }
  }
  
  return matches
}

export const addRule = async (rule: Omit<Rule, 'id'>): Promise<Rule> => {
  const db = await getDatabase()
  const id = createId()
  
  const newRule: Rule = {
    ...rule,
    id
  }
  
  // Store in database
  const { value, ...ruleData } = {
    id,
    name: rule.name,
    description: rule.description,
    category: rule.category,
    value: JSON.stringify({
      pattern: rule.pattern.toString(),
      context: rule.context
    }),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  await db.insert(RulesTable).values(ruleData)
  
  rules.set(id, newRule)
  return newRule
}

export const getRules = async (): Promise<Rule[]> => {
  return Array.from(rules.values())
}

export const deleteRule = async (id: string): Promise<void> => {
  const db = await getDatabase()
  await db.delete(RulesTable).where(eq(RulesTable.id, id))
  rules.delete(id)
}

// Initialize rules on module load
void initializeRules() 