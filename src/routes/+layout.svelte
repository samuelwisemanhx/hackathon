<script>
	import '../app.css';
</script>

<nav>
	<h1>SvelteKit Demo</h1>
	<ul>
		<li><a href="/">Home</a></li>
		<li><a href="/about">About</a></li>
		<li><a href="/posts">Posts</a></li>
	</ul>
</nav>

<main>
	<slot />
</main>

<footer>
	<p>&copy; 2025 SvelteKit Demo App</p>
</footer>

<style>
	:global(body) {
		margin: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
			Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		background-color: #f5f5f5;
	}

	nav {
		background-color: #333;
		color: white;
		padding: 1rem 2rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	nav h1 {
		margin: 0;
		font-size: 1.5rem;
	}

	nav ul {
		list-style: none;
		display: flex;
		gap: 2rem;
		margin: 0;
		padding: 0;
	}

	nav a {
		color: white;
		text-decoration: none;
		transition: opacity 0.3s;
	}

	nav a:hover {
		opacity: 0.7;
	}

	main {
		max-width: 1200px;
		margin: 2rem auto;
		padding: 0 1rem;
		min-height: calc(100vh - 200px);
	}

	footer {
		background-color: #333;
		color: white;
		text-align: center;
		padding: 2rem;
		margin-top: 2rem;
	}

	footer p {
		margin: 0;
	}
</style>
