import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export function GET({ url }) {
	const name = url.searchParams.get('name') ?? 'World';

	return json({
		message: `Hello, ${name}!`,
		timestamp: new Date().toISOString(),
		version: '1.0.0'
	});
}
