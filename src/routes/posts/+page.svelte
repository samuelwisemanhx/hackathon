<script>
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<div class="container">
	<h2>Blog Posts</h2>
	<p>Explore our collection of SvelteKit and Svelte articles.</p>

	<div class="posts-grid">
		{#each data.posts as post (post.id)}
			<article class="post-card">
				<h3>{post.title}</h3>
				<p class="excerpt">{post.excerpt}</p>
				<div class="meta">
					<span class="author">By {post.author}</span>
					<span class="date">{new Date(post.date).toLocaleDateString('en-US', {
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					})}</span>
				</div>
				<a href="#" class="read-more">Read More →</a>
			</article>
		{/each}
	</div>
</div>

<style>
	.container {
		background: white;
		border-radius: 0.5rem;
		padding: 2rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	h2 {
		color: #333;
		border-bottom: 3px solid #007bff;
		padding-bottom: 0.5rem;
		margin-top: 0;
	}

	.posts-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 2rem;
		margin-top: 2rem;
	}

	.post-card {
		background: #f9f9f9;
		border: 1px solid #e0e0e0;
		border-radius: 0.5rem;
		padding: 1.5rem;
		transition: all 0.3s ease;
	}

	.post-card:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		transform: translateY(-2px);
	}

	.post-card h3 {
		margin-top: 0;
		color: #333;
		font-size: 1.25rem;
	}

	.excerpt {
		color: #666;
		margin: 1rem 0;
		line-height: 1.6;
	}

	.meta {
		display: flex;
		justify-content: space-between;
		font-size: 0.875rem;
		color: #999;
		margin: 1rem 0;
	}

	.read-more {
		display: inline-block;
		color: #007bff;
		font-weight: bold;
		margin-top: 1rem;
		transition: all 0.3s;
	}

	.read-more:hover {
		color: #0056b3;
		margin-left: 0.25rem;
	}
</style>
