import { json } from '@sveltejs/kit';
import { pool } from '$lib/server/db';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	try {
		// Test database connection
		const client = await pool.connect();
		try {
			const result = await client.query('SELECT NOW() as timestamp, version() as version');
			const dbInfo = result.rows[0];

			return json({
				status: 'healthy',
				timestamp: new Date().toISOString(),
				database: {
					connected: true,
					timestamp: dbInfo.timestamp,
					version: dbInfo.version
				},
				environment: {
					node: process.version,
					nodeEnv: process.env.NODE_ENV || 'development'
				}
			});
		} finally {
			client.release();
		}
	} catch (error) {
		console.error('Health check failed:', error);

		return json(
			{
				status: 'unhealthy',
				timestamp: new Date().toISOString(),
				database: {
					connected: false,
					error: error instanceof Error ? error.message : 'Unknown error'
				},
				environment: {
					node: process.version,
					nodeEnv: process.env.NODE_ENV || 'development'
				}
			},
			{ status: 503 }
		);
	}
};
