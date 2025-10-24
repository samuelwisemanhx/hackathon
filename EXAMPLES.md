# SvelteKit Examples & Patterns

This file shows common patterns and how to extend your SvelteKit app.

## Table of Contents
1. [Page Creation](#page-creation)
2. [Reactive State](#reactive-state)
3. [Data Loading](#data-loading)
4. [API Endpoints](#api-endpoints)
5. [Forms & Actions](#forms--actions)

---

## Page Creation

### Simple Static Page

Create `src/routes/dashboard/+page.svelte`:

```svelte
<script>
	import '../app.css';
</script>

<div class="container">
	<h1>Dashboard</h1>
	<p>Welcome to your dashboard!</p>
</div>

<style>
	.container {
		padding: 2rem;
	}
</style>
```

Access at: `http://localhost:5173/dashboard`

---

## Reactive State

### Using Svelte 5 Runes

```svelte
<script>
	// Declare reactive state
	let count = $state(0);
	let name = $state('User');

	// Derived state
	let greeting = $derived(`Hello, ${name}!`);

	function increment() {
		count++;
	}

	function reset() {
		count = 0;
	}
</script>

<div>
	<h2>{greeting}</h2>
	<p>Count: {count}</p>

	<button onclick={increment}>+</button>
	<button onclick={reset}>Reset</button>

	<input type="text" bind:value={name} placeholder="Enter your name" />
</div>
```

**Key Concepts:**
- `$state()` - Create reactive variables
- `$derived()` - Create computed values
- `bind:value` - Two-way data binding
- `onclick` - Event handlers

---

## Data Loading

### Loading Data on Page Load

Create `src/routes/users/+page.js`:

```javascript
export async function load({ fetch }) {
	// This runs on server and client
	const response = await fetch('/api/users');
	const users = await response.json();

	return {
		users
	};
}
```

Create `src/routes/users/+page.svelte`:

```svelte
<script>
	export let data;
</script>

<h1>Users</h1>

<ul>
	{#each data.users as user (user.id)}
		<li>
			<strong>{user.name}</strong> - {user.email}
		</li>
	{/each}
</ul>
```

**Key Concepts:**
- `+page.js` with `load` function runs on server (SSR)
- Data is passed to `+page.svelte` as `data` prop
- Great for fetching from databases before rendering

---

## API Endpoints

### GET Endpoint (Already Created)

File: `src/routes/api/hello/+server.js`

```javascript
import { json } from '@sveltejs/kit';

export function GET({ url }) {
	const name = url.searchParams.get('name') ?? 'World';

	return json({
		message: `Hello, ${name}!`,
		timestamp: new Date().toISOString(),
		version: '1.0.0'
	});
}
```

**Usage:**
```bash
curl 'http://localhost:5173/api/hello?name=Alice'
# Returns: {"message":"Hello, Alice!","timestamp":"...","version":"1.0.0"}
```

### POST Endpoint (New Example)

Create `src/routes/api/todos/+server.js`:

```javascript
import { json, error } from '@sveltejs/kit';

// In-memory storage (replace with database in production)
let todos = [
	{ id: 1, title: 'Learn SvelteKit', completed: false },
	{ id: 2, title: 'Build an app', completed: false }
];

let nextId = 3;

export async function GET() {
	return json(todos);
}

export async function POST({ request }) {
	const data = await request.json();

	// Validation
	if (!data.title) {
		return error(400, 'Title is required');
	}

	const todo = {
		id: nextId++,
		title: data.title,
		completed: false
	};

	todos.push(todo);

	return json(todo, { status: 201 });
}

export async function PUT({ request, params }) {
	const { id } = params;
	const data = await request.json();

	const todo = todos.find((t) => t.id === Number(id));
	if (!todo) {
		return error(404, 'Todo not found');
	}

	Object.assign(todo, data);
	return json(todo);
}

export async function DELETE({ params }) {
	const { id } = params;
	todos = todos.filter((t) => t.id !== Number(id));
	return json({ success: true });
}
```

**Usage:**
```bash
# GET all todos
curl http://localhost:5173/api/todos

# POST new todo
curl -X POST http://localhost:5173/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"New Todo"}'

# PUT update
curl -X PUT http://localhost:5173/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'

# DELETE
curl -X DELETE http://localhost:5173/api/todos/1
```

---

## Forms & Actions

### Simple Form (Recommended)

Create `src/routes/contact/+page.js`:

```javascript
export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name');
		const email = data.get('email');
		const message = data.get('message');

		// Validate
		if (!name || !email || !message) {
			return {
				status: 400,
				error: 'All fields are required'
			};
		}

		// Process form (send email, save to DB, etc.)
		console.log('Form received:', { name, email, message });

		return {
			status: 200,
			success: true,
			message: 'Thank you for contacting us!'
		};
	}
};
```

Create `src/routes/contact/+page.svelte`:

```svelte
<script>
	import { enhance } from '$app/forms';

	export let form;
</script>

<h1>Contact Us</h1>

{#if form?.success}
	<div class="success">
		{form.message}
	</div>
{/if}

{#if form?.error}
	<div class="error">
		{form.error}
	</div>
{/if}

<form method="POST" use:enhance>
	<div>
		<label for="name">Name</label>
		<input type="text" id="name" name="name" required />
	</div>

	<div>
		<label for="email">Email</label>
		<input type="email" id="email" name="email" required />
	</div>

	<div>
		<label for="message">Message</label>
		<textarea id="message" name="message" required></textarea>
	</div>

	<button type="submit">Send</button>
</form>

<style>
	form {
		max-width: 600px;
		margin: 2rem auto;
	}

	div {
		margin-bottom: 1rem;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: bold;
	}

	input,
	textarea {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 0.25rem;
	}

	button {
		background-color: #007bff;
		color: white;
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 0.25rem;
		cursor: pointer;
	}

	button:hover {
		background-color: #0056b3;
	}

	.success {
		background-color: #d4edda;
		color: #155724;
		padding: 1rem;
		border-radius: 0.25rem;
		margin-bottom: 1rem;
	}

	.error {
		background-color: #f8d7da;
		color: #721c24;
		padding: 1rem;
		border-radius: 0.25rem;
		margin-bottom: 1rem;
	}
</style>
```

**Key Concepts:**
- `export const actions` in `+page.js` handles form submissions
- `use:enhance` in Svelte provides automatic form enhancement
- Form data is sent via POST and processed server-side
- Results are automatically populated in `form` variable

---

## Directory Structure

### Add a Multi-Level Route

```
src/routes/
├── blog/
│   ├── +page.js              # /blog
│   ├── +page.svelte
│   └── [slug]/
│       ├── +page.js          # /blog/my-post
│       └── +page.svelte
```

Create `src/routes/blog/[slug]/+page.js`:

```javascript
export async function load({ params }) {
	// params.slug contains the URL parameter
	const { slug } = params;

	// Fetch post by slug
	const response = await fetch(`/api/posts/${slug}`);
	const post = await response.json();

	return { post };
}
```

Access at: 
- `http://localhost:5173/blog/my-post`
- `http://localhost:5173/blog/another-post`

---

## Server-Only Code

### Database Connection (Server-Only)

Create `src/lib/server/db.js`:

```javascript
// This file is only used on the server (prefixed with server)
// It's never sent to the browser

export async function connectDatabase() {
	// Connect to your database
	console.log('Connecting to database...');
}

export async function getUser(id) {
	// Database query
	return { id, name: 'John Doe' };
}
```

Use in `src/routes/+page.js`:

```javascript
import { getUser } from '$lib/server/db.js';

export async function load({ params }) {
	const user = await getUser(1);
	return { user };
}
```

**Key Concepts:**
- Files in `$lib/server/` are only available server-side
- Perfect for database queries, API keys, secrets
- Never exposed to the browser

---

## Environment Variables

Create `.env` file in project root:

```
APP_API_URL=http://localhost:3000
APP_PUBLIC_KEY=abc123
PRIVATE_SECRET=super_secret
```

Use in components:

```javascript
import { env } from '$env/dynamic/public';

export function load() {
	return {
		apiUrl: env.APP_API_URL
	};
}
```

Use server-side:

```javascript
import { env } from '$env/dynamic/private';

export async function load() {
	const secret = env.PRIVATE_SECRET;
	// Use secret...
}
```

**Key Concepts:**
- `APP_` prefix makes variables public (visible in browser)
- Private variables don't use prefix
- Use `$env/dynamic/*` for runtime values
- Use `$env/static/*` for compile-time values

---

## Deploying

### Build

```bash
npm run build
```

Creates optimized `build/` directory.

### Run Locally

```bash
npm start
```

### Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy built app
COPY build ./build

EXPOSE 3000

CMD ["node", "build"]
```

Build image:

```bash
docker build -t sveltekit-app .
```

Run container:

```bash
docker run -p 3000:3000 sveltekit-app
```

---

## Tips & Best Practices

1. **Use TypeScript** - Add type safety to your code
2. **Server-side validation** - Always validate on the server
3. **Environment variables** - Keep secrets out of code
4. **Page load functions** - Fetch data before rendering
5. **API routes** - Create RESTful endpoints
6. **Layouts** - Share UI across pages
7. **Error handling** - Use try/catch and `error()` function
8. **Testing** - SvelteKit includes Vitest by default

---

## Common Mistakes to Avoid

❌ **Don't:** Fetch data in components (use `load` instead)

❌ **Don't:** Put API keys in client code

❌ **Don't:** Skip validation

✅ **Do:** Use `+page.js` `load` function

✅ **Do:** Use server routes for sensitive operations

✅ **Do:** Validate on server and client

---

## Next Steps

1. Run `npm run dev` and open `http://localhost:5173`
2. Click through the demo pages
3. Try the API: `curl 'http://localhost:5173/api/hello?name=Test'`
4. Create your first custom page
5. Add a form with validation
6. Deploy to your favorite platform

Happy building! 🎉
