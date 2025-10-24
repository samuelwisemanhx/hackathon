<script>
	let count = $state(0);

	function increment() {
		count++;
	}

	function decrement() {
		count--;
	}
</script>

<div class="container">
	<h2>Welcome to SvelteKit!</h2>
	<p>This is a demo SvelteKit application with the Node adapter and server-side rendering.</p>

	<section class="demo-section">
		<h3>Interactive Counter</h3>
		<div class="counter">
			<button onclick={decrement}>−</button>
			<span>{count}</span>
			<button onclick={increment}>+</button>
		</div>
	</section>

	<section class="demo-section">
		<h3>Features</h3>
		<ul>
			<li>⚡ Fast with Vite</li>
			<li>🎯 Server-side rendering enabled</li>
			<li>🚀 Node.js adapter for deployment</li>
			<li>📦 Modern SvelteKit 5 setup</li>
			<li>💎 Reactive state with runes</li>
		</ul>
	</section>

	<section class="demo-section">
		<h3>Learn More</h3>
		<p>
			Visit the <a href="/about">About</a> page or check out the
			<a href="/posts">Posts</a> section to explore more features.
		</p>
	</section>
</div>

<style>
	.container {
		background: white;
		border-radius: 0.5rem;
		padding: 2rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	h2 {
		margin-top: 0;
		color: #333;
	}

	.demo-section {
		margin-top: 2rem;
	}

	.demo-section h3 {
		color: #555;
		border-bottom: 2px solid #007bff;
		padding-bottom: 0.5rem;
	}

	.counter {
		display: flex;
		gap: 1rem;
		align-items: center;
		margin: 1rem 0;
		font-size: 1.5rem;
		font-weight: bold;
	}

	.counter span {
		min-width: 3rem;
		text-align: center;
	}

	ul {
		list-style-position: inside;
		line-height: 1.8;
	}
</style>
