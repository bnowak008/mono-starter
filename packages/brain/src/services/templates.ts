import type { CodeContext, CodePattern } from '../types'
import { getDatabase } from './database'
import { TemplatesTable } from '../db/schema'
import { createId } from '../utils/id'
import { eq, like } from 'drizzle-orm'

export type Template = {
  id: string
  name: string
  content: string
  type: string
  variables: TemplateVariable[]
  patterns: CodePattern[]
}

type TemplateVariable = {
  name: string
  type: 'string' | 'number' | 'boolean' | 'identifier'
  description?: string
  default?: string
}

export class TemplateManager {
  private templates: Map<string, Template>

  constructor() {
    this.templates = new Map()
    this.initialize()
  }

  private async initialize() {
    const db = await getDatabase()
    const dbTemplates = await db.query.TemplatesTable.findMany()

    dbTemplates.forEach(dbTemplate => {
      try {
        const templateData = JSON.parse(dbTemplate.content || '{}')
        this.templates.set(dbTemplate.id, {
          id: dbTemplate.id,
          name: dbTemplate.name,
          content: templateData.content || '',
          type: dbTemplate.type || 'unknown',
          variables: templateData.variables || [],
          patterns: templateData.patterns || []
        })
      } catch (error) {
        console.warn(`Failed to parse template ${dbTemplate.id}:`, error)
      }
    })
  }

  async createTemplate(template: Omit<Template, 'id'>): Promise<Template> {
    const db = await getDatabase()
    const id = createId()

    const newTemplate: Template = {
      ...template,
      id
    }

    await db.insert(TemplatesTable).values({
      id,
      name: template.name,
      type: template.type,
      content: JSON.stringify({
        content: template.content,
        variables: template.variables,
        patterns: template.patterns
      }),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    this.templates.set(id, newTemplate)
    return newTemplate
  }

  async findTemplates(context: CodeContext): Promise<Template[]> {
    const matches: Template[] = []
    const contextPatterns = new Set(context.patterns.map(p => p.id))

    for (const template of this.templates.values()) {
      // Check if template patterns match context patterns
      const patternMatch = template.patterns.some(pattern => 
        contextPatterns.has(pattern.id)
      )

      if (patternMatch) {
        matches.push(template)
      }
    }

    return matches.sort((a, b) => 
      // Sort by number of matching patterns
      b.patterns.filter(p => contextPatterns.has(p.id)).length -
      a.patterns.filter(p => contextPatterns.has(p.id)).length
    )
  }

  async applyTemplate(
    template: Template, 
    variables: Record<string, string>
  ): Promise<string> {
    let content = template.content

    // Replace variables in content
    template.variables.forEach(variable => {
      const value = variables[variable.name] || variable.default || ''
      const regex = new RegExp(`\\{\\{\\s*${variable.name}\\s*\\}\\}`, 'g')
      content = content.replace(regex, value)
    })

    return content
  }

  async extractTemplate(
    content: string,
    patterns: CodePattern[]
  ): Promise<Omit<Template, 'id'>> {
    // Find potential variables in content using regex
    const variableRegex = /\{\{\s*([^}]+)\s*\}\}/g
    const variables = new Set<string>()
    let match

    while ((match = variableRegex.exec(content)) !== null) {
      variables.add(match[1].trim())
    }

    return {
      name: `Template ${new Date().toISOString()}`,
      content,
      type: this.inferTemplateType(patterns),
      variables: Array.from(variables).map(name => ({
        name,
        type: 'string'
      })),
      patterns
    }
  }

  private inferTemplateType(patterns: CodePattern[]): string {
    // Infer template type based on patterns
    const types = patterns.map(p => p.type)
    if (types.includes('component')) return 'component'
    if (types.includes('hook')) return 'hook'
    if (types.includes('utility')) return 'utility'
    return 'unknown'
  }

  async deleteTemplate(id: string): Promise<void> {
    const db = await getDatabase()
    await db.delete(TemplatesTable).where(eq(TemplatesTable.id, id))
    this.templates.delete(id)
  }
} 