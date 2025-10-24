# SvelteKit Demo App

A modern SvelteKit 5 demo application with Node.js adapter and server-side rendering enabled.

## 🎯 Features

- **SvelteKit 5** - Modern, fast web framework
- **Node.js Adapter** - Production-ready deployment
- **Server-Side Rendering (SSR)** - Better SEO and initial load performance
- **Vite** - Lightning-fast build tool
- **Svelte 5 Runes** - Reactive state management
- **Demo Pages** - Home, About, and Blog Post examples
- **API Routes** - Sample REST endpoint
- **Modern Styling** - Clean, responsive design

## 📁 Project Structure

```
src/
├── routes/
│   ├── +layout.svelte      # Root layout with navigation
│   ├── +page.svelte        # Home page
│   ├── about/
│   │   └── +page.svelte    # About page
│   ├── posts/
│   │   ├── +page.js        # Posts page loader
│   │   └── +page.svelte    # Posts page component
│   └── api/
│       └── hello/
│           └── +server.js  # Sample API endpoint
├── app.css                 # Global styles
└── app.html               # HTML shell

svelte.config.js            # SvelteKit configuration with Node adapter
vite.config.js             # Vite build configuration
tsconfig.json              # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm
- PostgreSQL 15+ (for database functionality)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up PostgreSQL database:

```bash
# Create the database
createdb ai_assessment

# Or using psql
psql -U postgres -c "CREATE DATABASE ai_assessment;"
```

3. Configure environment variables:

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your database credentials
# Update DB_PASSWORD with your PostgreSQL password
```

4. Push the database schema:

```bash
npm run db:push
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Database Commands

```bash
npm run db:generate  # Generate migration from schema changes
npm run db:push      # Push schema to database (development)
npm run db:studio    # Open Drizzle Studio (database GUI)
```

### Health Check

Verify your database connection:

```bash
curl http://localhost:5173/api/health
```

Or visit `http://localhost:5173/api/health` in your browser.

### Building

Build for production:

```bash
npm run build
```

This generates a standalone build directory with everything needed to run the app.

### Production

Run the built app:

```bash
npm start
```

The app will serve on `http://localhost:3000` by default.

## 📝 Available Routes

- **/** - Home page with interactive counter
- **/about** - About page with information about SvelteKit
- **/posts** - Blog posts page with sample data
- **/api/hello** - API endpoint (try `/api/hello?name=YourName`)

## 🔧 Configuration

### svelte.config.js

The app uses the `@sveltejs/adapter-node` with:

- **Output directory**: `build`
- **Precompression**: Enabled (gzip compression for assets)
- **Environment prefix**: `APP_` (for public variables)

### Key Features

- **SSR Enabled** - All pages rendered on the server
- **Node.js Runtime** - Standard Node.js environment
- **File-based routing** - Routes automatically created from file structure

## 📦 Build Output

When running `npm run build`, the output is a Node.js application that:

- Serves both static assets and dynamic pages
- Handles server-side rendering
- Can be deployed to any Node.js hosting platform

The build includes:
- `build/` - Production build directory
- `build/client/` - Precompressed static assets
- `build/server/` - Server bundles
- `build/index.js` - Entry point

## 🌐 Deployment

The Node adapter supports deployment to:

- Traditional servers (VPS, dedicated hosts)
- Platform services (Heroku, Railway, etc.)
- Container platforms (Docker, Kubernetes)
- Node.js-compatible serverless (Google Cloud Run, Azure Container Instances, etc.)

### Example: Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY build ./build
EXPOSE 3000
CMD ["node", "build"]
```

## 📚 Learn More

- [SvelteKit Documentation](https://kit.svelte.dev)
- [Svelte Documentation](https://svelte.dev)
- [Vite Documentation](https://vitejs.dev)

## 📄 License

MIT

---

**Created with ❤️ using SvelteKit 5**
