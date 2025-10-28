import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { db } from '../../../src/lib/server/db';
import { users } from '../../../src/lib/server/db/schema';
import { POST } from '../../../src/routes/api/auth/register/+server';
import { resetRateLimit } from '../../../src/lib/server/utils/rate-limit';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

// Mock request helper
function createRequest(body: any): Request {
	return new Request('http://localhost/api/auth/register', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	});
}

// Mock event object
function createEvent(body: any, clientIp: string = '127.0.0.1') {
	return {
		request: createRequest(body),
		getClientAddress: () => clientIp,
		platform: {},
		locals: {},
		params: {},
		url: new URL('http://localhost/api/auth/register'),
		route: { id: '/api/auth/register' },
		isDataRequest: false,
		isSubRequest: false,
		cookies: {} as any,
		fetch: global.fetch,
		setHeaders: () => {},
		depends: () => {}
	} as any;
}

describe('POST /api/auth/register', () => {
	beforeEach(async () => {
		// Clean up test data before each test
		await db.delete(users);
		// Reset rate limit for test IP
		resetRateLimit('127.0.0.1');
	});

	afterEach(async () => {
		// Clean up test data after each test
		await db.delete(users);
	});

	describe('Successful Registration', () => {
		it('should register new user with valid email and password', async () => {
			const event = createEvent({
				email: 'test@example.com',
				password: 'password123'
			});

			const response = await POST(event);
			const data = await response.json();

			expect(response.status).toBe(201);
			expect(data.user).toBeDefined();
			expect(data.user.email).toBe('test@example.com');
			expect(data.user.id).toBeDefined();
			expect(data.user.createdAt).toBeDefined();
			expect(data.user.passwordHash).toBeUndefined(); // Should not return password
		});

		it('should create user in database', async () => {
			const event = createEvent({
				email: 'dbtest@example.com',
				password: 'password123'
			});

			await POST(event);

			// Verify user exists in database
			const [user] = await db
				.select()
				.from(users)
				.where(eq(users.email, 'dbtest@example.com'));

			expect(user).toBeDefined();
			expect(user.email).toBe('dbtest@example.com');
		});
	});

	describe('Email Validation', () => {
		it('should reject invalid email format', async () => {
			const event = createEvent({
				email: 'invalid-email',
				password: 'password123'
			});

			const response = await POST(event);
			const data = await response.json();

			expect(response.status).toBe(400);
			expect(data.error.code).toBe('VALIDATION_ERROR');
			expect(data.error.message).toBe('Invalid request data');
		});

		it('should reject empty email', async () => {
			const event = createEvent({
				email: '',
				password: 'password123'
			});

			const response = await POST(event);
			const data = await response.json();

			expect(response.status).toBe(400);
			expect(data.error.code).toBe('VALIDATION_ERROR');
		});

		it('should reject missing email', async () => {
			const event = createEvent({
				password: 'password123'
			});

			const response = await POST(event);
			const data = await response.json();

			expect(response.status).toBe(400);
			expect(data.error.code).toBe('VALIDATION_ERROR');
		});
	});

	describe('Password Validation', () => {
		it('should reject password less than 8 characters', async () => {
			const event = createEvent({
				email: 'test@example.com',
				password: 'short'
			});

			const response = await POST(event);
			const data = await response.json();

			expect(response.status).toBe(400);
			expect(data.error.code).toBe('VALIDATION_ERROR');
			expect(JSON.stringify(data.error.details)).toContain('Password must be at least 8 characters');
		});

		it('should reject empty password', async () => {
			const event = createEvent({
				email: 'test@example.com',
				password: ''
			});

			const response = await POST(event);
			const data = await response.json();

			expect(response.status).toBe(400);
			expect(data.error.code).toBe('VALIDATION_ERROR');
		});

		it('should reject missing password', async () => {
			const event = createEvent({
				email: 'test@example.com'
			});

			const response = await POST(event);
			const data = await response.json();

			expect(response.status).toBe(400);
			expect(data.error.code).toBe('VALIDATION_ERROR');
		});
	});

	describe('Email Uniqueness', () => {
		it('should reject duplicate email with 409 status', async () => {
			// Create first user
			const event1 = createEvent({
				email: 'duplicate@example.com',
				password: 'password123'
			});
			await POST(event1);

			// Attempt to create second user with same email
			const event2 = createEvent({
				email: 'duplicate@example.com',
				password: 'different456'
			});
			const response = await POST(event2);
			const data = await response.json();

			expect(response.status).toBe(409);
			expect(data.error.code).toBe('EMAIL_EXISTS');
			expect(data.error.message).toBe('Email already registered');
		});

		it('should not modify original user when duplicate attempted', async () => {
			// Create first user
			const event1 = createEvent({
				email: 'original@example.com',
				password: 'password123'
			});
			const response1 = await POST(event1);
			const originalData = await response1.json();
			const originalId = originalData.user.id;

			// Attempt duplicate
			const event2 = createEvent({
				email: 'original@example.com',
				password: 'different456'
			});
			await POST(event2);

			// Verify original user unchanged
			const [user] = await db
				.select()
				.from(users)
				.where(eq(users.email, 'original@example.com'));

			expect(user.id).toBe(originalId);
		});
	});

	describe('Password Security', () => {
		it('should hash password before storing', async () => {
			const plainPassword = 'password123';
			const event = createEvent({
				email: 'security@example.com',
				password: plainPassword
			});

			await POST(event);

			// Get user from database
			const [user] = await db
				.select()
				.from(users)
				.where(eq(users.email, 'security@example.com'));

			// Password should be hashed, not plaintext
			expect(user.passwordHash).not.toBe(plainPassword);
			expect(user.passwordHash).toMatch(/^\$2[aby]\$\d+\$/); // bcrypt hash pattern
		});

		it('should not return password_hash in response', async () => {
			const event = createEvent({
				email: 'nohash@example.com',
				password: 'password123'
			});

			const response = await POST(event);
			const data = await response.json();

			expect(data.user.passwordHash).toBeUndefined();
			expect(data.user.password_hash).toBeUndefined();
		});

		it('should store hash that bcrypt.compare can verify', async () => {
			const plainPassword = 'password123';
			const event = createEvent({
				email: 'verify@example.com',
				password: plainPassword
			});

			await POST(event);

			// Get user from database
			const [user] = await db
				.select()
				.from(users)
				.where(eq(users.email, 'verify@example.com'));

			// Verify bcrypt.compare works
			const isValid = await bcrypt.compare(plainPassword, user.passwordHash);
			expect(isValid).toBe(true);

			const isInvalid = await bcrypt.compare('wrongpassword', user.passwordHash);
			expect(isInvalid).toBe(false);
		});
	});

	describe('Rate Limiting', () => {
		it('should allow 5 registration attempts', async () => {
			const testIp = '192.168.1.100';

			for (let i = 0; i < 5; i++) {
				const event = createEvent(
					{
						email: `test${i}@example.com`,
						password: 'password123'
					},
					testIp
				);

				const response = await POST(event);
				expect(response.status).not.toBe(429);
			}
		});

		it('should reject 6th attempt with 429 status', async () => {
			const testIp = '192.168.1.101';

			// Make 5 successful attempts
			for (let i = 0; i < 5; i++) {
				const event = createEvent(
					{
						email: `test${i}@example.com`,
						password: 'password123'
					},
					testIp
				);
				await POST(event);
			}

			// 6th attempt should be rate limited
			const event = createEvent(
				{
					email: 'test6@example.com',
					password: 'password123'
				},
				testIp
			);
			const response = await POST(event);
			const data = await response.json();

			expect(response.status).toBe(429);
			expect(data.error.code).toBe('RATE_LIMIT_EXCEEDED');
			expect(data.error.message).toContain('Too many registration attempts');
		});

		it('should track rate limits per IP independently', async () => {
			const ip1 = '192.168.1.102';
			const ip2 = '192.168.1.103';

			// Make 5 attempts from IP1
			for (let i = 0; i < 5; i++) {
				const event = createEvent(
					{
						email: `ip1-${i}@example.com`,
						password: 'password123'
					},
					ip1
				);
				await POST(event);
			}

			// IP2 should still be able to make requests
			const event = createEvent(
				{
					email: 'ip2-test@example.com',
					password: 'password123'
				},
				ip2
			);
			const response = await POST(event);
			expect(response.status).toBe(201);
		});
	});

	describe('Error Response Format', () => {
		it('should return standard error format for validation errors', async () => {
			const event = createEvent({
				email: 'invalid',
				password: '123'
			});

			const response = await POST(event);
			const data = await response.json();

			expect(data.error).toBeDefined();
			expect(data.error.code).toBeDefined();
			expect(data.error.message).toBeDefined();
			expect(data.error.details).toBeDefined();
		});

		it('should return standard error format for duplicate email', async () => {
			// Create first user
			const event1 = createEvent({
				email: 'errorformat@example.com',
				password: 'password123'
			});
			await POST(event1);

			// Attempt duplicate
			const event2 = createEvent({
				email: 'errorformat@example.com',
				password: 'password123'
			});
			const response = await POST(event2);
			const data = await response.json();

			expect(data.error).toBeDefined();
			expect(data.error.code).toBe('EMAIL_EXISTS');
			expect(data.error.message).toBeDefined();
			expect(data.error.details).toBeDefined();
		});

		it('should use appropriate HTTP status codes', async () => {
			// 201 for success
			const successEvent = createEvent({
				email: 'success@example.com',
				password: 'password123'
			});
			const successResponse = await POST(successEvent);
			expect(successResponse.status).toBe(201);

			// 400 for validation error
			const validationEvent = createEvent({
				email: 'invalid',
				password: '123'
			});
			const validationResponse = await POST(validationEvent);
			expect(validationResponse.status).toBe(400);

			// 409 for duplicate
			const duplicateEvent = createEvent({
				email: 'success@example.com',
				password: 'password123'
			});
			const duplicateResponse = await POST(duplicateEvent);
			expect(duplicateResponse.status).toBe(409);
		});
	});
});
