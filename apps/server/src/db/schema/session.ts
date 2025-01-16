import { type InferSelectModel, type InferInsertModel, relations, sql } from 'drizzle-orm'
import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { UserTable } from './user'

export const SessionTable = sqliteTable('Session', {
  id: text('id').notNull().primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => UserTable.id),
  // DrizzleSQLiteAdapter currently expects this to be an integer and not use { mode: 'timestamp' }
  expiresAt: integer('expires_at').notNull(),
},
(t) => ([
  index('idx_session_userId').on(t.userId),
]));

export const SessionRelations = relations(SessionTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [SessionTable.userId],
    references: [UserTable.id],
  }),
}))
export type Session = InferSelectModel<typeof SessionTable>
export type InsertSession = InferInsertModel<typeof SessionTable>
export const sessionSchema = createInsertSchema(SessionTable)

export const sessionInsertSchema = createInsertSchema(SessionTable)
export const sessionSelectSchema = createSelectSchema(SessionTable)
