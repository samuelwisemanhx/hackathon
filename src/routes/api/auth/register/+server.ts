import { json } from '@sveltejs/kit';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { findUserByEmail, createUser } from '$lib/server/repositories/user';
import { checkRateLimit } from '$lib/server/utils/rate-limit';
import type { RequestHandler } from './$types';

// Validation schema for registration request
const registerSchema = z.object({
	email: z.string().email('Invalid email format'),
	password: z.string().min(8, 'Password must be at least 8 characters')
});

// Salt rounds for bcrypt hashing
const SALT_ROUNDS = 10;

/**
 * POST /api/auth/register
 * Register a new user with email and password
 */
export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	try {
		// Rate limiting check
		const clientIp = getClientAddress();
		if (!checkRateLimit(clientIp, 5, 3600000)) {
			return json(
				{
					error: {
						code: 'RATE_LIMIT_EXCEEDED',
						message: 'Too many registration attempts. Please try again later.',
						details: {}
					}
				},
				{ status: 429 }
			);
		}

		// Parse request body
		const body = await request.json();

		// Validate request data
		const validation = registerSchema.safeParse(body);
		if (!validation.success) {
			return json(
				{
					error: {
						code: 'VALIDATION_ERROR',
						message: 'Invalid request data',
						details: validation.error.flatten()
					}
				},
				{ status: 400 }
			);
		}

		const { email, password } = validation.data;

		// Check if email already exists
		const existingUser = await findUserByEmail(email);
		if (existingUser) {
			return json(
				{
					error: {
						code: 'EMAIL_EXISTS',
						message: 'Email already registered',
						details: { email }
					}
				},
				{ status: 409 }
			);
		}

		// Hash password
		const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

		// Create user in database
		const newUser = await createUser(email, passwordHash);

		// Return success response (exclude password_hash)
		return json(
			{
				user: {
					id: newUser.id,
					email: newUser.email,
					createdAt: newUser.createdAt
				}
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error('Registration error:', error);
		return json(
			{
				error: {
					code: 'INTERNAL_ERROR',
					message: 'An error occurred during registration',
					details: error instanceof Error ? error.message : 'Unknown error'
				}
			},
			{ status: 500 }
		);
	}
};
