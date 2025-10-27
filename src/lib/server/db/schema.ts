import { pgTable, uuid, varchar, timestamp, index } from 'drizzle-orm/pg-core';

// User authentication and session management schema
// Story 1.2: Full session-based authentication with password support

export const users = pgTable('users', {
	id: uuid('id').primaryKey().defaultRandom(),
	email: varchar('email', { length: 255 }).notNull().unique(),
	passwordHash: varchar('password_hash', { length: 255 }).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
	emailIdx: index('users_email_idx').on(table.email)
}));

export const sessions = pgTable('sessions', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
	token: varchar('token', { length: 255 }).notNull().unique(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull()
}, (table) => ({
	tokenIdx: index('sessions_token_idx').on(table.token)
}));

// Infer TypeScript types from schema
/**
 * User entity type inferred from database schema
 * Represents a complete user record with all fields
 */
export type User = typeof users.$inferSelect;

/**
 * Type for creating a new user
 * Omits auto-generated fields (id, createdAt, updatedAt)
 */
export type NewUser = typeof users.$inferInsert;

/**
 * Session entity type inferred from database schema
 * Represents a complete session record with all fields
 */
export type Session = typeof sessions.$inferSelect;

/**
 * Type for creating a new session
 * Omits auto-generated fields (id, createdAt)
 */
export type NewSession = typeof sessions.$inferInsert;
