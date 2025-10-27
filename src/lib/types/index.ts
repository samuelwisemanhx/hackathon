// Centralized type definitions
// Per coding standards: All types should be defined in src/lib/types/ and imported

// Re-export database schema types
export type { User, NewUser, Session, NewSession } from '../server/db/schema';

/**
 * User entity representing a registered user account
 * Contains authentication credentials and account metadata
 */
export type { User };

/**
 * Session entity representing an active user session
 * Used for session-based authentication with token validation
 */
export type { Session };

/**
 * Type for creating a new user (omits auto-generated fields)
 */
export type { NewUser };

/**
 * Type for creating a new session (omits auto-generated fields)
 */
export type { NewSession };
