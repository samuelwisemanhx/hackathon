export function load() {
	const posts = [
		{
			id: 1,
			title: 'Getting Started with SvelteKit',
			excerpt: 'Learn how to set up your first SvelteKit project',
			date: '2025-01-15',
			author: 'John Doe'
		},
		{
			id: 2,
			title: 'Understanding Svelte 5 Runes',
			excerpt: 'Deep dive into reactive state management with the new runes API',
			date: '2025-01-10',
			author: 'Jane Smith'
		},
		{
			id: 3,
			title: 'Deploying SvelteKit to Production',
			excerpt: 'Best practices for deploying your SvelteKit app using the Node adapter',
			date: '2025-01-05',
			author: 'Bob Johnson'
		},
		{
			id: 4,
			title: 'Building APIs with SvelteKit',
			excerpt: 'Create RESTful endpoints using SvelteKit server routes',
			date: '2024-12-28',
			author: 'Alice Brown'
		}
	];

	return { posts };
}
