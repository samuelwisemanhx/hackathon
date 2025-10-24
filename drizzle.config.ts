import type { Config } from 'drizzle-kit';

export default {
	schema: './src/lib/server/db/schema.ts',
	out: './drizzle/migrations',
	dialect: 'postgresql',
	dbCredentials: {
		host: process.env.DB_HOST || 'localhost',
		port: parseInt(process.env.DB_PORT || '5432'),
		user: process.env.DB_USER || 'postgres',
		password: process.env.DB_PASSWORD || '',
		database: process.env.DB_NAME || 'ai_assessment',
		ssl: false
	}
} satisfies Config;
