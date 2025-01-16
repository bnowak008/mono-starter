import { type InferSelectModel, type InferInsertModel, relations } from 'drizzle-orm'
import { index, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { SessionTable } from './session'
import { AuthMethodTable } from './authMethod'

export const UserTable = sqliteTable('User', {
  id: text('id').notNull().primaryKey(),
  email: text('email').notNull(),
}, (table) => ([
  index('idx_user_email').on(table.email),
]));

export const UserRelations = relations(UserTable, ({ many }) => ({
  sessions: many(SessionTable),
  authMethods: many(AuthMethodTable),
}))
export type User = InferSelectModel<typeof UserTable>
export type InsertUser = InferInsertModel<typeof UserTable>
export const insertUserSchema = createInsertSchema(UserTable)
export const selectUserSchema = createSelectSchema(UserTable)
