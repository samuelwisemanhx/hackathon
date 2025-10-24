import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

// Initial schema - will be expanded in Story 1.2
// This is a minimal schema to enable database connection testing

export const users = pgTable('users', {
	id: uuid('id').primaryKey().defaultRandom(),
	email: varchar('email', { length: 255 }).notNull().unique(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});
