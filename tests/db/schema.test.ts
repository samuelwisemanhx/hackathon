import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { db } from '../../src/lib/server/db/index';
import { users, sessions } from '../../src/lib/server/db/schema';
import { eq } from 'drizzle-orm';

describe('Database Schema', () => {
	// Clean up test data after each test
	afterEach(async () => {
		await db.delete(sessions);
		await db.delete(users);
	});

	describe('Users Table', () => {
		it('should create a user with valid data', async () => {
			const newUser = {
				email: 'test@example.com',
				passwordHash: 'hashed_password_123'
			};

			const [createdUser] = await db.insert(users).values(newUser).returning();

			expect(createdUser).toBeDefined();
			expect(createdUser.id).toBeDefined();
			expect(createdUser.email).toBe(newUser.email);
			expect(createdUser.passwordHash).toBe(newUser.passwordHash);
			expect(createdUser.createdAt).toBeInstanceOf(Date);
			expect(createdUser.updatedAt).toBeInstanceOf(Date);
		});

		it('should enforce email uniqueness constraint', async () => {
			const email = 'duplicate@example.com';
			const userData = {
				email,
				passwordHash: 'hashed_password_123'
			};

			// Create first user
			await db.insert(users).values(userData);

			// Attempt to create second user with same email
			await expect(db.insert(users).values(userData)).rejects.toThrow();
		});

		it('should auto-generate UUID for id field', async () => {
			const newUser = {
				email: 'uuid-test@example.com',
				passwordHash: 'hashed_password_123'
			};

			const [createdUser] = await db.insert(users).values(newUser).returning();

			expect(createdUser.id).toBeDefined();
			expect(typeof createdUser.id).toBe('string');
			// UUID v4 format check
			expect(createdUser.id).toMatch(
				/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
			);
		});

		it('should auto-populate timestamps', async () => {
			const newUser = {
				email: 'timestamp-test@example.com',
				passwordHash: 'hashed_password_123'
			};

			const beforeCreate = new Date();
			const [createdUser] = await db.insert(users).values(newUser).returning();
			const afterCreate = new Date();

			expect(createdUser.createdAt).toBeDefined();
			expect(createdUser.updatedAt).toBeDefined();
			expect(createdUser.createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
			expect(createdUser.createdAt.getTime()).toBeLessThanOrEqual(afterCreate.getTime());
		});
	});

	describe('Sessions Table', () => {
		let testUserId: string;

		beforeEach(async () => {
			// Create a test user for session tests
			const [user] = await db
				.insert(users)
				.values({
					email: 'session-test@example.com',
					passwordHash: 'hashed_password_123'
				})
				.returning();
			testUserId = user.id;
		});

		it('should create a session with valid data', async () => {
			const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now
			const newSession = {
				userId: testUserId,
				token: 'test-token-123',
				expiresAt
			};

			const [createdSession] = await db.insert(sessions).values(newSession).returning();

			expect(createdSession).toBeDefined();
			expect(createdSession.id).toBeDefined();
			expect(createdSession.userId).toBe(testUserId);
			expect(createdSession.token).toBe(newSession.token);
			expect(createdSession.expiresAt.toISOString()).toBe(expiresAt.toISOString());
			expect(createdSession.createdAt).toBeInstanceOf(Date);
		});

		it('should enforce token uniqueness constraint', async () => {
			const token = 'duplicate-token';
			const sessionData = {
				userId: testUserId,
				token,
				expiresAt: new Date(Date.now() + 3600000)
			};

			// Create first session
			await db.insert(sessions).values(sessionData);

			// Attempt to create second session with same token
			await expect(db.insert(sessions).values(sessionData)).rejects.toThrow();
		});

		it('should enforce foreign key relationship to users', async () => {
			const nonExistentUserId = '00000000-0000-4000-8000-000000000000';
			const sessionData = {
				userId: nonExistentUserId,
				token: 'test-token-fk',
				expiresAt: new Date(Date.now() + 3600000)
			};

			// Attempt to create session with non-existent user_id
			await expect(db.insert(sessions).values(sessionData)).rejects.toThrow();
		});

		it('should cascade delete sessions when user is deleted', async () => {
			// Create multiple sessions for the test user
			const session1 = await db
				.insert(sessions)
				.values({
					userId: testUserId,
					token: 'token-1',
					expiresAt: new Date(Date.now() + 3600000)
				})
				.returning();

			const session2 = await db
				.insert(sessions)
				.values({
					userId: testUserId,
					token: 'token-2',
					expiresAt: new Date(Date.now() + 3600000)
				})
				.returning();

			// Verify sessions exist
			const sessionsBeforeDelete = await db
				.select()
				.from(sessions)
				.where(eq(sessions.userId, testUserId));
			expect(sessionsBeforeDelete).toHaveLength(2);

			// Delete the user
			await db.delete(users).where(eq(users.id, testUserId));

			// Verify all sessions were automatically deleted
			const sessionsAfterDelete = await db
				.select()
				.from(sessions)
				.where(eq(sessions.userId, testUserId));
			expect(sessionsAfterDelete).toHaveLength(0);
		});

		it('should auto-generate UUID for session id', async () => {
			const newSession = {
				userId: testUserId,
				token: 'uuid-test-token',
				expiresAt: new Date(Date.now() + 3600000)
			};

			const [createdSession] = await db.insert(sessions).values(newSession).returning();

			expect(createdSession.id).toBeDefined();
			expect(typeof createdSession.id).toBe('string');
			// UUID v4 format check
			expect(createdSession.id).toMatch(
				/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
			);
		});
	});

	describe('Schema Indexes', () => {
		it('should have index on users.email', async () => {
			// Query to check if index exists
			const result = await db.execute(`
				SELECT indexname
				FROM pg_indexes
				WHERE tablename = 'users'
				AND indexname = 'users_email_idx';
			`);

			expect(result.rows).toHaveLength(1);
		});

		it('should have index on sessions.token', async () => {
			// Query to check if index exists
			const result = await db.execute(`
				SELECT indexname
				FROM pg_indexes
				WHERE tablename = 'sessions'
				AND indexname = 'sessions_token_idx';
			`);

			expect(result.rows).toHaveLength(1);
		});
	});
});
