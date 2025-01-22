import { type InferSelectModel } from 'drizzle-orm'
import { sqliteTable, text, index } from 'drizzle-orm/sqlite-core'
import { createInsertSchema } from 'drizzle-zod'

export const RulesTable = sqliteTable('Rules', {
  id: text('id').notNull().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
}, (self) => ([
  index('rules_name_idx').on(self.name),
  index('rules_category_idx').on(self.category)
]))

export const TemplatesTable = sqliteTable('Templates', {
  id: text('id').notNull().primaryKey(),
  name: text('name').notNull(),
  content: text('content'),
  type: text('type'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
}, (self) => ([
  index('templates_name_idx').on(self.name),
  index('templates_type_idx').on(self.type)
]))

export const ContextMetadataTable = sqliteTable('ContextMetadata', {
  id: text('id').notNull().primaryKey(),
  key: text('key').notNull(),
  value: text('value'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
}, (self) => ([
  index('key_idx').on(self.key)
]))

export type Rule = InferSelectModel<typeof RulesTable>
export type Template = InferSelectModel<typeof TemplatesTable>
export type ContextMetadata = InferSelectModel<typeof ContextMetadataTable>

export const insertRuleSchema = createInsertSchema(RulesTable)
export const insertTemplateSchema = createInsertSchema(TemplatesTable)
export const insertContextMetadataSchema = createInsertSchema(ContextMetadataTable) 
