import type { CodeContext, Suggestion } from '../types'
import { ContextBuilder } from '../services/context-builder'
import { RuleEngine } from '../services/rules'
import { ContextQuery } from '../services/query'
import { TemplateManager, type Template } from '../services/templates'
import { getDatabase } from '../services/database'

export class BrainAPI {
  private contextBuilder: ContextBuilder
  private ruleEngine: RuleEngine
  private queryEngine: ContextQuery
  private templateManager: TemplateManager

  constructor() {
    this.initialize()
  }

  private async initialize() {
    const db = await getDatabase()
    this.contextBuilder = new ContextBuilder(db)
    this.ruleEngine = new RuleEngine()
    this.queryEngine = new ContextQuery()
    this.templateManager = new TemplateManager()
  }

  async getContext(filePath: string): Promise<CodeContext> {
    return await this.contextBuilder.buildContext(filePath)
  }

  async getSuggestions(context: CodeContext): Promise<Suggestion[]> {
    const [patternSuggestions, relatedFiles] = await Promise.all([
      this.queryEngine.suggestPatterns(context),
      this.queryEngine.findRelatedFiles(context.filePath)
    ])

    const templates = await this.templateManager.findTemplates(context)
    
    // Add template suggestions
    const templateSuggestions = templates.map(template => ({
      type: 'pattern' as const,
      content: `Consider using template: ${template.name}`,
      confidence: 0.7,
      context,
      template
    }))

    return [
      ...patternSuggestions,
      ...templateSuggestions
    ].sort((a, b) => b.confidence - a.confidence)
  }

  async getTemplates(context: CodeContext): Promise<Template[]> {
    return await this.templateManager.findTemplates(context)
  }

  async applyTemplate(
    template: Template,
    variables: Record<string, string>
  ): Promise<string> {
    return await this.templateManager.applyTemplate(template, variables)
  }

  async createTemplateFromContent(
    content: string,
    context: CodeContext
  ): Promise<Template> {
    const templateData = await this.templateManager.extractTemplate(
      content,
      context.patterns
    )
    return await this.templateManager.createTemplate(templateData)
  }
} 