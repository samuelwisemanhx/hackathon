import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { config } from 'dotenv';

// Load environment variables
config();

// Create connection pool with proper configuration
const pool = new Pool({
	host: process.env.DB_HOST || 'localhost',
	port: parseInt(process.env.DB_PORT || '5432'),
	database: process.env.DB_NAME || 'ai_assessment',
	user: process.env.DB_USER || 'postgres',
	password: process.env.DB_PASSWORD || '',
	max: 20, // Maximum pool size as per architecture doc
	idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
	connectionTimeoutMillis: 2000, // Timeout after 2 seconds
	ssl: false // Disable SSL for local development
});

// Handle pool errors
pool.on('error', (err) => {
	console.error('Unexpected error on idle client', err);
	process.exit(-1);
});

// Create Drizzle instance with schema
export const db = drizzle(pool, { schema });

// Export pool for health checks
export { pool };
