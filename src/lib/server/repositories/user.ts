import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { User } from '$lib/types';

/**
 * Find a user by email address
 * @param email - User's email address
 * @returns User object if found, undefined otherwise
 */
export async function findUserByEmail(email: string): Promise<User | undefined> {
	const [user] = await db.select().from(users).where(eq(users.email, email));
	return user;
}

/**
 * Create a new user with email and hashed password
 * @param email - User's email address
 * @param passwordHash - Bcrypt hashed password
 * @returns Newly created user object
 */
export async function createUser(email: string, passwordHash: string): Promise<User> {
	const [newUser] = await db
		.insert(users)
		.values({
			email,
			passwordHash
		})
		.returning();
	return newUser;
}
