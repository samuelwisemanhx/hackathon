# Quick Command Reference

## 📝 Available npm Commands

### Development

```bash
npm run dev
```
Starts the development server with hot module replacement (HMR).
- Access at: `http://localhost:5173`
- Auto-reloads on file changes
- Full debugging capabilities

### Building

```bash
npm run build
```
Creates an optimized production build.
- Output: `build/` directory
- Precompressed assets included
- Ready to deploy to Node.js server

### Preview

```bash
npm run preview
```
Preview the production build locally (requires `npm run build` first).
- Simulates production environment
- Uses the built files from `build/`

### Production Run

```bash
npm start
```
Runs the production build.
- Uses the built files from `build/`
- Serves on `http://localhost:3000`
- Optimized for production

---

## 🌐 Testing the App

### Homepage
```bash
curl http://localhost:5173
```

### API Endpoint
```bash
curl 'http://localhost:5173/api/hello?name=YourName'
```

### In Browser
- Home: http://localhost:5173/
- About: http://localhost:5173/about
- Posts: http://localhost:5173/posts
- API: http://localhost:5173/api/hello?name=Test

---

## 🔨 Development Workflow

1. **Start Dev Server**
   ```bash
   npm run dev
   ```

2. **Make Changes**
   - Edit files in `src/`
   - Changes auto-reload in browser

3. **Create New Page**
   ```bash
   mkdir -p src/routes/my-page
   touch src/routes/my-page/+page.svelte
   ```

4. **Create API Endpoint**
   ```bash
   mkdir -p src/routes/api/my-endpoint
   touch src/routes/api/my-endpoint/+server.js
   ```

5. **Test Build**
   ```bash
   npm run build
   npm run preview
   ```

---

## 📦 Build & Deploy Workflow

1. **Develop Locally**
   ```bash
   npm run dev
   ```

2. **Test Production Build**
   ```bash
   npm run build
   npm run preview
   ```

3. **Deploy**
   - Copy `build/` to server
   - Run `node build` or `npm start`

---

## 🐳 Docker Commands

### Build Docker Image
```bash
docker build -t sveltekit-app .
```

### Run Docker Container
```bash
docker run -p 3000:3000 sveltekit-app
```

### Access Container
```bash
curl http://localhost:3000
```

---

## 📂 File Structure Commands

### Create New Route
```bash
mkdir -p src/routes/new-page
echo '<h1>New Page</h1>' > src/routes/new-page/+page.svelte
```

### Create API Endpoint
```bash
mkdir -p src/routes/api/endpoint
cat > src/routes/api/endpoint/+server.js << 'EOF'
import { json } from '@sveltejs/kit';

export function GET() {
	return json({ data: 'hello' });
}
EOF
```

### Create Data Loader
```bash
cat > src/routes/my-route/+page.js << 'EOF'
export async function load() {
	return { data: 'example' };
}
EOF
```

---

## 🧹 Cleaning Up

### Remove Build Directory
```bash
rm -rf build/
```

### Remove Node Modules
```bash
rm -rf node_modules/
```

### Clean Build
```bash
npm run build --clean
```

---

## ⚙️ Configuration Commands

### Update Dependencies
```bash
npm update
```

### Check for Vulnerabilities
```bash
npm audit
```

### Fix Vulnerabilities
```bash
npm audit fix
```

---

## 🚀 Deployment Commands

### Build for Production
```bash
npm run build
```

### Run Production Server
```bash
npm start
```

### Start with Environment File
```bash
node --env-file=.env build
```

### Start with dotenv (Node < 20.6)
```bash
node -r dotenv/config build
```

---

## 📊 Checking Status

### Check npm Scripts
```bash
npm run
```

### List Installed Packages
```bash
npm list
```

### Check Node Version
```bash
node --version
npm --version
```

---

## 💡 Useful Tips

### Enable TypeScript
- Files with `.ts` or `.svelte` extensions
- Configuration in `tsconfig.json`

### Environment Variables
Create `.env` file:
```
APP_PUBLIC_VAR=value
PRIVATE_VAR=secret
```

### Debug Mode
```bash
DEBUG=* npm run dev
```

### Build Visualizer
```bash
npm install -D @visualizer/rollup-plugin
```

---

## 🔗 Quick Links

- Documentation: See `README.md`
- Examples: See `EXAMPLES.md`
- Setup Info: See `SETUP_SUMMARY.md`
- SvelteKit Docs: https://kit.svelte.dev

---

## 📞 Troubleshooting

### Port Already in Use
```bash
# Use different port (requires development mode)
npm run dev -- --port 3001
```

### Clear Cache
```bash
rm -rf .svelte-kit/
npm run dev
```

### Fresh Install
```bash
rm -rf node_modules/ package-lock.json
npm install
```

---

Keep this file handy for quick reference! 🚀
