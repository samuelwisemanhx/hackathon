/**
 * Simple in-memory rate limiting for MVP
 * For production, use Redis-based rate limiting
 */

interface RateLimitRecord {
	count: number;
	resetAt: number;
}

const attempts = new Map<string, RateLimitRecord>();

/**
 * Check if a client has exceeded rate limit
 * @param ip - Client IP address
 * @param maxAttempts - Maximum number of attempts allowed (default: 5)
 * @param windowMs - Time window in milliseconds (default: 1 hour)
 * @returns true if request should be allowed, false if rate limit exceeded
 */
export function checkRateLimit(
	ip: string,
	maxAttempts: number = 5,
	windowMs: number = 3600000
): boolean {
	const now = Date.now();
	const record = attempts.get(ip);

	// No record or window expired - allow and create new record
	if (!record || now > record.resetAt) {
		attempts.set(ip, { count: 1, resetAt: now + windowMs });
		return true;
	}

	// Rate limit exceeded
	if (record.count >= maxAttempts) {
		return false;
	}

	// Increment count and allow
	record.count++;
	return true;
}

/**
 * Reset rate limit for a specific IP (useful for testing)
 * @param ip - Client IP address
 */
export function resetRateLimit(ip: string): void {
	attempts.delete(ip);
}
