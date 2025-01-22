import { type InferSelectModel, type InferInsertModel, relations } from 'drizzle-orm'
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const __pascalName__Table = sqliteTable('__pascalName__', {
  id: text('id').notNull().primaryKey(),
  createdAt: text('created_at').notNull(),
});

export const __pascalName__Relations = relations(__pascalName__Table, ({ one, many }) => ({
  // Define relations here
}));

export type __pascalName__ = InferSelectModel<typeof __pascalName__Table>
export type Insert__pascalName__ = InferInsertModel<typeof __pascalName__Table>

export const insert__pascalName__Schema = createInsertSchema(__pascalName__Table)
export const select__pascalName__Schema = createSelectSchema(__pascalName__Table)
