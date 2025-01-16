import { type InferSelectModel, type InferInsertModel, relations, sql } from 'drizzle-orm'
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core'
import { createInsertSchema } from 'drizzle-zod'
import { UserTable } from './user'
import { HASH_METHODS } from '@/utils/password/hash-methods'

// User Key is an authentication method
// Users have a 1-to-many relationship to keys
// The id consists of a provider type combined with a provider id
// https://lucia-auth.com/basics/keys/
export const AuthMethodTable = sqliteTable(
  'AuthMethod',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => UserTable.id),
    hashedPassword: text('hashed_password'),
    hashMethod: text('hash_method', { enum: HASH_METHODS }),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    // The following could be used for password resets, one-time passwords or 2FA
    totpSecret: text('totp_secret'),
    totpExpires: integer('totp_expires', { mode: 'timestamp' }),
    // This is used to prevent brute force attacks and rate limit invalid login attempts
    timeoutUntil: integer('timeout_until', { mode: 'timestamp' }),
    timeoutSeconds: integer('timeout_seconds'),
    // Depending on which providers you connect... you may want to store more data, i.e. username, profile pic, etc
    // Instead of creating separate fields for each, you could add a single field to store any additional data
    // data: text('data', { mode: 'json' })
  },
  (t) => ({
    userIdIdx: index('idx_userKey_userId').on(t.userId),
  })
)
export const AuthMethodRelations = relations(AuthMethodTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [AuthMethodTable.userId],
    references: [UserTable.id],
  }),
}))
export type AuthMethod = InferSelectModel<typeof AuthMethodTable>
export type InsertAuthMethod = InferInsertModel<typeof AuthMethodTable>
export const authMethodSchema = createInsertSchema(AuthMethodTable)
